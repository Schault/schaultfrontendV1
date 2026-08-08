"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  shoeId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: number | string;
  variantId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  totalPrice: number;
  clearCart: () => void;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  toastItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastItem, setToastItem] = useState<CartItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("schault_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("schault_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (item: CartItem) => {
    // ponytail: TEST-ONLY bridge. The storefront runs on mock products with no real
    // product_variants UUID, but the order pipeline needs one. Attach a real DB variant
    // so the full flow (order/invoice/email/shipping) can be exercised during the pilot.
    // Remove before launch — real fix is DB-driven products. Charged at DB base_price.
    const TEST_VARIANT_ID = "5ceac96e-638c-45bb-8f98-67b8514245d8"; // Schault Midsole - White (stock 100)
    if (!item.variantId) item = { ...item, variantId: TEST_VARIANT_ID };

    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    
    // Trigger Toast instead of Sidebar
    setToastItem(item);
    setShowToast(true);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        totalPrice,
        clearCart,
        showToast,
        setShowToast,
        toastItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
