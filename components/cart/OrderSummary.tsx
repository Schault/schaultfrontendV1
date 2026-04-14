"use client";

import { useCart } from "@/components/providers";
import { useRouter } from "next/navigation";

export default function OrderSummary() {
  const { totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="sticky top-24 border border-black/10 bg-white p-6">
      <h2 className="font-bebas text-2xl text-center py-4 border-b border-black/10 text-black/90 tracking-widest">
        ORDER SUMMARY
      </h2>
      
      <div className="space-y-4 pt-6 pb-4">
        <div className="flex justify-between items-center text-sm font-inter text-black/50 uppercase tracking-widest">
          <span>SUBTOTAL</span>
          <span className="text-black/90">₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-inter text-black/50 uppercase tracking-widest pb-4 border-b border-black/10">
          <span>SHIPPING</span>
          <span className="text-black/90">Free</span>
        </div>
        
        <div className="flex justify-between items-center text-base font-inter text-black/90 font-bold uppercase tracking-widest pt-2">
          <span>TOTAL</span>
          <span>₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        className="w-full bg-[#CC0000] text-white font-bebas text-xl py-4 uppercase tracking-widest mt-6 hover:bg-[#A30000] transition-colors"
      >
        Check Out
      </button>
    </div>
  );
}
