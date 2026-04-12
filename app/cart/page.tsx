"use client";

import { useCart } from "@/components/providers";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import NewArrivals from "@/components/cart/NewArrivals";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-20">
        <div className="animate-pulse space-y-8">
          <div className="h-16 w-64 bg-black/5" />
          <div className="flex flex-col md:flex-row gap-20">
            <div className="flex-1 space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 w-full bg-black/5" />
              ))}
            </div>
            <div className="w-full md:w-[350px] h-[400px] bg-black/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="font-bebas text-2xl text-black/50 uppercase tracking-[0.2em] mb-12">
            YOUR CART
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 border-t border-black/10">
              <h2 className="font-bebas text-[40px] md:text-[80px] text-black/90 uppercase mb-8 leading-none">
                YOUR CART IS EMPTY
              </h2>
              <Link 
                href="/shop" 
                className="font-bebas text-xl text-[#CC0000] border-b border-[#CC0000] pb-1 hover:text-[#A30000] hover:border-[#A30000] transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Cart Items Column */}
              <div className="flex-1">
                <div className="border-t border-black/10">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="w-full lg:w-[400px]">
                <OrderSummary />
              </div>
            </div>
          )}

          {/* New Arrivals Section */}
          <div className="mt-40">
            <NewArrivals />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
