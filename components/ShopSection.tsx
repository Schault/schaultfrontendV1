"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ShopifyProduct, ShopifyCollection } from "@/lib/shopify";

// ── Types ───────────────────────────────────────────────────────────────────

type ProductType = {
  id: string;        // used as URL slug
  name: string;
  description: string;
  price: string;
  image: string;
  variantId?: string; // Shopify variant GID (for checkout)
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function shopifyToProduct(p: ShopifyProduct): ProductType {
  const firstImage = p.images.edges[0]?.node;
  const firstVariant = p.variants.edges[0]?.node;
  const price = p.priceRange.minVariantPrice;

  return {
    id: p.handle,
    name: p.title,
    description: p.description,
    price: `$${parseFloat(price.amount).toFixed(2)}`,
    image: firstImage?.url ?? "/images/shoes/bluewhite.jpg",
    variantId: firstVariant?.id,
  };
}

import { useCart } from "./providers";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ── Product Card ────────────────────────────────────────────────────────────

function ProductCard({
  product,
}: {
  product: ProductType;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const supabase = createClient();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to access this page.", { position: "bottom-center" });
      router.push("/auth");
      return;
    }
    
    // Parse numeric price from string like "₹899" or "$89.00"
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
    
    addItem({
      id: `${product.id}-default`,
      shoeId: product.id,
      name: product.name,
      image: product.image,
      price: numericPrice,
      size: 9, // Default size for mockup
      quantity: 1,
    });
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

export default function ShopSection({ collections }: { collections: ShopifyCollection[] | null }) {
  // Try to find the user's uploaded collections
  const shoesCollection = collections?.find(c => c.title.toLowerCase().includes("carpe diem") || c.title.toLowerCase().includes("shoe"));
  const solesCollection = collections?.find(c => c.title.toLowerCase().includes("sole"));

  const shoesProducts = shoesCollection ? shoesCollection.products.edges.map(e => shopifyToProduct(e.node)) : [];
  const solesProducts = solesCollection ? solesCollection.products.edges.map(e => shopifyToProduct(e.node)) : [];

  return (
    <section
      id="shop"
      className="border-t border-black/10 bg-[#FFFFFF] px-4 sm:px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-8 border-b-2 border-black pb-4">
          <div>
            <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
            <h2 className="font-bebas text-5xl tracking-wide text-black/90 md:text-7xl">
              CARPE DIEM
            </h2>
          </div>
          <div className="text-right pb-1">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-[#CC0000]">The Modular System</p>
            <p className="font-inter text-[10px] text-black/40 uppercase tracking-widest mt-1">Version 1.0 // SS24</p>
          </div>
        </div>
        <p className="mt-3 font-inter text-base text-black/60">
          Mix. Match. Replace. Only pay for what you need.
        </p>

        {collections === null && (
          <div className="mt-8 mb-8 p-6 bg-red-50 border border-red-200 text-red-800 font-inter text-sm rounded">
            <strong>Shopify Connection Failed:</strong> No products were found. If you are viewing this on Vercel, please ensure you have added <code>NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN</code> and <code>NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> to your Vercel Project Environment Variables.
          </div>
        )}

        <h3 className="mt-16 mb-8 font-bebas text-3xl tracking-wide text-black/90">
          SHOES
        </h3>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shoesProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="inline-block border border-black px-8 py-3 font-inter text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:bg-black hover:text-white"
          >
            View Full Collection
          </Link>
        </div>

        <h3 className="mt-16 mb-8 font-bebas text-3xl tracking-wide text-black/90">
          SOLES
        </h3>

        {solesProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {solesProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 border border-dashed border-black/20 bg-black/5">
            <p className="font-inter text-sm text-black/50 uppercase tracking-wide">
              Coming Soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
