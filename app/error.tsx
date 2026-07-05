"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("Unhandle client-side crash caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-inter text-center">
      <div className="max-w-md">
        <span className="rounded-full bg-[#0350F0]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0350F0]">
          System Notice
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-wide text-black uppercase leading-tight">
          SOMETHING WENT AWRY
        </h1>
        <p className="mt-4 text-sm text-black/60 leading-relaxed">
          We encountered an unexpected error while loading this page. Please try reloading or reach out to support if the issue persists.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-[#0350F0] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#0350F0]/20 transition-all hover:bg-[#0350F0]/90 active:scale-95"
          >
            TRY AGAIN
          </button>
          <a
            href="/"
            className="rounded-xl border border-black/10 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black hover:bg-black/[0.02] transition-all"
          >
            GO TO HOME
          </a>
        </div>
      </div>
    </main>
  );
}
