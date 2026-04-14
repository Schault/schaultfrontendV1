"use client";

import { useCart } from "./providers";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname.startsWith("/auth");

    if (isAuthPage) return null;

    const handleCheckout = () => {
        if (items.length === 0) {
            toast("Your cart is empty!", { icon: "🛒" });
            return;
        }
        setIsCartOpen(false);
        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-white shadow-xl sm:w-[500px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                            <h2 className="font-bebas text-2xl tracking-wide text-black/90">Your Bag</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-black/50 transition-colors hover:text-black/90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center space-y-4">
                                    <p className="font-inter text-black/50">Your bag is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="border border-black px-6 py-2 font-inter text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            {/* Thumbnail */}
                                            <div className="h-24 w-24 flex-shrink-0 bg-black/5 p-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <h3 className="font-bebas tracking-wide text-lg text-black/90">
                                                        {item.name}
                                                    </h3>
                                                    <p className="font-semibold text-black/90 font-inter text-sm">
                                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                                <p className="font-inter text-xs text-black/50 mt-1">
                                                    Size: {item.size} {item.color ? `| ${item.color}` : ""}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3 border border-black/20 p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                            className="text-black/60 hover:text-black transition-colors p-2"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-inter text-sm w-4 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                            className="text-black/60 hover:text-black transition-colors p-2"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.cartItemId)}
                                                        className="text-black/40 hover:text-[#CC0000] transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Checkout Info */}
                        {items.length > 0 && (
                            <div className="border-t border-black/10 bg-black/5 px-6 py-6">
                                <div className="flex justify-between font-inter text-sm">
                                    <span className="text-black/70">Subtotal</span>
                                    <span className="font-semibold">₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between font-inter text-sm mt-2">
                                    <span className="text-black/70">Shipping</span>
                                    <span className="text-black/70">Calculated at checkout</span>
                                </div>

                                <hr className="my-4 border-black/10" />

                                <div className="flex justify-between font-bebas text-xl tracking-wide">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="mt-6 w-full flex justify-center items-center bg-black py-4 font-inter text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black/90"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
