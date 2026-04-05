"use client";

import Image from "next/image";
import { CartItem as CartItemType, useCart } from "@/components/providers";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col md:flex-row py-8 border-b border-black/10 gap-6">
      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bebas text-2xl md:text-3xl text-black/90 uppercase mb-1 tracking-tight">
            {item.name}
          </h3>
          <p className="font-inter text-lg text-black/70 mb-4">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
          
          <div className="font-inter text-[10px] tracking-widest text-black/50 uppercase mb-6 flex items-center gap-2">
            <span>SIZE | {item.size}</span>
            <span className="text-black/20">|</span>
            <span>COLOR | {item.image.includes('black') ? 'BLACK' : 'WHITE'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Control */}
          <div className="flex items-center gap-6 font-inter text-black/70">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="hover:text-[#CC0000] transition-colors text-xl"
            >
              -
            </button>
            <span className="text-base min-w-[1ch] text-center">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="hover:text-[#CC0000] transition-colors text-xl"
            >
              +
            </button>
          </div>

          {/* Remove Link */}
          <button 
            onClick={() => removeItem(item.id)}
            className="font-inter text-[10px] tracking-widest text-black/50 uppercase hover:text-[#CC0000] transition-colors"
          >
            REMOVE
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="w-full md:w-48 aspect-square bg-[#F5F5F5] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
