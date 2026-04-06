"use client";

import React, { useState } from "react";
import PriceRangeSlider from "./PriceRangeSlider";

interface FilterSidebarProps {
  categories: any[];
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange, 
  activeFilters 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
    brands: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    { 
      name: "Men's", 
      sub: [
        { name: "Jackets", count: 24 },
        { name: "Shirts", count: 18 },
        { name: "T-Shirts", count: 32 },
        { name: "Hoodies", count: 12 },
        { name: "Pants", count: 15 }
      ]
    },
    { name: "Women's", sub: [] },
    { name: "Shoes & Bags", sub: [] },
    { name: "Accessories", sub: [] }
  ];

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#CC0000" },
    { name: "Navy", hex: "#000080" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Grey", hex: "#808080" },
    { name: "Olive", hex: "#808000" },
    { name: "Camel", hex: "#C19A6B" }
  ];

  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "All"];

  return (
    <aside className="w-[220px] flex-shrink-0 sticky top-24 h-fit pb-10">
      {/* Category Section */}
      <div className="border-b border-black/10 py-6">
        <button 
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full font-bebas text-lg text-black/90 tracking-wide"
        >
          CATEGORY
          <span className={`transition-transform duration-300 ${expandedSections.category ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {expandedSections.category && (
          <div className="mt-4 space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between group cursor-pointer">
                  <span className="font-bebas text-sm group-hover:text-schlaut-red transition-colors">{cat.name}</span>
                  {cat.sub.length > 0 && <span className="text-[10px] text-black/30">▼</span>}
                </div>
                {cat.sub.length > 0 && (
                  <div className="pl-2 space-y-2">
                    {cat.sub.map((sub, j) => (
                      <label key={j} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            className="w-3 h-3 accent-[#CC0000] border-black/10 rounded-none appearance-none border checked:bg-[#CC0000] transition-all cursor-pointer"
                            checked={activeFilters.category === sub.name}
                            onChange={() => onFilterChange({ ...activeFilters, category: sub.name })}
                          />
                          <span className={`font-inter text-xs transition-colors ${activeFilters.category === sub.name ? "text-black/90 font-medium" : "text-black/70 group-hover:text-black/90"}`}>
                            {sub.name}
                          </span>
                        </div>
                        <span className="font-inter text-[10px] text-black/30">{sub.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="border-b border-black/10 py-6">
        <button 
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-bebas text-lg text-black/90 tracking-wide"
        >
          PRICE
          <span className={`transition-transform duration-300 ${expandedSections.price ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {expandedSections.price && (
          <div className="mt-4">
            <PriceRangeSlider 
              min={1000} 
              max={15000} 
              onChange={(min, max) => onFilterChange({ ...activeFilters, price: { min, max } })}
            />
          </div>
        )}
      </div>

      {/* Color Section */}
      <div className="border-b border-black/10 py-6">
        <button 
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full font-bebas text-lg text-black/90 tracking-wide"
        >
          COLOR
          <span className={`transition-transform duration-300 ${expandedSections.color ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {expandedSections.color && (
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color, i) => (
                <button 
                  key={i} 
                  title={color.name}
                  onClick={() => onFilterChange({ ...activeFilters, color: color.name })}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div 
                    className={`w-6 h-6 rounded-full border border-black/10 transition-all ${activeFilters.color === color.name ? "ring-2 ring-offset-1 ring-black/90 scale-110" : "group-hover:scale-110"}`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-inter text-[8px] text-black/50 uppercase tracking-tighter">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Section */}
      <div className="border-b border-black/10 py-6">
        <button 
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full font-bebas text-lg text-black/90 tracking-wide"
        >
          SIZE
          <span className={`transition-transform duration-300 ${expandedSections.size ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {expandedSections.size && (
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size, i) => (
                <button 
                  key={i}
                  onClick={() => onFilterChange({ ...activeFilters, size })}
                  className={`py-2 border font-inter text-xs transition-all ${activeFilters.size === size ? "bg-black text-white border-black" : "border-black/10 text-black/70 hover:border-black/30"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="py-6">
        <button 
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full font-bebas text-lg text-black/90 tracking-wide"
        >
          BRANDS
          <span className={`transition-transform duration-300 ${expandedSections.brands ? "rotate-180" : "rotate-270"}`}>
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {expandedSections.brands && (
          <div className="mt-4 font-inter text-xs text-black/50">
            Search for brands...
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
