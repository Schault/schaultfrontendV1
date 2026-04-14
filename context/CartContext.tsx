"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
  clearCart as apiClearCart,
  type SupabaseCartItem,
} from "@/lib/api/cart";
import { getProductImage } from "@/lib/api/products";
import { createClient } from "@/utils/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;            // Unique key for React (cartItemId or composite)
  cartItemId: string;    // Supabase cart_items.id
  variantId: string;     // product_variants.id
  shoeId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: number | string;
  stockQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (variantId: string, productSlug: string, productName: string, price: number, size: string, color: string | null, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  totalPrice: number;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  toastItem: CartItem | null;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// ─── Helper: Convert Supabase cart item → UI CartItem ───────────────────────

function toCartItem(item: SupabaseCartItem): CartItem {
  return {
    id: item.id,
    cartItemId: item.id,
    variantId: item.variant_id,
    name: item.product_name,
    price: item.base_price,
    image: getProductImage(item.product_slug),
    quantity: item.quantity,
    color: item.variant_color || undefined,
    size: item.variant_size,
    stockQuantity: item.stock_quantity,
  };
}

// ─── Provider ───────────────────────────────────────────────────────────────

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastItem, setToastItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch cart from Supabase ──────────────────────────────────────────

  const refreshCart = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not authenticated — clear local state
        setItems([]);
        return;
      }

      setLoading(true);
      setError(null);
      const cartItems = await getCart();
      setItems(cartItems.map(toCartItem));
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load cart on mount and on auth state change ───────────────────────

  useEffect(() => {
    refreshCart();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session) {
          refreshCart();
        } else {
          setItems([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshCart]);

  // ── Add item ──────────────────────────────────────────────────────────

  const addItem = async (
    variantId: string,
    productSlug: string,
    productName: string,
    price: number,
    size: string,
    color: string | null,
    quantity: number = 1,
  ) => {
    try {
      setError(null);

      // Check if item already in cart, if so increment
      const existing = items.find((i) => i.variantId === variantId);
      const newQuantity = existing ? existing.quantity + quantity : quantity;

      await apiAddToCart(variantId, newQuantity);
      await refreshCart();

      // Build toast item
      const toast: CartItem = {
        id: variantId,
        cartItemId: "",
        variantId,
        name: productName,
        price,
        image: getProductImage(productSlug),
        quantity: 1,
        color: color || undefined,
        size,
        stockQuantity: 0,
      };
      setToastItem(toast);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      console.error("Failed to add to cart:", err);
      setError(err.message || "Failed to add item");
      throw err;
    }
  };

  // ── Remove item ───────────────────────────────────────────────────────

  const removeItem = async (cartItemId: string) => {
    try {
      setError(null);
      // Optimistic removal
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
      await apiRemoveFromCart(cartItemId);
    } catch (err: any) {
      console.error("Failed to remove item:", err);
      setError(err.message || "Failed to remove item");
      await refreshCart(); // Revert on failure
    }
  };

  // ── Update quantity ───────────────────────────────────────────────────

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) {
        return removeItem(cartItemId);
      }
      // Optimistic update
      setItems((prev) =>
        prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity } : i
        )
      );
      await apiUpdateCartQuantity(cartItemId, quantity);
    } catch (err: any) {
      console.error("Failed to update quantity:", err);
      setError(err.message || "Failed to update quantity");
      await refreshCart(); // Revert on failure
    }
  };

  // ── Clear cart ────────────────────────────────────────────────────────

  const clearCartHandler = async () => {
    try {
      setError(null);
      setItems([]);
      await apiClearCart();
    } catch (err: any) {
      console.error("Failed to clear cart:", err);
      setError(err.message || "Failed to clear cart");
      await refreshCart();
    }
  };

  // ── Computed values ───────────────────────────────────────────────────

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
        clearCart: clearCartHandler,
        refreshCart,
        showToast,
        setShowToast,
        toastItem,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
