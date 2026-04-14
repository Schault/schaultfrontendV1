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
    price: true,
    color: true,
    size: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    <aside className="w-full md:w-[220px] flex-shrink-0 md:sticky md:top-24 h-fit md:pb-10">
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

    </aside>
  );
};

export default FilterSidebar;
