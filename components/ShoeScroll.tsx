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
  motion,
  type MotionValue,
} from "framer-motion";

const TOTAL_FRAMES = 200;

function getFramePath(i: number): string {
  return `/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
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
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isDrawingRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState(0);
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

    const frames = framesRef.current;
    if (frames.length === 0) return;

    const clamped = Math.min(Math.max(0, Math.round(index)), frames.length - 1);
    const img = frames[clamped];
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

    currentFrameRef.current = clamped;
    isDrawingRef.current = false;
  }, []);

  useEffect(() => {
    const total = TOTAL_FRAMES;
    const images = new Array<HTMLImageElement>(total);
    framesRef.current = images;
    loadedCountRef.current = 0;

    for (let i = 0; i < total; i++) {
      const img = new Image();

      const onDone = () => {
        loadedCountRef.current += 1;
        const pct = Math.round((loadedCountRef.current / total) * 100);
        setLoadProgress(pct);

        if (loadedCountRef.current === total) {
          resizeCanvas();
          setTimeout(() => {
            drawFrame(0);
            setReady(true);
          }, 100);
        }
      };

      img.onload = onDone;
      img.onerror = onDone;
      img.src = getFramePath(i);
      images[i] = img;
    }
  }, [resizeCanvas, drawFrame]);

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

    if (!ready || framesRef.current.length === 0) return;

    const targetIndex = Math.min(
      Math.max(Math.round(progress * (TOTAL_FRAMES - 1)), 0),
      TOTAL_FRAMES - 1
    );

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
      {/* Loading overlay ON TOP — scroll container is ALWAYS in the DOM */}
      {!ready && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
          <div className="absolute top-0 left-0 h-1 w-full bg-black/5">
            <motion.div
              className="h-full bg-[#CC0000]"
              style={{ width: loadProgress + "%" }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </div>
          <p className="font-bebas text-5xl tracking-wide text-black/90 md:text-7xl">
            SCHAULT
          </p>
          <p className="mt-2 font-inter text-sm text-black/60">
            {loadProgress}%
          </p>
        </div>
      )}

      {/* Scroll container — ALWAYS rendered so useScroll can attach to containerRef */}
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
