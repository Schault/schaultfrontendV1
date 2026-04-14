"use client";

import { useCart } from "@/context/CartContext";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { getProductById, getProductImage, type SupabaseProduct, type ProductVariant } from "@/lib/api/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProductById(params.id);
        if (!cancelled) {
          setProduct(data);
          if (data) {
            // Set default color from first variant
            const colors = Array.from(new Set(data.product_variants.map((v) => v.color).filter(Boolean)));
            if (colors.length > 0) {
              setSelectedColor(colors[0]!);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F1F3F6] pt-20 pb-12 font-inter">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12">
          <div className="animate-pulse space-y-8 pt-8">
            <div className="h-4 w-48 bg-black/5" />
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-[60%]">
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-black/5" />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[40%] space-y-4">
                <div className="h-10 bg-black/5 w-3/4" />
                <div className="h-6 bg-black/5 w-1/3" />
                <div className="h-8 bg-black/5 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return notFound();
  }

  const image = getProductImage(product.slug);

  // Get unique colors and sizes from variants
  const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color).filter(Boolean))) as string[];
  const uniqueSizes = Array.from(new Set(product.product_variants.map((v) => v.size)));

  // Find the selected variant
  const getSelectedVariant = (): ProductVariant | undefined => {
    return product.product_variants.find(
      (v) =>
        v.size === selectedSize &&
        (uniqueColors.length === 0 || v.color === selectedColor)
    );
  };

  // Check if a size is available (has stock for the selected color)
  const isSizeAvailable = (size: string): boolean => {
    return product.product_variants.some(
      (v) =>
        v.size === size &&
        v.stock_quantity > 0 &&
        (uniqueColors.length === 0 || v.color === selectedColor)
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    const variant = getSelectedVariant();
    if (!variant) {
      toast.error("Selected variant not found.");
      return;
    }
    if (variant.stock_quantity <= 0) {
      toast.error("This variant is out of stock.");
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(
        variant.id,
        product.slug,
        product.name,
        product.base_price,
        variant.size,
        variant.color,
      );
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart. Please log in.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
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
          <span className="text-black/90 font-medium truncate">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-2">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-[60%] lg:sticky top-24 shrink-0 flex flex-col gap-2">
            {/* Desktop 2x2 Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="relative aspect-square bg-white border border-black/5 flex items-center justify-center p-8 group overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} View ${idx}`}
                    fill
                    className={`object-contain transition-transform duration-700 group-hover:scale-105 p-8 ${idx > 1 ? "scale-90 opacity-90" : ""}`}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Horizontal Swipe */}
            <div className="lg:hidden flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] border border-black/5 bg-white">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="relative w-full shrink-0 snap-center aspect-square flex items-center justify-center p-8">
                  <Image
                    src={image}
                    alt={`${product.name} View ${idx}`}
                    fill
                    className="object-contain p-8"
                  />
                </div>
              ))}
            </div>
            
            {/* Action Buttons (Desktop only) */}
            <div className="hidden lg:flex gap-4 mt-4 h-16">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize}
                className="flex-1 border-2 border-black/10 hover:border-black bg-white text-black font-bebas text-2xl tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? "ADDING..." : "ADD TO CART"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart || !selectedSize}
                className="flex-1 bg-[#CC0000] text-white font-bebas text-2xl tracking-wider transition-all hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="mt-2 text-sm text-black/50 tracking-wide uppercase">Shoes & Bags</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 pb-6 border-b border-black/10">
              <span className="font-inter text-3xl font-bold text-black/90">
                ₹{product.base_price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Special Offers Block */}
            <div className="mt-6 border border-dashed border-black/20 p-4 bg-green-50/30">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#388e3c] text-lg">✦</span>
                <div>
                  <h4 className="font-bold text-sm text-black/90">Available offers</h4>
                  <ul className="mt-2 space-y-2 text-xs text-black/70 font-inter">
                    <li><span className="font-bold text-black/80">Free Shipping</span> on all orders</li>
                    <li><span className="font-bold text-black/80">Modular Design</span> Replace individual components when worn out</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="mt-8">
                <h3 className="font-inter text-sm text-black/50 uppercase tracking-widest font-semibold mb-3">
                  Color <span className="text-black/80 capitalize font-normal">— {selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(null); // Reset size when color changes
                      }}
                      className={`px-4 py-2 border text-sm font-inter transition-all ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-black/20 bg-white text-black/70 hover:border-black/40"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="font-inter text-sm text-black/50 uppercase tracking-widest font-semibold">
                    Size
                  </h3>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {uniqueSizes.map((size) => {
                    const available = isSizeAvailable(size);
                    return (
                      <button
                        key={size}
                        disabled={!available}
                        onClick={() => setSelectedSize(size)}
                        className={`
                          pt-2 pb-1.5 font-bebas text-lg border transition-all duration-200 ease-out flex items-center justify-center relative overflow-hidden
                          ${!available 
                              ? "border-black/10 bg-[#F5F5F5] text-black/30 cursor-not-allowed"
                              : selectedSize === size
                                ? "border-black bg-black text-white"
                                : "border-black/20 bg-white text-black hover:border-black/60"
                          }`}
                      >
                        <span className={!available ? "line-through" : ""}>{size}</span>
                        {!available && (
                           <div className="absolute inset-0 w-full h-[1px] bg-black/10 top-1/2 -rotate-[35deg] origin-center scale-150" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-red-500 text-xs mt-2 font-inter font-medium">Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-12 pt-6 border-t border-black/10">
              <h3 className="font-bebas text-xl tracking-wide text-black/90 mb-4">Product Details</h3>
              <p className="font-inter text-sm leading-relaxed text-black/70">
                {product.description || `Engineered for maximum modularity, the ${product.name} lets you swap components effortlessly. Features advanced breathability, patented snap-fit connectors, and uncompromising brutalist aesthetics.`}
              </p>
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
          disabled={addingToCart || !selectedSize}
          className="flex items-center justify-center font-bebas text-xl text-black tracking-widest border-r border-black/10 bg-white active:bg-black/5 transition-colors disabled:opacity-50"
        >
          {addingToCart ? "ADDING..." : "ADD TO CART"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={addingToCart || !selectedSize}
          className="flex items-center justify-center font-bebas text-xl text-white tracking-widest bg-[#CC0000] active:bg-black transition-colors disabled:opacity-50"
        >
          BUY NOW
        </button>
      </div>

    </main>
  );
}
