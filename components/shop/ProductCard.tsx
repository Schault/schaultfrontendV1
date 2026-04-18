"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

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
        
      </Link>

      {/* Wishlist Heart */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
          if (!isWishlisted) {
            toast.success("Added to Wishlist!");
          } else {
            toast("Removed from Wishlist", { icon: "💔" });
          }
        }}
        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 transition-all shadow-sm z-10 ${
          isWishlisted ? "text-[#0350F0]" : "text-black/30 hover:text-[#0350F0] hover:bg-white"
        }`}
      >
        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Product Info */}
      <div className="flex flex-col p-3 space-y-2 flex-grow">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-inter text-[13px] text-black/90 font-medium line-clamp-1 hover:text-[#0350F0] transition-colors">
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
        <div className="h-0.5 w-6 bg-[#0350F0] opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />

        {/* Add to Cart - Flipkart often has this on hover or in footer. We'll keep it as a sleek button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              color: product.colors[0]?.name,
              size: product.sizes[0]
            });
          }}
          className="w-full bg-black text-white py-2 text-[10px] font-bebas tracking-[0.2em] transition-all hover:bg-[#0350F0] mt-4 uppercase"
        >
          QUICK ADD
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
