"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- Cart Context ---
export type CartItem = {
    id: string; // usually shoe.id + size
    shoeId: string;
    name: string;
    image: string;
    price: number;
    size: number;
    quantity: number;
    variantId?: string; // Shopify variant GID for checkout
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (v: boolean) => void;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside Providers");
    return ctx;
};

// --- Auth Context ---
export type Order = {
    id: string;
    date: string;
    total: number;
    status: "Processing" | "Shipped" | "Delivered";
    items: CartItem[];
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
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Persistence (mock)
    useEffect(() => {
        const savedCart = localStorage.getItem("schault_cart");
        if (savedCart) setItems(JSON.parse(savedCart));

        const savedUser = localStorage.getItem("schault_user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        localStorage.setItem("schault_cart", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("schault_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("schault_user");
        }
    }, [user]);

    // Cart actions
    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
        setIsCartOpen(true);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return removeItem(id);
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
                            image: "/images/shoes/bluewhite.jpg",
                            price: 199,
                            size: 9,
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
            <CartContext.Provider
                value={{
                    items,
                    addItem,
                    removeItem,
                    updateQuantity,
                    isCartOpen,
                    setIsCartOpen,
                    totalPrice,
                }}
            >
                {children}
            </CartContext.Provider>
        </AuthContext.Provider>
    );
}
