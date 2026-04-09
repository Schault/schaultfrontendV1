"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
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

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(product => {
      const matchCategory = !filters.category || product.category === filters.category;
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
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [filters, sortBy]);

  const removeFilter = (key: string) => {
    if (key === "price") {
      setFilters(prev => ({ ...prev, price: { min: 1000, max: 15000 } }));
    } else {
      setFilters(prev => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <main className="bg-white min-h-screen pt-24">
      {/* Breadcrumb & Hero */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-2 font-inter text-[10px] text-black/50 mb-6 uppercase tracking-widest">
          <span>Shop</span>
          <span>&gt;</span>
          <span className="text-black/90 font-medium">All Products</span>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[220px] bg-black/5 flex items-center overflow-hidden mb-16">
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

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Sidebar */}
          <FilterSidebar
            activeFilters={filters}
            onFilterChange={setFilters}
            categories={[]}
          />

          {/* Product Area */}
          <ProductGrid
            products={filteredProducts}
            totalCount={MOCK_PRODUCTS.length}
            activeFilters={filters}
            onRemoveFilter={removeFilter}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* Other Categories */}
      <CategorySection />

      {/* Catalog CTA */}
      <CatalogCTA />
    </main>
  );
}
