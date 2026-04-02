"use client";

import { useAuth } from "@/components/providers";
import { useState } from "react";
import { Package, Truck, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
    const { user, login, logout } = useAuth();
    const [emailInput, setEmailInput] = useState("");

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-6">
                <div className="w-full max-w-md bg-white p-10 shadow-sm border border-black/5">
                    <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
                    <h1 className="font-bebas text-4xl tracking-wide text-black/90 mt-4 mb-2">Member Login</h1>
                    <p className="font-inter text-sm text-black/60 mb-8">
                        Access your order history and manage your Schault profile.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (emailInput.includes("@")) login(emailInput);
                        }}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="email" className="block text-xs font-inter font-semibold mb-2 uppercase tracking-wide text-black/80">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full border-b border-black/20 pb-2 font-inter text-black focus:border-black focus:outline-none transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black py-4 font-inter text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black/90"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F5F5] pt-32 pb-12">
            <div className="mx-auto max-w-5xl px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6 mb-12">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-wide text-black/90">Hello, {user.name}</h1>
                        <p className="font-inter text-sm text-black/60 mt-2">{user.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-6 md:mt-0 px-6 py-2 border border-black font-inter text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <section>
                    <div className="mb-2 h-0.5 w-8 bg-[#CC0000]" aria-hidden />
                    <h2 className="font-bebas text-3xl tracking-wide text-black/90 mb-8">Order History</h2>

                    {user.orders.length === 0 ? (
                        <p className="font-inter text-black/60">No orders placed yet.</p>
                    ) : (
                        <div className="space-y-8">
                            {user.orders.map((order) => (
                                <div key={order.id} className="bg-white border border-black/5 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="font-inter text-xs font-semibold px-3 py-1 bg-black/5 uppercase tracking-wide">
                                                {order.status}
                                            </span>
                                            <p className="font-inter text-sm text-black/50">Order {order.id}</p>
                                            <p className="font-inter text-sm text-black/50 ml-auto border-l border-black/10 pl-4">
                                                {order.date}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex gap-6 items-center">
                                                    <div className="w-20 h-20 bg-black/5 p-2 flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bebas text-xl tracking-wide text-black/90">{item.name}</h4>
                                                        <p className="font-inter text-sm text-black/60">Size: US Men&apos;s {item.size}</p>
                                                        <p className="font-inter text-sm font-semibold max-w-fit mt-1">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="ml-auto font-inter text-sm font-semibold">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary sidebar inside card */}
                                    <div className="md:w-64 bg-black/5 p-6 flex flex-col justify-center">
                                        <p className="font-inter text-sm text-black/60 mb-2">Order Total</p>
                                        <p className="font-bebas text-3xl tracking-wide text-black/90">${order.total.toFixed(2)}</p>
                                        <div className="mt-6 flex items-center gap-3 text-black/80">
                                            {order.status === "Delivered" ? (
                                                <><CheckCircle2 size={18} /> <span className="font-inter text-sm">Delivered Successfully</span></>
                                            ) : order.status === "Shipped" ? (
                                                <><Truck size={18} /> <span className="font-inter text-sm">On the way</span></>
                                            ) : (
                                                <><Package size={18} /> <span className="font-inter text-sm">Processing order</span></>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
