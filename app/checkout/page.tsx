"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const itemTotalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount =
    appliedCoupon === "L20-MCMF" ? itemTotalQuantity * 500 :
    appliedCoupon === "DEVTEST99" ? Math.max(totalPrice - 1, 0) :
    0;
  const finalPrice = totalPrice - discountAmount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setIsProcessing(false);
      return;
    }

    const amountInPaise = Math.round(finalPrice * 100);

    let rzpOrder: { order_id: string; amount: number; currency: string };
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });
      if (!res.ok) throw new Error("Order creation failed");
      rzpOrder = await res.json();
    } catch {
      toast.error("Could not initiate payment. Please try again.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      order_id: rzpOrder.order_id,
      name: "Schault",
      description: "Order Payment",
      prefill: {
        name: `${firstName} ${lastName}`.trim(),
        email,
      },
      theme: { color: "#0350F0" },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              order_data: {
                total: finalPrice,
                shipping_address: {
                  full_name: `${firstName} ${lastName}`.trim(),
                  line1, line2, city, state,
                  postal_code: postalCode,
                  phone,
                },
              },
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            toast.error("Payment verification failed. Contact support.");
            setIsProcessing(false);
            return;
          }

          clearCart();
          toast.success("Payment successful! Order placed.");
          router.push(verifyData.order_id ? `/orders/${verifyData.order_id}` : "/orders");
        } catch {
          toast.error("Payment verification error. Contact support.");
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-black/50">
          <Link href="/" className="hover:text-black/90">Home</Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-black/90">Shop</Link>
          <span>&gt;</span>
          <span className="font-medium text-black/90">Checkout</span>
        </div>

        <h1 className="mb-12 font-inter text-[48px] leading-[0.9] tracking-wide text-black/90 md:text-[56px]">
          CHECKOUT
        </h1>

        <div className="flex flex-col-reverse gap-16 lg:flex-row lg:gap-24">
          {/* Left Column: Form */}
          <div className="flex-1">
            <form onSubmit={handlePlaceOrder} className="space-y-12">

              {/* Contact Information */}
              <section>
                <h2 className="mb-6 font-inter text-2xl tracking-wide text-black/90">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="mb-6 font-inter text-2xl tracking-wide text-black/90">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                      placeholder="Street address or P.O. Box"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                        placeholder="City"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-inter text-[10px] uppercase tracking-widest text-black/50">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border border-black/20 bg-transparent px-4 py-3 font-inter text-sm text-black/90 outline-none transition-colors focus:border-black/90"
                      placeholder="ZIP / Postal Code"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-[#0350F0] px-10 py-5 font-inter text-xl tracking-widest text-white transition-all hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                {isProcessing ? "PROCESSING..." : `PAY ₹${finalPrice.toLocaleString("en-IN")} →`}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="sticky top-32 border border-black/10 bg-black/5 p-8">
              <h2 className="mb-8 font-inter text-3xl tracking-wide text-black/90">Order Summary</h2>
              {items.length === 0 ? (
                <div className="py-8 text-center font-inter text-sm text-black/50">
                  Your cart is empty.
                  <div className="mt-4">
                    <Link href="/shop" className="text-black/90 underline hover:text-[#0350F0]">
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
                          <h3 className="font-inter text-lg tracking-wide text-black/90 leading-tight">
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
                          if (couponInput === "L20-MCMF" || couponInput === "DEVTEST99") {
                            setAppliedCoupon(couponInput);
                            setCouponError("");
                            setCouponInput("");
                          } else {
                            setCouponError("Invalid coupon code.");
                          }
                        }}
                        disabled={!couponInput}
                        className="bg-black text-white px-6 font-inter tracking-widest text-lg hover:bg-[#0350F0] disabled:bg-black/20 transition-all cursor-pointer"
                      >
                        APPLY
                      </button>
                    </div>
                    {couponError && <p className="text-[#0350F0] text-xs font-inter font-medium">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs font-inter bg-green-50 px-3 py-2 border border-[#388e3c]/20">
                        <span className="font-bold text-[#388e3c] tracking-widest uppercase">COUPON APPLIED: {appliedCoupon}</span>
                        <button
                          type="button"
                          className="text-black/50 hover:text-[#0350F0] font-bold text-lg leading-none"
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

                    <div className="flex justify-between border-t border-black/10 pt-4 font-inter text-3xl tracking-wide">
                      <span className="text-black/90">Total</span>
                      <span className="text-[#0350F0]">₹{finalPrice.toLocaleString("en-IN")}</span>
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
