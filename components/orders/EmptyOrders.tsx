import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const EmptyOrders: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-black/10 bg-white p-12 text-center shadow-sm my-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 border border-black/10 text-zinc-400 mb-6">
        <ShoppingBag size={36} />
      </div>

      <h2 className="font-inter text-xl font-black uppercase tracking-widest text-black/90">
        No Orders Yet
      </h2>

      <p className="mt-2 max-w-sm font-inter text-xs text-zinc-500 leading-relaxed">
        You haven’t placed any orders with SCHAULT yet. Explore our modular footwear collection and define your stride.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 bg-black px-6 py-3.5 font-inter text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#0350F0]"
      >
        <span>Continue Shopping</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};
