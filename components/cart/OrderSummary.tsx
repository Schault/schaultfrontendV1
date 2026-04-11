"use client";

import { useCart } from "@/components/providers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

export default function OrderSummary() {
  const { totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const shipping = 0; // Free
  const postage = 24; // Fixed value from reference image example

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to checkout");
        router.push("/auth");
        return;
      }

      // Mock user address
      const mockAddress = {
        full_name: session.user.user_metadata?.full_name || "Schault Customer",
        line1: "123 Shoe Street",
        city: "Mumbai",
        state: "Maharashtra",
        postal_code: "400001",
        phone: "+91 9876543210"
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ shipping_address: mockAddress }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      toast.success("Order placed successfully!");
      // Clear cart from local storage since the DB cart is cleared
      localStorage.removeItem("schault_cart");
      
      router.push(`/orders/${data.order_id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-[#CC0000] text-white font-bebas text-xl py-4 uppercase tracking-widest mt-6 hover:bg-[#A30000] transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Check Out"}
      </button>
    </div>
  );
}
