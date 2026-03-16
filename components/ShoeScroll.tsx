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
import { useScroll, motion, useMotionValue, type MotionValue } from "framer-motion";

const TOTAL_FRAMES = 200;
const SEQUENCE_BASE = "/sequence/ezgif-frame-";
const SEQUENCE_EXT = ".png";

function getFramePath(index: number): string {
  const padded = String(index + 1).padStart(3, "0");
  return `${SEQUENCE_BASE}${padded}${SEQUENCE_EXT}`;
}

type ScrollContextValue = {
  /** RAF-driven progress (0–1), in sync with canvas. Use this for overlay opacity. */
  scrollProgress: MotionValue<number>;
  /** Legacy useScroll progress; keep for any non-overlay use. */
  scrollYProgress: MotionValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useShoeScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useShoeScroll must be used inside ShoeScroll");
  return ctx;
}

type ShoeScrollProps = {
  children?: ReactNode;
};

/**
 * Apple-style scroll-driven animation: one RAF loop reads scroll position
 * every frame and updates the canvas, so the animation stays smooth at 60fps
 * instead of relying on throttled scroll events.
 */
function getScrollProgress(container: HTMLElement): number {
  const rect = container.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const scrollRange = rect.height - viewportHeight;
  if (scrollRange <= 0) return rect.top <= 0 ? 1 : 0;
  const progress = -rect.top / scrollRange;
  return Math.max(0, Math.min(1, progress));
}

export default function ShoeScroll({ children }: ShoeScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef(-1);
  const framesRef = useRef<HTMLImageElement[]>([]);
  framesRef.current = frames;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  /** RAF-driven progress so overlays stay in sync with canvas and stay crisp */
  const scrollProgress = useMotionValue(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;
  }, []);

  const updateCanvas = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || typeof window === "undefined") return;

      const currentFrames = framesRef.current;
      if (currentFrames.length === 0) return;

      // Ensure canvas is sized (e.g. after mount or if resize ran too early)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width === 0 || canvas.height === 0) {
        resizeCanvas();
      }
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;
      if (logicalWidth <= 0 || logicalHeight <= 0) return;

      const frameIndexClamped = Math.min(
        Math.max(0, Math.round(index)),
        currentFrames.length - 1
      );
      const img = currentFrames[frameIndexClamped];
      if (!img?.complete || !img.naturalWidth) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scaleToFit = Math.min(
        logicalWidth / img.naturalWidth,
        logicalHeight / img.naturalHeight
      );
      const scale = Math.min(scaleToFit, 1);
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const x = (logicalWidth - drawWidth) / 2;
      const y = (logicalHeight - drawHeight) / 2;

      if (scale >= 1) {
        ctx.imageSmoothingEnabled = false;
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      // Reset transform then apply DPR scale to avoid cumulative scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      lastFrameRef.current = frameIndexClamped;
    },
    [resizeCanvas]
  );

  useEffect(() => {
    const urls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      getFramePath(i)
    );
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    const checkDone = () => {
      loaded++;
      setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      if (loaded === TOTAL_FRAMES) {
        setFrames(images);
        setLoading(false);
      }
    };

    urls.forEach((src, i) => {
      const img = new Image();
      img.onload = () => checkDone();
      img.onerror = () => {
        setLoadError(`Frame ${i + 1} failed to load`);
        checkDone();
      };
      img.src = src;
      images.push(img);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      resizeCanvas();
      const currentIndex =
        lastFrameRef.current >= 0 ? lastFrameRef.current : 0;
      updateCanvas(currentIndex);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas, updateCanvas]);

  // Apple-style: single RAF loop reads scroll every frame → smooth 60fps canvas
  useEffect(() => {
    if (frames.length === 0 || typeof window === "undefined") return;

    let rafId = 0;

    const tick = () => {
      const container = containerRef.current;
      if (!container) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const progress = getScrollProgress(container);
      scrollProgress.set(progress);
      const index = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );

      updateCanvas(index);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [frames.length, updateCanvas, scrollProgress]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFFFF]">
        <div className="absolute top-0 left-0 h-1 w-full bg-black/5">
          <motion.div
            className="h-full bg-[#CC0000]"
            initial={{ width: "0%" }}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="font-bebas text-5xl tracking-wide text-black/90 md:text-7xl">
          SCHAULT
        </p>
        <p className="mt-2 font-inter text-sm text-black/60">{loadProgress}%</p>
        {loadError && (
          <p className="mt-4 max-w-md text-center font-inter text-sm text-[#CC0000]">
            {loadError}
          </p>
        )}
      </div>
    );
  }

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
            className="block h-full w-full"
            aria-hidden
          />
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
