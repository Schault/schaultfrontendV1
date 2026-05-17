"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminWaitlistPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin?page=waitlist");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">
      <div className="flex flex-col items-center gap-3">
        <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
        <span className="text-[10px] tracking-[0.25em] text-[#666] uppercase">REDIRECTING TO COMMAND CENTER...</span>
      </div>
    </div>
  );
}

