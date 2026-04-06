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
      {/* Results Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
        <div className="flex flex-col space-y-2">
          <p className="font-inter text-sm text-black/50">
            Showing {products.length} results from {totalCount} for: <span className="text-black/90 font-medium">All Products</span>
          </p>
          
          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
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

        <div className="flex items-center gap-3">
          <span className="font-inter text-xs text-black/50">Sort by</span>
          <select 
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-black/10 p-2 pr-8 font-inter text-xs text-black/70 bg-transparent outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4L5 6.5L7.5 4" stroke="%23000" stroke-width="1.5"/></svg>\')', backgroundPosition: 'calc(100% - 10px) center', backgroundRepeat: 'no-repeat' }}
          >
            <option value="popularity">Popularity</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
