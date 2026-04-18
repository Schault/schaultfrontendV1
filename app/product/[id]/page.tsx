"use client";

import { useCart } from "@/context/CartContext";
import { notFound, useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - offsetWidth : scrollLeft + offsetWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Find product from mocked data
  const product = useMemo(() => {
    const p = MOCK_PRODUCTS.find((p) => p.id === params.id);
    return p || null;
  }, [params.id]);

  if (!product) {
    return notFound();
  }

  // Set default color
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0].name);
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to access this page.", { position: "bottom-center" });
      router.push("/auth");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    if (!(await checkAuth())) return;

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      color: selectedColor || undefined,
      size: selectedSize
    });
  };

  const handleBuyNow = async () => {
    if (!selectedSize) return;
    if (!(await checkAuth())) return;

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      color: selectedColor || undefined,
      size: selectedSize
    });
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F1F3F6] pt-20 pb-12 font-inter">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] text-black/50 py-4 uppercase tracking-widest font-inter">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> 
          <span>/</span> 
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span> 
          <span className="hover:text-black transition-colors cursor-pointer">{product.category}</span>
          <span>/</span>
          <span className="text-black/90 font-medium truncate">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-2">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-[60%] lg:sticky top-24 shrink-0 flex flex-col gap-2">
            {/* Desktop 2x2 Grid (Mocked) */}
            <div className="hidden lg:grid grid-cols-2 gap-2">
              {(product.gallery || [product.image, product.image, product.image, product.image]).map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-white border border-black/5 flex items-center justify-center p-8 group overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.name} View ${idx + 1}`}
                    fill
                    className={`object-contain transition-transform duration-700 group-hover:scale-105 p-8 ${!product.gallery && idx > 0 ? "scale-90 opacity-90" : ""}`}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Horizon Swipe */}
            <div className="lg:hidden relative">
              <div 
                ref={scrollRef}
                className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] border border-black/5 bg-white"
              >
                {(product.gallery || [product.image, product.image, product.image, product.image]).map((img, idx) => (
                  <div key={idx} className="relative w-full shrink-0 snap-center aspect-square flex items-center justify-center p-8">
                    <Image
                      src={img}
                      alt={`${product.name} Slide ${idx + 1}`}
                      fill
                      className="object-contain p-8"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-black/5 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-black/5 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            </div>
            
            {/* Action Buttons (Desktop only - Mobile has fixed bottom bar) */}
            <div className="hidden lg:flex gap-4 mt-4 h-16">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-black/10 hover:border-black bg-white text-black font-bebas text-2xl tracking-wider transition-all duration-300"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#0350F0] text-white font-bebas text-2xl tracking-wider transition-all hover:bg-black"
              >
                BUY NOW
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-[40%] flex flex-col pt-2 md:pt-0 bg-transparent lg:bg-white lg:p-8 lg:border lg:border-black/5 relative">
            
            <h1 className="font-bebas text-3xl sm:text-4xl lg:text-5xl tracking-wide text-black/95 leading-[1.1]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-black/50 tracking-wide uppercase">{product.category}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 pb-6 border-b border-black/10">
              <span className="font-inter text-3xl font-bold text-black/90">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-inter text-lg text-black/40 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="font-inter text-base font-bold text-[#388e3c]">
                    {discount}% off
                  </span>
                </>
              )}
            </div>


            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="font-inter text-sm text-black/50 uppercase tracking-widest font-semibold mb-3">
                  Color <span className="text-black/80 capitalize font-normal">— {selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === color.name ? "border-[#0350F0] p-1 scale-110" : "border-black/10 hover:border-black/30"
                      }`}
                    >
                      <span 
                        className="w-full h-full rounded-full shadow-inner block"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="font-inter text-sm text-black/50 uppercase tracking-widest font-semibold">
                    Size
                  </h3>
                  <button onClick={() => toast("Size chart coming soon!", { icon: "📏" })} className="text-xs text-[#0350F0] font-semibold hover:underline">Size Chart</button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.sizes.map((size) => {
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`
                          pt-2 pb-1.5 font-bebas text-lg border transition-all duration-200 ease-out flex items-center justify-center relative overflow-hidden
                          ${selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-black/20 bg-white text-black hover:border-black/60"
                          }`}
                      >
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-red-500 text-xs mt-2 font-inter font-medium">Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Description / Static Specs */}
            <div className="mt-12 pt-6 border-t border-black/10">
              <h3 className="font-bebas text-xl tracking-wide text-black/90 mb-4">Product Details</h3>
              <p className="font-inter text-sm leading-relaxed text-black/70">
                Engineered for maximum modularity, the {product.name} lets you swap components effortlessly, meaning you only replace what's worn out. Features advanced breathability, patented snap-fit connectors, and uncompromising brutalist aesthetics.
              </p>
              
              <ul className="mt-6 space-y-3 font-inter text-sm text-black/80">
                <li className="flex gap-4">
                  <span className="text-black/50 w-24">Material</span>
                  <span className="flex-1 font-medium">Durable Synthetic & Recycled Canvas</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-black/50 w-24">Fit</span>
                  <span className="flex-1 font-medium">Regular, True to Size</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-black/50 w-24">Care</span>
                  <span className="flex-1 font-medium">Machine washable upper, wipe clean sole.</span>
                </li>
              </ul>
            </div>

            {/* Buffer space for mobile sticky bar */}
            <div className="h-24 lg:hidden"></div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white grid grid-cols-2 border-t border-black/10 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center font-bebas text-xl text-black tracking-widest border-r border-black/10 bg-white active:bg-black/5 transition-colors"
        >
          ADD TO CART
        </button>
        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center font-bebas text-xl text-white tracking-widest bg-[#0350F0] active:bg-black transition-colors"
        >
          BUY NOW
        </button>
      </div>

    </main>
  );
}
