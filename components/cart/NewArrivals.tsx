"use client";

import Image from "next/image";
import Link from "next/link";

const NEW_ARRIVALS = [
  {
    id: "1",
    name: "TECHNICAL NYLON WIDE TANK TOP",
    price: 790,
    image: "/images/shoes/bluewhite.jpg", // Placeholder for actual top image
  },
  {
    id: "2",
    name: "OVERSIZED TECHNICAL NYLON PARKA",
    price: 1490,
    image: "/images/shoes/black.jpg", // Placeholder for actual parka image
  },
  {
    id: "3",
    name: "SILK TURTLENECK TOP",
    price: 650,
    image: "/images/shoes/white.jpg", // Placeholder for actual top image
  },
];

export default function NewArrivals() {
  return (
    <section className="py-20 border-t border-black/10">
      <div className="flex justify-between items-baseline mb-12">
        <h2 className="font-bebas text-[40px] md:text-[60px] text-black/90 tracking-tight leading-none uppercase">
          NEW ARRIVALS
        </h2>
        <Link 
          href="/shop" 
          className="font-inter text-[10px] tracking-widest text-black/50 uppercase hover:text-[#0350F0] transition-colors flex items-center gap-2"
        >
          SEE ALL <span className="text-sm">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {NEW_ARRIVALS.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="aspect-[3/4] bg-[#F5F5F5] mb-4 overflow-hidden relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-1">
              <p className="font-inter text-xs text-black/70 italic leading-none">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <h3 className="font-inter text-[10px] tracking-widest text-black/90 uppercase leading-snug">
                {product.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
