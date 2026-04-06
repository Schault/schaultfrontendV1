"use client";

import React from "react";
import Image from "next/image";

const CatalogCTA: React.FC = () => {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden group">
      {/* Background Image with Overlay */}
      <Image 
        src="/assets/shop/catalog/bg.png" 
        alt="Catalog Background" 
        fill 
        className="object-cover transition-transform duration-1000 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-bebas text-[48px] md:text-[64px] text-white tracking-widest leading-none mb-4">
          EXPLORE OUR FULL CATALOG
        </h2>
        <p className="font-inter text-white/60 text-sm md:text-base max-w-[500px] mx-auto mb-8 leading-relaxed">
          Discover the complete range of modular footwear and interchangeable components. 
          Built for longevity, designed for expression.
        </p>
        <button className="border border-white/20 text-white font-bebas text-xl px-12 py-4 hover:bg-white hover:text-black transition-all duration-500 tracking-widest relative overflow-hidden">
          VIEW ALL PRODUCTS →
        </button>
      </div>
    </section>
  );
};

export default CatalogCTA;
