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

const TOTAL_FRAMES = 200;
const INITIAL_PRELOAD = 10;
const BATCH_SIZE = 15;
const PRELOAD_AHEAD = 20;

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
  if (!ctx)
    throw new Error("useShoeScroll must be used inside ShoeScroll");
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

  const [ready, setReady] = useState(false);

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

    let targetRenderIndex = Math.min(Math.max(0, Math.round(index)), TOTAL_FRAMES - 1);

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
    
    // Safety check just in case even frame 0 hasn't fully fired onload yet but is available
    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalW = canvas.width / dpr;
    const logicalH = canvas.height / dpr;

    const scale = Math.min(
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

    currentFrameRef.current = Math.min(Math.max(0, Math.round(index)), TOTAL_FRAMES - 1);
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
              resolve(); // silently continue
            };
            img.src = getFramePath(i);
            framesRef.current[i] = img;
          })
        );
      }
    }

    return Promise.all(promises);
  }, []);

  // STEP 1: PRELOAD FIRST 10 FRAMES ON MOUNT
  useEffect(() => {
    let isMounted = true;

    loadBatch(0, INITIAL_PRELOAD).then(() => {
      if (!isMounted) return;
      resizeCanvas();
      
      // Delay initial draw safely
      setTimeout(() => {
        if (!isMounted) return;
        drawFrame(0);
        setReady(true);
      }, 50);
    });

    return () => {
      isMounted = false;
    };
  }, [loadBatch, resizeCanvas, drawFrame]);

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

    const targetIndex = Math.min(
      Math.max(Math.round(progress * (TOTAL_FRAMES - 1)), 0),
      TOTAL_FRAMES - 1
    );

    // BATCH LOADING AHEAD STRATEGY
    const aheadIndex = Math.min(targetIndex + PRELOAD_AHEAD, TOTAL_FRAMES - 1);
    if (!loadedFramesRef.current.has(aheadIndex)) {
      // Trigger load for the next batch starting near current index
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
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
