import React from "react";

interface ShoeViewerSkeletonProps {
  className?: string;
  progress?: number;
  statusMessage?: string;
}

export default function ShoeViewerSkeleton({
  className = "",
  progress,
  statusMessage = "SYNCHRONIZING MESH",
}: ShoeViewerSkeletonProps) {

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#143a23] via-[#0f2d1b] to-[#0b2214] select-none ${className}`}
      aria-label="Loading 3D Model..."
    >
      {/* Dynamic Background Glow & Shimmer Sweep */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[50%] top-0 h-full w-[200%] animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-3xl" />
      </div>

      {/* Top HUD: Technical Status & Viewport Indicators */}
      <div className="relative z-10 flex items-center justify-between p-4 text-[10px] font-mono tracking-widest text-emerald-300/70">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="uppercase tracking-[0.2em] font-semibold text-white/90">
            INITIALIZING 3D VIEWPORT
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-2 py-0.5 text-white/60">
            FOV 50°
          </span>
          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
            WEBGL
          </span>
        </div>
      </div>

      {/* Viewport Corner CAD Brackets */}
      <div className="pointer-events-none absolute left-4 top-12 h-3 w-3 border-l border-t border-white/20" />
      <div className="pointer-events-none absolute right-4 top-12 h-3 w-3 border-r border-t border-white/20" />
      <div className="pointer-events-none absolute left-4 bottom-14 h-3 w-3 border-l border-b border-white/20" />
      <div className="pointer-events-none absolute right-4 bottom-14 h-3 w-3 border-r border-b border-white/20" />

      {/* Center 3D Wireframe Silhouette & Perspective Grid */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-6">
        <div className="relative flex h-52 w-full max-w-sm items-center justify-center">
          {/* 3D Perspective Floor Grid */}
          <svg
            className="absolute -bottom-4 w-full h-24 opacity-30 text-emerald-400"
            viewBox="0 0 300 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            {/* Horizontal perspective lines */}
            <line x1="10" y1="75" x2="290" y2="75" strokeOpacity="0.8" />
            <line x1="30" y1="58" x2="270" y2="58" strokeOpacity="0.6" />
            <line x1="55" y1="44" x2="245" y2="44" strokeOpacity="0.4" />
            <line x1="80" y1="33" x2="220" y2="33" strokeOpacity="0.2" />
            {/* Vanishing rays */}
            <line x1="150" y1="20" x2="10" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="60" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="110" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="150" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="190" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="240" y2="75" strokeDasharray="3 3" />
            <line x1="150" y1="20" x2="290" y2="75" strokeDasharray="3 3" />
          </svg>

          {/* Stylized Modular Shoe Skeleton (Upper + Sole Interlock) */}
          <div className="relative w-72 h-36 animate-pulse">
            <svg
              viewBox="0 0 320 160"
              className="h-full w-full drop-shadow-[0_0_15px_rgba(52,211,153,0.25)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* UPPER SECTION */}
              <path
                d="M 60 92 C 55 75 75 42 105 38 C 122 36 135 48 155 60 C 180 72 230 76 250 82 C 265 86 268 95 260 98 C 240 102 110 102 60 92 Z"
                className="fill-white/[0.04] stroke-emerald-400/60"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              {/* Upper Collar & Tongue Skeleton */}
              <path
                d="M 98 40 C 95 28 112 25 125 35 C 138 45 146 54 155 60"
                className="stroke-emerald-400/40"
                strokeWidth="1.2"
              />
              {/* Upper Detail Ribs / Wireframe Contours */}
              <path
                d="M 85 65 C 105 72 135 78 175 80"
                className="stroke-white/20"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <path
                d="M 120 58 C 145 68 185 75 225 81"
                className="stroke-white/20"
                strokeWidth="1"
                strokeDasharray="2 3"
              />

              {/* MODULAR INTERLOCK GAP INDICATOR */}
              <line
                x1="65"
                y1="102"
                x2="255"
                y2="102"
                className="stroke-emerald-400/50"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* SOLE SECTION */}
              <path
                d="M 52 104 C 50 118 70 128 100 128 C 160 128 220 125 258 118 C 268 116 270 106 258 104 C 220 98 90 98 52 104 Z"
                className="fill-emerald-500/[0.08] stroke-emerald-400/80"
                strokeWidth="2"
              />
              {/* Sole Outsole Tread Skeleton */}
              <path
                d="M 70 124 L 75 116 M 95 126 L 100 116 M 125 126 L 130 116 M 155 126 L 160 116 M 185 125 L 190 116 M 215 124 L 220 116 M 245 120 L 248 114"
                className="stroke-emerald-300/40"
                strokeWidth="1.2"
              />

              {/* Center Modular Axis Target */}
              <circle cx="160" cy="98" r="4" className="stroke-emerald-400 fill-emerald-400/40 animate-ping" />
              <circle cx="160" cy="98" r="2" className="fill-white" />
            </svg>
          </div>
        </div>

        {/* Skeleton Shimmer Placeholders */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-12 rounded-full bg-emerald-400/40 animate-pulse" />
            <span className="font-inter text-xs font-semibold tracking-wider text-white/90">
              BUILDING MODULAR ASSEMBLY
            </span>
            <span className="h-1.5 w-12 rounded-full bg-emerald-400/40 animate-pulse" />
          </div>
          <p className="font-inter text-[11px] text-white/50">
            Streaming GLB geometry & shaders for Upper & Sole
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Bar & Status Footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 p-3.5 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between font-inter text-[10px] text-white/60">
          <span className="flex items-center gap-1.5 font-mono text-emerald-300/90">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {statusMessage}
          </span>
          <span className="font-mono text-emerald-300/80 font-medium">
            {typeof progress === "number" && progress > 0 ? `${Math.min(Math.round(progress), 99)}%` : "INTERACTIVE ON LOAD"}
          </span>
        </div>

        {/* Shimmering Dynamic Progress Track */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{
              width: typeof progress === "number" && progress > 0 ? `${Math.min(Math.max(progress, 8), 100)}%` : "40%",
            }}
          />
        </div>
      </div>

    </div>
  );
}
