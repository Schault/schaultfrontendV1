"use client";

import Image from "next/image";
import { CartItem as CartItemType, useCart } from "@/components/providers";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 md:gap-10 py-5 md:py-10 border-b border-black/10">
      {/* Product Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-[#F5F5F5] overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-bebas text-xl md:text-3xl text-black/90 uppercase mb-0.5 tracking-tight line-clamp-1">
            {item.name}
          </h3>
          <p className="font-inter text-base md:text-lg text-black/70 mb-2 md:mb-4">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
          
          <div className="font-inter text-[9px] md:text-[10px] tracking-widest text-black/40 uppercase mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>SIZE | {item.size}</span>
            <span className="hidden sm:inline text-black/10">|</span>
            <span>COLOR | {item.image.includes('black') ? 'BLACK' : 'WHITE'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Control */}
          <div className="flex items-center gap-4 md:gap-8 font-inter text-black/70">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="hover:text-[#CC0000] transition-colors text-lg md:text-xl p-1"
            >
              -
            </button>
            <span className="text-sm md:text-base min-w-[1ch] text-center font-medium">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="hover:text-[#CC0000] transition-colors text-lg md:text-xl p-1"
            >
              +
            </button>
          </div>

          {/* Remove Link */}
          <button 
            onClick={() => removeItem(item.id)}
            className="font-inter text-[9px] md:text-[10px] tracking-widest text-black/40 uppercase hover:text-[#CC0000] transition-colors font-semibold"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
