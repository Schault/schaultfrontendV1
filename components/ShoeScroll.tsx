"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

if (typeof window !== "undefined" && !("requestIdleCallback" in window)) {
  (window as any).requestIdleCallback = (cb: Function) =>
    setTimeout(() => cb({ timeRemaining: () => 50 }), 1);
  (window as any).cancelIdleCallback = (id: number) => clearTimeout(id);
}

const SEQUENCE_PATH = "/sequence";
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_EXT = "jpg";
const TOTAL_FRAMES = 240;
const INITIAL_PRELOAD = 10;
const BATCH_SIZE = 15;
const PRELOAD_AHEAD = 20;

const IDLE_CHUNK_SIZE = 5;
const IDLE_SCROLL_TIMEOUT = 2000;

function getFramePath(i: number): string {
  return `${SEQUENCE_PATH}/${FRAME_PREFIX}${String(i + 1).padStart(3, "0")}.${FRAME_EXT}`;
}

type ScrollContextValue = {
  scrollProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useShoeScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useShoeScroll must be used inside ShoeScroll");
  return ctx;
}

const ANGLES = [
  { name: "Front", frame: 0 },
  { name: "Side", frame: 40 },
  { name: "Perspective", frame: 80 },
  { name: "Top", frame: 120 },
  { name: "Sole", frame: 160 },
  { name: "Back", frame: 200 },
];

export default function ShoeScroll({
  children,
}: {
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_FRAMES));
  const loadedFramesRef = useRef(new Set<number>());
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isDrawingRef = useRef(false);

  const idleCallbackRef = useRef<number | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const idleLoadIndexRef = useRef<number>(INITIAL_PRELOAD); 
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [ready, setReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);



  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProgress = useMotionValue(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    let targetRenderIndex = Math.min(
      Math.max(0, Math.round(index)),
      TOTAL_FRAMES - 1
    );

    // Fallback strategy: if requested frame isn't loaded, find nearest loaded frame <= index
    if (!loadedFramesRef.current.has(targetRenderIndex)) {
      let fallbackIndex = -1;
      for (let i = targetRenderIndex; i >= 0; i--) {
        if (loadedFramesRef.current.has(i)) {
          fallbackIndex = i;
          break;
        }
      }
      targetRenderIndex = fallbackIndex !== -1 ? fallbackIndex : 0;
    }

    const frames = framesRef.current;
    const img = frames[targetRenderIndex];

    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Center and scale image inside canvas with a small buffer margin
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * 0.95;
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const x = (w - drawW) / 2;
    const y = (h - drawH) / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, drawW, drawH);

    currentFrameRef.current = Math.min(
      Math.max(0, Math.round(index)),
      TOTAL_FRAMES - 1
    );
    isDrawingRef.current = false;
  }, []);

  const loadBatch = useCallback((startIndex: number, size: number) => {
    const endIndex = Math.min(startIndex + size, TOTAL_FRAMES);
    const promises: Promise<void>[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (!loadedFramesRef.current.has(i) && !framesRef.current[i]) {
        promises.push(
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              loadedFramesRef.current.add(i);
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load frame ${i}`);
              resolve();
            };
            img.src = getFramePath(i);
            framesRef.current[i] = img;
          })
        );
      }
    }

    return Promise.all(promises);
  }, []);

  const startIdleLoading = useCallback(() => {
    if (isScrollingRef.current) return;
    if (loadedFramesRef.current.size >= TOTAL_FRAMES) return;

    if (idleCallbackRef.current !== null) {
      (window as any).cancelIdleCallback(idleCallbackRef.current);
    }

    idleCallbackRef.current = (window as any).requestIdleCallback(
      (deadline: any) => {
        if (isScrollingRef.current) return;

        let loadedInThisChunk = 0;
        while (
          loadedInThisChunk < IDLE_CHUNK_SIZE &&
          idleLoadIndexRef.current < TOTAL_FRAMES &&
          deadline.timeRemaining() > 0
        ) {
          const i = idleLoadIndexRef.current;
          if (!loadedFramesRef.current.has(i) && !framesRef.current[i]) {
            const img = new Image();
            img.onload = () => loadedFramesRef.current.add(i);
            img.onerror = () => {
              console.warn(`Failed idle load ${i}`);
            };
            img.src = getFramePath(i);
            framesRef.current[i] = img;
            loadedInThisChunk++;
          }
          idleLoadIndexRef.current++;
        }

        if (
          loadedFramesRef.current.size < TOTAL_FRAMES &&
          idleLoadIndexRef.current < TOTAL_FRAMES
        ) {
          startIdleLoading();
        }
      },
      { timeout: 5000 }
    );
  }, []);

  // Preload first batch on mount
  useEffect(() => {
    let isMounted = true;

    loadBatch(0, INITIAL_PRELOAD).then(() => {
      if (!isMounted) return;
      resizeCanvas();

      setTimeout(() => {
        if (!isMounted) return;
        drawFrame(0);
        setReady(true);

        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          startIdleLoading();
        }, IDLE_SCROLL_TIMEOUT);
      }, 50);
    });

    return () => {
      isMounted = false;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (idleCallbackRef.current !== null) {
        (window as any).cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, [loadBatch, resizeCanvas, drawFrame, startIdleLoading]);

  useEffect(() => {
    if (!ready) return;
    const handleResize = () => {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ready, resizeCanvas, drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    scrollProgress.set(progress);

    if (!ready) return;

    // Sync scroll progress with vertical step active indicators
    const stepIndex = Math.min(Math.max(Math.floor(progress * 6), 0), 5);
    setActiveStep((prev) => (prev !== stepIndex ? stepIndex : prev));

    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    if (idleCallbackRef.current !== null) {
      (window as any).cancelIdleCallback(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      startIdleLoading();
    }, IDLE_SCROLL_TIMEOUT);

    const targetIndex = Math.min(
      Math.max(Math.round(progress * (TOTAL_FRAMES - 1)), 0),
      TOTAL_FRAMES - 1
    );

    const aheadIndex = Math.min(targetIndex + PRELOAD_AHEAD, TOTAL_FRAMES - 1);
    if (!loadedFramesRef.current.has(aheadIndex)) {
      loadBatch(targetIndex, BATCH_SIZE);
    }

    if (isDrawingRef.current) return;
    if (targetIndex === currentFrameRef.current) return;

    isDrawingRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      drawFrame(targetIndex);
    });
  });



  // Smooth scroll helper when progress indicator or thumbnail card is clicked
  const scrollToFrame = (frameIndex: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startScrollY = window.scrollY + rect.top;
    const totalScrollable = window.innerHeight * 3;
    const targetScrollY = startScrollY + (frameIndex / (TOTAL_FRAMES - 1)) * totalScrollable;

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    }
  };

  const handleStepClick = (stepIdx: number) => {
    const targetFrame = ANGLES[stepIdx].frame;
    scrollToFrame(targetFrame);
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStep < 5) {
      handleStepClick(activeStep + 1);
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollProgress, scrollYProgress }}>
      <div
        ref={containerRef}
        className="relative w-full bg-[#F6F6F4]"
        style={{ height: "400vh" }}
      >
        <div 
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
        >
          {/* Main Grid Layout */}
          <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-12 px-6 md:px-12 lg:px-24 items-center flex-1 pt-28 pb-12">
            {/* Left Content column - fits Column 1 to 5 */}
            <div className="col-span-5 flex flex-col justify-center">
              {children}
            </div>

            {/* Right Shoe column - fits Column 6 to 12 */}
            <div className="col-span-7 flex flex-col items-center justify-center relative">
              {/* Fixed Position Wrapper */}
              <div
                className="relative flex items-center justify-center w-[120%] aspect-square max-w-[500px] lg:max-w-[540px] xl:max-w-[580px] mr-[-5vw] lg:mr-[-10vw]"
              >
                {/* Canvas for the Shoe sequence */}
                <canvas
                  ref={canvasRef}
                  className={`transition-opacity duration-[1000ms] ${
                    ready ? "opacity-100" : "opacity-0"
                  } w-full h-full mix-blend-multiply`}
                  style={{
                    display: "block",
                  }}
                  aria-hidden
                />

                {/* Realistic Static Shadow underneath shoe */}
                <div
                  className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[75%] h-6 bg-black/10 rounded-full blur-[20px] pointer-events-none"
                />
              </div>


            </div>
          </div>


        </div>
      </div>
    </ScrollContext.Provider>
  );
}
