import React from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fafafa] px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-600 mb-6">
        <PackageX size={36} />
      </div>

      <h1 className="font-inter text-2xl font-black uppercase tracking-widest text-black/90">
        Order Not Found
      </h1>

      <p className="mt-2 max-w-sm font-inter text-xs text-zinc-500 leading-relaxed">
        The order you are looking for does not exist or you do not have permission to view it.
      </p>

      <Link
        href="/orders"
        className="mt-8 inline-flex items-center gap-2 bg-black px-6 py-3.5 font-inter text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#0350F0]"
      >
        <ArrowLeft size={14} />
        <span>Back to Orders</span>
      </Link>
    </div>
  );
}
