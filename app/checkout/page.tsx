"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { performCheckout, type ShippingAddress, type CheckoutError } from "@/lib/api/checkout";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, refreshCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  // Shipping address form state
  const [form, setForm] = useState<ShippingAddress>({
    full_name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });

  // ── Retry countdown ───────────────────────────────────────────────────

  useEffect(() => {
    if (retryAfter === null || retryAfter <= 0) return;

    const timer = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfter]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const result = await performCheckout(form);

      // Success!
      toast.success("Order placed successfully!");
      await clearCart();

      // Navigate to the order detail page
      router.push(`/orders/${result.order_id}`);
    } catch (err: any) {
      const checkoutErr = err as CheckoutError;

      switch (checkoutErr.type) {
        case "AUTH":
          toast.error("Please log in to place an order.");
          router.push("/auth");
          return;

        case "RATE_LIMITED":
          setRetryAfter(checkoutErr.retryAfterSeconds || 60);
          setError(checkoutErr.message);
          break;

        case "STOCK_CONFLICT":
          setError(checkoutErr.message);
          toast.error("Some items are out of stock. Please update your cart.");
          // Refresh cart to get updated stock info
          await refreshCart();
          break;

        case "VALIDATION":
          setError(checkoutErr.message);
          break;

        default:
          setError(checkoutErr.message || "Checkout failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isProcessing || items.length === 0 || (retryAfter !== null && retryAfter > 0);

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      {/* Container */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-black/50">
          <Link href="/" className="hover:text-black/90">Home</Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-black/90">Shop</Link>
          <span>&gt;</span>
          <span className="font-medium text-black/90">Checkout</span>
        </div>

        {/* Header */}
        <h1 className="mb-12 font-bebas text-[48px] leading-[0.9] tracking-wide text-black/90 md:text-[56px]">
          CHECKOUT
        </h1>

        <div className="flex flex-col-reverse gap-16 lg:flex-row lg:gap-24">
          {/* Left Column: Form */}
          <div className="flex-1">
            <form onSubmit={handlePlaceOrder} className="space-y-12">
              
              {/* Shipping Address */}
              <section>
                <h2 className="mb-6 font-bebas text-2xl tracking-wide text-black/90">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required 
                      maxLength={200}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Address Line 1</label>
                    <input 
                      type="text" 
                      name="line1"
                      value={form.line1}
                      onChange={handleChange}
                      required 
                      maxLength={500}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="Street address or P.O. Box"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Apartment, suite, etc. (optional)</label>
                    <input 
                      type="text"
                      name="line2"
                      value={form.line2}
                      onChange={handleChange}
                      maxLength={500}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="Apt, Suite, Unit, etc."
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required 
                        maxLength={100}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="City"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">State</label>
                      <input 
                        type="text" 
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required 
                        maxLength={100}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="State / Province"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Postal Code</label>
                      <input 
                        type="text" 
                        name="postal_code"
                        value={form.postal_code}
                        onChange={handleChange}
                        required 
                        pattern="\d{5,6}"
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="PIN Code (5-6 digits)"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Phone (optional)</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={20}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Skeleton */}
              <section>
                <h2 className="mb-6 font-bebas text-2xl tracking-wide text-black/90">Payment Details</h2>
                <div className="border border-dashed border-black/20 bg-black/[0.02] p-8 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="font-inter text-sm text-black/50 mb-1">
                    Payment integration coming soon
                  </p>
                  <p className="font-inter text-xs text-black/30">
                    Orders are placed as Cash on Delivery for now
                  </p>
                </div>
              </section>

              {/* Error Display */}
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-inter text-red-700">
                  {error}
                </div>
              )}

              {/* Rate Limit Countdown */}
              {retryAfter !== null && retryAfter > 0 && (
                <div className="border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-inter text-yellow-700">
                  Too many attempts. You can try again in <strong>{retryAfter}s</strong>.
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isDisabled}
                className="w-full bg-[#CC0000] px-10 py-5 font-bebas text-xl tracking-widest text-white transition-all hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {isProcessing ? "PROCESSING..." : `PLACE ORDER — ₹${totalPrice.toLocaleString("en-IN")} →`}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-32 border border-black/10 bg-black/5 p-8">
              <h2 className="mb-8 font-bebas text-3xl tracking-wide text-black/90">Order Summary</h2>
              
              {items.length === 0 ? (
                <div className="py-8 text-center font-inter text-sm text-black/50">
                  Your cart is empty.
                  <div className="mt-4">
                    <Link href="/shop" className="text-black/90 underline hover:text-[#CC0000]">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Item List */}
                  <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 flex-shrink-0 bg-white border border-black/5 p-1">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <h3 className="font-bebas text-lg tracking-wide text-black/90 leading-tight">
                            {item.name}
                          </h3>
                          <p className="font-inter text-[10px] uppercase tracking-widest text-black/50 mt-1">
                            Size: {item.size} {item.color ? `| ${item.color}` : ""}
                          </p>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-inter text-sm font-semibold text-black/90">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-black/10 pt-6 space-y-4">
                    <div className="flex justify-between font-inter text-sm pt-2">
                      <span className="text-black/70">Subtotal</span>
                      <span className="font-medium text-black/90">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between font-inter text-sm">
                      <span className="text-black/70">Shipping</span>
                      <span className="font-medium text-black/90">Free</span>
                    </div>
                    
                    <div className="flex justify-between border-t border-black/10 pt-4 font-bebas text-3xl tracking-wide">
                      <span className="text-black/90">Total</span>
                      <span className="text-[#CC0000]">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
