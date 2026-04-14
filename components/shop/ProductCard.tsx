"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import type { ProductVariant } from "@/lib/api/products";

export interface Product {
  id: string;          // UUID
  slug: string;        // slug (for image mapping)
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants?: ProductVariant[];  // Supabase variants
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find first in-stock variant
    const variant = product.variants?.find((v) => v.stock_quantity > 0);
    if (!variant) {
      toast.error("This product is currently out of stock.");
      return;
    }

    try {
      await addItem(
        variant.id,
        product.slug,    // slug for image mapping
        product.name,
        product.price,
        variant.size,
        variant.color,
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart. Please log in.");
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-black/[0.03] hover:shadow-lg transition-shadow duration-300 h-full relative">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-white overflow-hidden block">
        <div className="absolute inset-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
            {product.rating} <Star size={8} fill="currentColor" stroke="none" />
          </div>
        )}
      </Link>

      {/* Wishlist Heart */}
      <button className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 text-black/30 hover:text-[#CC0000] hover:bg-white transition-all shadow-sm z-10">
        <Heart size={16} />
      </button>

      {/* Product Info */}
      <div className="flex flex-col p-3 space-y-2 flex-grow">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-inter text-[13px] text-black/90 font-medium line-clamp-1 hover:text-[#CC0000] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="font-inter text-[11px] text-black/40 uppercase tracking-wider mt-0.5">
            {product.category}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex flex-wrap items-baseline gap-1.5 pt-1">
          <span className="font-inter text-[15px] font-bold text-black/90">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <>
              <span className="font-inter text-[12px] text-black/40 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="font-inter text-[12px] font-bold text-green-600">
                {discount}% off
              </span>
            </>
          )}
        </div>
        
        {/* Schault Aesthetic Branding - Subtle bar */}
        <div className="h-0.5 w-6 bg-[#CC0000] opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />

        {/* Add to Cart */}
        <button
          onClick={handleQuickAdd}
          className="w-full bg-black text-white py-2 text-[10px] font-bebas tracking-[0.2em] transition-all hover:bg-[#CC0000] mt-auto uppercase"
        >
          QUICK ADD
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
