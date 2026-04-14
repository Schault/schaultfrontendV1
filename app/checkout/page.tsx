"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Order placed successfully!");
      // In a real app we would clear cart and route to a success page
    }, 1500);
  };

  // Calculate discount logic: L20-MCMF gives ₹500 discount PER shoe item
  const itemTotalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = appliedCoupon === "L20-MCMF" ? (itemTotalQuantity * 500) : 0;
  const finalPrice = totalPrice - discountAmount;

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
              
              {/* Contact Information */}
              <section>
                <h2 className="mb-6 font-bebas text-2xl tracking-wide text-black/90">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">First Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="First Name"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="mb-6 font-bebas text-2xl tracking-wide text-black/90">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Address Line 1</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="Street address or P.O. Box"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Apartment, suite, etc. (optional)</label>
                    <input 
                      type="text" 
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                      placeholder="Apt, Suite, Unit, etc."
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">City</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="City"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Postal Code</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="ZIP / Postal Code"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section>
                <h2 className="mb-6 font-bebas text-2xl tracking-wide text-black/90">Payment Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Card Number</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90 tracking-widest" 
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Expiration (MM/YY)</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="MM / YY"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Security Code</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90" 
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isProcessing || items.length === 0}
                className="w-full bg-[#CC0000] px-10 py-5 font-bebas text-xl tracking-widest text-white transition-all hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {isProcessing ? "PROCESSING..." : `PAY ₹${finalPrice.toLocaleString("en-IN")} →`}
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
                            {appliedCoupon && (
                                <span className="font-inter text-[11px] font-bold text-[#388e3c]">
                                  (₹2,000 / each)
                                </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-black/10 pt-6 space-y-4">
                    
                    {/* Coupon Box */}
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        placeholder="Discount code" 
                        className="flex-1 border border-black/20 bg-white px-3 py-3 font-inter text-sm text-black/90 outline-none uppercase tracking-widest focus:border-black/90"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (!couponInput) return;
                          if (couponInput === "L20-MCMF") {
                            setAppliedCoupon(couponInput);
                            setCouponError("");
                            setCouponInput("");
                          } else {
                            setCouponError("Invalid coupon code.");
                          }
                        }}
                        disabled={!couponInput}
                        className="bg-black text-white px-6 font-bebas tracking-widest text-lg hover:bg-[#CC0000] disabled:bg-black/20 transition-all cursor-pointer"
                      >
                        APPLY
                      </button>
                    </div>
                    {couponError && <p className="text-[#CC0000] text-xs font-inter font-medium">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs font-inter bg-green-50 px-3 py-2 border border-[#388e3c]/20">
                        <span className="font-bold text-[#388e3c] tracking-widest uppercase">COUPON APPLIED: {appliedCoupon}</span>
                        <button 
                          type="button"
                          className="text-black/50 hover:text-[#CC0000] font-bold text-lg leading-none"
                          onClick={() => setAppliedCoupon(null)}
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between font-inter text-sm pt-2">
                      <span className="text-black/70">Subtotal</span>
                      <span className="font-medium text-black/90">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between font-inter text-sm text-[#388e3c]">
                        <span>Discount ({appliedCoupon})</span>
                        <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-inter text-sm">
                      <span className="text-black/70">Shipping</span>
                      <span className="font-medium text-black/90">Free</span>
                    </div>
                    
                    <div className="flex justify-between border-t border-black/10 pt-4 font-bebas text-3xl tracking-wide">
                      <span className="text-black/90">Total</span>
                      <span className="text-[#CC0000]">₹{finalPrice.toLocaleString("en-IN")}</span>
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
