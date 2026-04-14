"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import CatalogCTA from "@/components/shop/CatalogCTA";
import { Product } from "@/components/shop/ProductCard";
import { getProducts, getProductImage, type SupabaseProduct } from "@/lib/api/products";

/** Map a Supabase product to the existing ProductCard interface. */
function toShopProduct(p: SupabaseProduct): Product {
  // Collect unique colors from variants
  const colorsMap = new Map<string, string>();
  const sizes: string[] = [];
  p.product_variants.forEach((v) => {
    if (v.color && !colorsMap.has(v.color)) {
      colorsMap.set(v.color, v.color); // hex not available in DB, use name
    }
    if (!sizes.includes(v.size)) {
      sizes.push(v.size);
    }
  });

  const colors = Array.from(colorsMap.entries()).map(([name]) => ({
    name,
    hex: "#888888", // DB doesn't store hex — neutral fallback
  }));

  return {
    id: p.id,       // UUID
    slug: p.slug,
    name: p.name.toUpperCase(),
    price: p.base_price,
    originalPrice: undefined,
    rating: undefined,
    image: getProductImage(p.slug),
    category: "Shoes & Bags",
    colors: colors.length > 0 ? colors : [{ name: "Default", hex: "#888888" }],
    sizes,
    variants: p.product_variants,
  };
}

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    price: { min: 0, max: 50000 },
    color: "",
    size: ""
  });

  const [sortBy, setSortBy] = useState("popularity");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = ["All", "Shoes & Bags"];

  // Fetch products from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setAllProducts(data.map(toShopProduct));
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchCategory = !filters.category || filters.category === "All" || product.category === filters.category;
      const matchPrice = product.price >= filters.price.min && product.price <= filters.price.max;
      const matchColor = !filters.color || product.colors.some(c => c.name === filters.color);
      const matchSize = !filters.size || product.sizes.includes(filters.size) || filters.size === "All";

      return matchCategory && matchPrice && matchColor && matchSize;
    });

    // Sorting
    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.reverse();
    }

    return result;
  }, [allProducts, filters, sortBy]);

  const removeFilter = (key: string) => {
    if (key === "price") {
      setFilters(prev => ({ ...prev, price: { min: 0, max: 50000 } }));
    } else {
      setFilters(prev => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <main className="bg-[#F1F3F6] min-h-screen pt-20 pb-20 md:pb-10 font-inter">
      {/* Mobile Top Header (Search & Category) */}
      <div className="bg-white md:bg-transparent border-b border-black/5 md:border-none sticky top-[72px] z-50 md:static">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-3 md:pt-6">
          {/* Breadcrumb - Hidden on tiny mobile */}
          <div className="hidden md:flex items-center gap-2 text-[10px] text-black/50 mb-6 uppercase tracking-widest">
            <span>Shop</span> <ChevronRight size={10} /> <span className="text-black/90 font-medium">All Products</span>
          </div>

          {/* Horizontal Category Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 md:hidden mt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  (filters.category === cat || (!filters.category && cat === "All"))
                    ? "bg-black text-white border-black"
                    : "bg-white text-black/60 border-black/10 hover:border-black/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Hero Banner - Hidden on Mobile */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 hidden md:block mt-8">
        <div className="relative h-[220px] bg-black/5 flex items-center overflow-hidden mb-12">
          <div className="flex-1 pl-12 z-[2]">
            <h1 className="font-bebas text-[48px] md:text-[56px] text-black/90 leading-[0.9] mb-6 tracking-wide">
              NEW SEASON.<br />NEW ARRIVALS.
            </h1>
            <p className="font-inter text-[10px] text-black/50 uppercase tracking-widest mb-8">
              Interchangeable components. Endless possibilities.
            </p>
            <button className="bg-[#CC0000] text-white font-bebas text-lg px-10 py-3 hover:translate-x-1 transition-all tracking-widest">
              SHOP NOW →
            </button>
          </div>
          <div className="flex-1 h-full relative">
            <Image
              src="/assets/shop/hero/banner.png"
              alt="Hero Model"
              fill
              className="object-cover object-right"
              priority
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 mt-4 md:mt-8">
        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 relative items-start">
          {/* Sidebar - Hidden on Mobile */}
          <div className="hidden md:block w-[280px] shrink-0 sticky top-[90px] h-[calc(100vh-110px)] overflow-y-auto custom-scrollbar pr-2">
            <FilterSidebar
              activeFilters={filters}
              onFilterChange={setFilters}
              categories={[]}
            />
          </div>

          {/* Product Area */}
          <div className="flex-1 bg-white p-4 md:p-6 rounded-sm shadow-sm min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4 md:gap-x-6 md:gap-y-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-black/5 mb-4" />
                    <div className="h-4 bg-black/5 mb-2 w-3/4" />
                    <div className="h-3 bg-black/5 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                totalCount={allProducts.length}
                activeFilters={filters}
                onRemoveFilter={removeFilter}
                onSortChange={setSortBy}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (SORT / FILTER) */}
      <div className="fixed bottom-0 left-0 w-full h-14 bg-white grid grid-cols-2 border-t border-black/10 z-[100] md:hidden">
        <button 
          className="flex items-center justify-center gap-2 text-sm font-bold text-black/80 border-r border-black/5 active:bg-black/5 transition-colors"
          onClick={() => {/* Implement simple sort sheet */}}
        >
          <ArrowUpDown size={18} /> SORT
        </button>
        <button 
          className="flex items-center justify-center gap-2 text-sm font-bold text-black/80 active:bg-black/5 transition-colors"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <SlidersHorizontal size={18} /> FILTER
        </button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1000]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85%] h-full bg-white z-[1001] shadow-2xl flex flex-col pt-16"
            >
              <div className="p-4 border-b border-black/10 flex items-center justify-between">
                <h2 className="font-bebas text-xl tracking-wide">Filters</h2>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="font-inter text-xs text-schlaut-red font-bold"
                >
                  CLOSE
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <FilterSidebar
                  activeFilters={filters}
                  onFilterChange={setFilters}
                  categories={[]}
                />
              </div>
              <div className="p-4 bg-white border-t border-black/10 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setFilters({ category: "", price: { min: 0, max: 50000 }, color: "", size: "" });
                    setIsFilterDrawerOpen(false);
                  }}
                  className="py-3 text-xs font-bold border border-black/10 uppercase tracking-widest"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="py-3 bg-[#CC0000] text-white text-xs font-bold uppercase tracking-widest"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Catalog CTA */}
      <div className="mt-12 md:mt-24">
        <CatalogCTA />
      </div>
    </main>
  );
}
