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
  type MotionValue,
} from "framer-motion";

if (typeof window !== "undefined" && !("requestIdleCallback" in window)) {
  (window as any).requestIdleCallback = (cb: Function) =>
    setTimeout(() => cb({ timeRemaining: () => 50 }), 1);
  (window as any).cancelIdleCallback = (id: number) => clearTimeout(id);
}

const TOTAL_FRAMES = 200;
const INITIAL_PRELOAD = 10;
const BATCH_SIZE = 15;
const PRELOAD_AHEAD = 20;

const IDLE_CHUNK_SIZE = 5;
const IDLE_SCROLL_TIMEOUT = 2000;

function getFramePath(i: number): string {
  return `/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.webp`;
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
  const idleLoadIndexRef = useRef<number>(INITIAL_PRELOAD); // frames 0-9 requested in Phase 1
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [ready, setReady] = useState(false);
  const [devLoadedCount, setDevLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollProgress = useMotionValue(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
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
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;

    const scale = Math.max(
      logicalW / img.naturalWidth,
      logicalH / img.naturalHeight
    );
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const x = (logicalW - drawW) / 2;
    const y = (logicalH - drawH) / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, logicalW, logicalH);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, logicalW, logicalH);
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

  // STEP 1: PRELOAD FIRST 10 FRAMES ON MOUNT
  useEffect(() => {
    let isMounted = true;

    loadBatch(0, INITIAL_PRELOAD).then(() => {
      if (!isMounted) return;
      resizeCanvas();

      setTimeout(() => {
        if (!isMounted) return;
        drawFrame(0);
        setReady(true);

        // Begin Phase 3 idle loading after initial load
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

  // Handle Dev Mode indicator
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const interval = setInterval(() => {
      setDevLoadedCount(loadedFramesRef.current.size);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

    // SCROLL PAUSE/RESUME IDLE LOAD LOGIC
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

    // BATCH LOADING AHEAD STRATEGY (PHASE 2)
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

  return (
    <ScrollContext.Provider value={{ scrollProgress, scrollYProgress }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "500vh",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <canvas
            ref={canvasRef}
            className={`transition-opacity duration-[1000ms] ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
            }}
            aria-hidden
          />
          {children}
          
          {/* Dev Mode Load Indicator */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 z-[9999] rounded bg-black/80 px-3 py-1 font-inter text-xs text-white shadow-lg">
              Frames: {devLoadedCount} / {TOTAL_FRAMES}
            </div>
          )}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
