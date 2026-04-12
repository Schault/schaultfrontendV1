"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import CategorySection from "@/components/shop/CategorySection";
import CatalogCTA from "@/components/shop/CatalogCTA";
import { Product } from "@/components/shop/ProductCard";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "CLASSIC BOMBER JACKET",
    price: 8500,
    originalPrice: 12500,
    rating: 4.5,
    image: "/assets/shop/products/product1.png",
    category: "Jackets",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "2",
    name: "UTILITY OVERSHIRT",
    price: 4200,
    originalPrice: 5800,
    rating: 4.2,
    image: "/assets/shop/products/product2.png",
    category: "Shirts",
    colors: [
      { name: "Olive", hex: "#808000" },
      { name: "Beige", hex: "#F5F5DC" }
    ],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "3",
    name: "MODULAR CARGO PANTS",
    price: 5800,
    originalPrice: 7900,
    rating: 4.8,
    image: "/assets/shop/products/product3.png",
    category: "Pants",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#808080" }
    ],
    sizes: ["S", "M", "L"]
  },
  {
    id: "4",
    name: "TECHNICAL HOODIE",
    price: 3500,
    originalPrice: 4800,
    rating: 4.0,
    image: "/assets/shop/products/product4.png",
    category: "Hoodies",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#CC0000" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "5",
    name: "REPLACEABLE SOLE SNEAKER",
    price: 12500,
    originalPrice: 18500,
    rating: 4.9,
    image: "/assets/shop/products/product5.png",
    category: "Shoes & Bags",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Grey", hex: "#808080" }
    ],
    sizes: ["7", "8", "9", "10"]
  },
  {
    id: "6",
    name: "MODULAR TOTEPACK",
    price: 2900,
    originalPrice: 3900,
    rating: 4.3,
    image: "/assets/shop/products/product6.png",
    category: "Accessories",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#808000" }
    ],
    sizes: ["One Size"]
  },
  {
    id: "7",
    name: "GRAPHIC ELEMENTS TEE",
    price: 1800,
    originalPrice: 2400,
    rating: 4.1,
    image: "/assets/shop/products/product7.png",
    category: "T-Shirts",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#CC0000" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "8",
    name: "WEATHERPROOF PARKA",
    price: 14500,
    originalPrice: 19500,
    rating: 4.7,
    image: "/assets/shop/products/product8.png",
    category: "Jackets",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Camel", hex: "#C19A6B" }
    ],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "9",
    name: "MODULAR STREET RUNNER",
    price: 9800,
    originalPrice: 13500,
    rating: 4.6,
    image: "/assets/shop/products/product9.png",
    category: "Shoes & Bags",
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "White", hex: "#FFFFFF" }
    ],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "10",
    name: "URBAN UTILITY BELT",
    price: 1200,
    originalPrice: 1800,
    rating: 4.4,
    image: "/assets/shop/products/product6.png",
    category: "Accessories",
    colors: [
      { name: "Black", hex: "#000000" }
    ],
    sizes: ["One Size"]
  },
  {
    id: "11",
    name: "SLIM FIT CHINOS",
    price: 4500,
    originalPrice: 5900,
    rating: 4.2,
    image: "/assets/shop/products/product3.png",
    category: "Pants",
    colors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Olive", hex: "#808000" }
    ],
    sizes: ["S", "M", "L"]
  },
  {
    id: "12",
    name: "OVERSIZED FLANNEL",
    price: 3200,
    originalPrice: 4200,
    rating: 4.8,
    image: "/assets/shop/products/product2.png",
    category: "Shirts",
    colors: [
      { name: "Grey", hex: "#808080" },
      { name: "Red", hex: "#CC0000" }
    ],
    sizes: ["S", "M", "L", "XL"]
  }
];

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: "",
    price: { min: 1000, max: 15000 },
    color: "",
    size: ""
  });

  const [sortBy, setSortBy] = useState("popularity");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Jackets", "Shirts", "Pants", "Hoodies", "Shoes & Bags", "Accessories", "T-Shirts"];

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(product => {
      const matchCategory = !filters.category || filters.category === "All" || product.category === filters.category;
      const matchPrice = product.price >= filters.price.min && product.price <= filters.price.max;
      const matchColor = !filters.color || product.colors.some(c => c.name === filters.color);
      const matchSize = !filters.size || product.sizes.includes(filters.size) || filters.size === "All";
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchPrice && matchColor && matchSize && matchSearch;
    });

    // Sorting
    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  const removeFilter = (key: string) => {
    if (key === "price") {
      setFilters(prev => ({ ...prev, price: { min: 1000, max: 15000 } }));
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

          {/* Search Bar - Flipkart Style */}
          <div className="relative group max-w-2xl mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white md:bg-black/5 border border-black/10 md:border-transparent focus:border-[#CC0000] focus:ring-0 px-10 py-2.5 md:py-3 text-sm rounded-sm transition-all outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#CC0000]" size={18} />
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
        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Sidebar - Hidden on Mobile */}
          <div className="hidden md:block">
            <FilterSidebar
              activeFilters={filters}
              onFilterChange={setFilters}
              categories={[]}
            />
          </div>

          {/* Product Area */}
          <div className="flex-1 bg-white p-4 md:p-6 rounded-sm shadow-sm">
            <ProductGrid
              products={filteredProducts}
              totalCount={MOCK_PRODUCTS.length}
              activeFilters={filters}
              onRemoveFilter={removeFilter}
              onSortChange={setSortBy}
            />
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
                    setFilters({ category: "", price: { min: 1000, max: 15000 }, color: "", size: "" });
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
