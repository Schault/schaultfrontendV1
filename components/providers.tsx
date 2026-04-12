"use client";

import React from "react";
import { CartProvider, useCart, CartItem } from "@/context/CartContext";

// Re-export for convenience
export { useCart };
export type { CartItem };

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}
