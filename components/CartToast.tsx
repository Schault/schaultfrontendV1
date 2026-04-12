"use client";

import { useCart } from "./providers";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartToast() {
  const { showToast, setShowToast, toastItem } = useCart();

  return (
    <AnimatePresence>
      {showToast && toastItem && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-24 left-1/2 z-[10001] w-[calc(100%-2rem)] max-w-sm md:max-w-md lg:max-w-lg"
        >
          <div className="bg-white border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="flex items-center p-4 gap-4">
              {/* Thumbnail */}
              <div className="h-16 w-16 bg-[#F5F5F5] flex-shrink-0 relative">
                <Image
                  src={toastItem.image}
                  alt={toastItem.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-bebas text-xs tracking-[0.1em] text-[#CC0000]">ADDED TO BAG</p>
                <h4 className="font-bebas text-lg leading-tight text-black line-clamp-1">{toastItem.name}</h4>
                <p className="font-inter text-[11px] text-black/50 uppercase mt-0.5">
                  Size: {toastItem.size} | Color: {toastItem.image.includes('black') ? 'Black' : 'White'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex border-l border-black/5 pl-4 flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={() => setShowToast(false)}
                  className="font-bebas text-sm bg-black text-white px-4 py-2 hover:bg-[#CC0000] transition-colors text-center"
                >
                  VIEW BAG
                </Link>
                <button
                  onClick={() => setShowToast(false)}
                  className="font-inter text-[10px] text-black/40 hover:text-black transition-colors uppercase tracking-widest text-center"
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* Progress Bar (Visual only to show time remaining) */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-1 bg-[#CC0000] origin-left w-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
