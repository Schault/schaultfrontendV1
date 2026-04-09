"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartProvider, useCart, CartItem } from "@/context/CartContext";

// Re-export for convenience
export { useCart };
export type { CartItem };

// --- Auth Context ---

export type Order = {
    id: string;
    date: string;
    total: number;
    status: "Processing" | "Shipped" | "Delivered";
    items: any[]; // Use any or refer to CartItem from context
};

export type User = {
    name: string;
    email: string;
    orders: Order[];
};

type AuthContextType = {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside Providers");
    return ctx;
};

export function Providers({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Persistence (mock)
    useEffect(() => {
        const savedUser = localStorage.getItem("schault_user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("schault_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("schault_user");
        }
    }, [user]);

    // Auth actions
    const login = (email: string) => {
        // Mock user data upon login
        setUser({
            name: email.split("@")[0] || "Shopper",
            email,
            orders: [
                {
                    id: "ORD-9283-X",
                    date: "Oct 12, 2025",
                    total: 199.00,
                    status: "Delivered",
                    items: [
                        {
                            id: "arctic-dawn-9",
                            shoeId: "arctic-dawn",
                            name: 'Schault "Arctic Dawn"',
                            image: "/assets/shop/products/product1.png",
                            price: 199,
                            size: "9",
                            quantity: 1,
                        }
                    ]
                }
            ]
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthContext.Provider>
    );
}
