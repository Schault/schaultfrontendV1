"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col space-y-4">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F7F7F7] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Hover CTA */}
        <button
          onClick={() => addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            color: product.colors[0]?.name,
            size: product.sizes[0]
          })}
          className="absolute bottom-0 left-0 w-full bg-[#CC0000] text-white font-bebas text-lg py-4 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 tracking-widest"
        >
          ADD TO CART
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-start pt-2">
          <h3 className="font-inter text-[12px] text-black/90 uppercase tracking-widest flex-1 font-medium">
            {product.name}
          </h3>
          <span className="font-inter text-[12px] text-black/70 font-medium">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
        
        {/* Color Swatches */}
        <div className="flex gap-1.5 pt-1">
          {product.colors.map((color, i) => (
            <div 
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
