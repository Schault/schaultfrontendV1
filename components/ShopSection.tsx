"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "./providers";
import { getProducts, getProductImage, type SupabaseProduct } from "@/lib/api/products";
import toast from "react-hot-toast";

// ── Types ───────────────────────────────────────────────────────────────────

type ProductType = {
  id: string;        // UUID
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  variantId?: string; // first variant ID for quick-add
};

// ── Product Card ────────────────────────────────────────────────────────────

function ProductCard({
  product,
}: {
  product: ProductType;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
    
    if (!product.variantId) {
      toast.error("No variants available.");
      return;
    }

    try {
      await addItem(
        product.variantId,
        product.slug,
        product.name,
        numericPrice,
        "9", // Default size
        null,
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart. Please log in.");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex flex-col bg-white transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-sm"
    >
      <div className="flex flex-col flex-1 h-full w-full outline-none">
        <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-250 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center font-inter text-xs text-black/40"
              aria-hidden
            >
              Placeholder
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/product/${product.id}`} className="hover:text-[#CC0000] transition-colors">
            <h3 className="font-bebas text-xl tracking-wide text-black/90">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 font-inter text-xs text-black/50 line-clamp-2">
            {product.description}
          </p>
          <p className="mt-3 font-inter text-sm font-semibold text-black">
            {product.price}
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-auto w-full border border-black py-2.5 text-center font-inter text-[10px] uppercase tracking-widest transition-all duration-250 ease-out hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────

export default function ShopSection() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setProducts(
            data.map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              description: p.description || "",
              price: `₹${p.base_price.toLocaleString("en-IN")}`,
              image: getProductImage(p.slug),
              variantId: p.product_variants[0]?.id,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch products for ShopSection:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="shop"
      className="border-t border-black/10 bg-[#FFFFFF] px-4 sm:px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
        <h2 className="font-bebas text-4xl tracking-wide text-black/90 md:text-5xl">
          THE SYSTEM
        </h2>
        <p className="mt-3 font-inter text-base text-black/60">
          Mix. Match. Replace. Only pay for what you need.
        </p>

        <h3 className="mt-16 mb-8 font-bebas text-3xl tracking-wide text-black/90">
          SHOES
        </h3>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-black/5 mb-4" />
                <div className="h-4 bg-black/5 mb-2 w-3/4" />
                <div className="h-3 bg-black/5 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 border border-dashed border-black/20 bg-black/5">
            <p className="font-inter text-sm text-black/50 uppercase tracking-wide">
              No products available
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="inline-block border border-black px-8 py-3 font-inter text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:bg-black hover:text-white"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
