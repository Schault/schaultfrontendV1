"use client";

import React, { useState, useEffect } from "react";
import ProductCard, { Product } from "./ProductCard";
import SizeChartModal from "./SizeChartModal";
import { Ruler } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex-1">
      {/* Results Bar - Desktop Tabs Style like Flipkart */}
      <div className="hidden md:flex flex-col border-b border-black/5 pb-4 mb-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
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
                className="font-inter text-sm text-black/60 hover:text-[#0350F0] border-b-2 border-transparent hover:border-[#0350F0] pb-1 transition-all"
              >
                {sortOption.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsSizeChartOpen(true)}
            className="flex items-center gap-2 font-bebas text-lg px-4 py-1.5 border-2 border-black/90 text-black hover:bg-[#0350F0] hover:border-[#0350F0] hover:text-white transition-all tracking-wider"
          >
            <Ruler size={16} />
            SIZE CHART
          </button>
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
                  className="hover:text-[#0350F0] font-bold text-xs"
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
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 space-y-6">
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className={`px-4 py-2 border border-black/10 font-inter text-xs transition-all ${currentPage === 1 ? 'text-black/30 cursor-not-allowed' : 'text-black/70 hover:border-black/30'}`}
          >
            PREVIOUS
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                 className={`w-8 h-8 flex items-center justify-center font-inter text-xs transition-all ${
                  currentPage === i + 1 
                    ? "bg-black text-white font-medium" 
                    : "border border-black/10 text-black/70 hover:border-black/30"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 border border-black/10 font-inter text-xs transition-all ${currentPage === totalPages ? 'text-black/30 cursor-not-allowed' : 'text-black/70 hover:border-black/30'}`}
          >
            NEXT
          </button>
        </div>
      </div>

      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
      />
    </div>
  );
};

export default ProductGrid;
