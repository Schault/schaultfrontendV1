"use client";

import React from "react";
import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  activeFilters: any;
  onRemoveFilter: (key: string) => void;
  onSortChange: (sort: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  totalCount, 
  activeFilters, 
  onRemoveFilter,
  onSortChange
}) => {
  return (
    <div className="flex-1">
      {/* Results Bar - Desktop Tabs Style like Flipkart */}
      <div className="hidden md:flex flex-col border-b border-black/5 pb-4 mb-2">
        <div className="flex items-center gap-6 py-2">
          <span className="font-inter text-sm font-bold text-black/90">Sort By</span>
          {[
            { id: "popularity", label: "Relevance" },
            { id: "popularity", label: "Popularity" },
            { id: "low-high", label: "Price -- Low to High" },
            { id: "high-low", label: "Price -- High to Low" },
            { id: "newest", label: "Newest First" }
          ].map((sortOption) => (
            <button
              key={sortOption.label}
              onClick={() => onSortChange(sortOption.id)}
              className="font-inter text-sm text-black/60 hover:text-[#CC0000] border-b-2 border-transparent hover:border-[#CC0000] pb-1 transition-all"
            >
              {sortOption.label}
            </button>
          ))}
        </div>
        
        {/* Active Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-4">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (typeof value === "object" && !Object.values(value as any).some(v => v !== 0))) return null;
            
            let label = "";
            if (key === "price") {
              const { min, max } = value as { min: number, max: number };
              label = `₹${min} - ₹${max}`;
            } else {
              label = value as string;
            }

            return (
              <div 
                key={key}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 border border-black/10 font-inter text-[10px] text-black/70 tracking-wider uppercase"
              >
                {label}
                <button 
                  onClick={() => onRemoveFilter(key)}
                  className="hover:text-[#CC0000] font-bold text-xs"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 md:gap-x-6 md:gap-y-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 space-y-6">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-black/10 font-inter text-xs text-black/30 hover:border-black/30 transition-all cursor-not-allowed">
            PREVIOUS
          </button>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center bg-black text-white font-inter text-xs font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-black/10 text-black/70 font-inter text-xs hover:border-black/30">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-black/10 text-black/70 font-inter text-xs hover:border-black/30">3</button>
            <span className="px-2 text-black/30">...</span>
            <button className="w-8 h-8 flex items-center justify-center border border-black/10 text-black/70 font-inter text-xs hover:border-black/30">12</button>
          </div>

          <button className="px-4 py-2 border border-black/10 font-inter text-xs text-black/70 hover:border-black/30 transition-all">
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
