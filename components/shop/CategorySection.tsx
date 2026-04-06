"use client";

import React, { useRef } from "react";
import Image from "next/image";

const categories = [
  {
    title: "Women's Fashion",
    desc: "Explore our stylish and trendy women's fashion with modular comfort.",
    image: "/assets/shop/categories/all.png", // Use the generated all image
    link: "/shop/women"
  },
  {
    title: "Shoes & Bags",
    desc: "Premium modular footwear and functional carry essentials.",
    image: "/assets/shop/categories/all.png",
    link: "/shop/shoes-bags"
  },
  {
    title: "Accessories",
    desc: "Interchangeable parts, technical laces, and modular hardware.",
    image: "/assets/shop/categories/all.png",
    link: "/shop/accessories"
  },
  {
    title: "Men's Jackets",
    desc: "Industrial-grade outerwear with modular components.",
    image: "/assets/shop/categories/all.png",
    link: "/shop/jackets"
  }
];

const CategorySection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 border-t border-black/10 px-6 md:px-12">
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-bebas text-[40px] text-black/90 tracking-wide uppercase">
          OTHER CATEGORIES
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 flex items-center justify-center border border-black/10 text-black/70 rounded-none hover:bg-black hover:text-white transition-all group"
          >
            ←
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 flex items-center justify-center border border-black/10 text-black/70 rounded-none hover:bg-black hover:text-white transition-all group"
          >
            →
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start border border-black/10 flex flex-col md:flex-row group"
          >
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-bebas text-2xl text-black/90 mb-2 tracking-wide">{cat.title}</h3>
                <p className="font-inter text-sm text-black/50 leading-relaxed max-w-[200px]">
                  {cat.desc}
                </p>
              </div>
              <button 
                className="mt-8 font-inter text-xs text-black/70 flex items-center gap-2 group-hover:text-[#CC0000] transition-colors relative"
              >
                EXPLORE NOW →
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#CC0000] transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
            <div className="flex-1 relative aspect-square md:aspect-auto overflow-hidden">
              <Image 
                src={cat.image} 
                alt={cat.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
