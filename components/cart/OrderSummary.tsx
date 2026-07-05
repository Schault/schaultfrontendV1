"use client";

import { useCart } from "@/components/providers";
import { useRouter } from "next/navigation";

export default function OrderSummary() {
  const { totalPrice } = useCart();
  const router = useRouter();
  const postage = 24;

  return (
    <div className="sticky top-24 border border-black/10 bg-white p-6">
      <h2 className="font-inter text-2xl text-center py-4 border-b border-black/10 text-black/90 tracking-widest">
        ORDER SUMMARY
      </h2>
      
      <div className="space-y-4 pt-6 pb-4">
        <div className="flex justify-between items-center text-sm font-inter text-black/50 uppercase tracking-widest">
          <span>SUBTOTAL</span>
          <span className="text-black/90">₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-inter text-black/50 uppercase tracking-widest">
          <span>SHIPPING</span>
          <span className="text-black/90">Free</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-inter text-black/50 uppercase tracking-widest pb-4 border-b border-black/10">
          <span>POSTAGE</span>
          <span className="text-black/90">₹{postage.toLocaleString("en-IN")}</span>
        </div>
        
        <div className="flex justify-between items-center text-base font-inter text-black/90 font-bold uppercase tracking-widest pt-2">
          <span>TOTAL</span>
          <span>₹{(totalPrice + postage).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="w-full bg-[#0350F0] text-white font-inter text-xl py-4 uppercase tracking-widest mt-6 hover:bg-[#A30000] transition-colors"
      >
        Check Out
      </button>
    </div>
  );
}
