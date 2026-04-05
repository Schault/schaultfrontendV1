"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify";

// ── Types ───────────────────────────────────────────────────────────────────

type ProductType = {
  id: string;        // used as URL slug
  name: string;
  description: string;
  price: string;
  image: string;
  variantId?: string; // Shopify variant GID (for checkout)
};

// ── Mock / Fallback Data ────────────────────────────────────────────────────

const MOCK_SHOES: ProductType[] = [
  {
    id: "upper",
    name: "SCHAULT Upper",
    description: "Canvas breathable upper, snap-fit connector",
    price: "₹899",
    image: "/images/upper.webp",
  },
  {
    id: "midsole",
    name: "SCHAULT Midsole",
    description: "PU-casted cushioning layer",
    price: "₹599",
    image: "/images/midsole.webp",
  },
  {
    id: "outsole",
    name: "SCHAULT Outsole",
    description: "Grip-textured rubber sole",
    price: "₹499",
    image: "/images/outsole.webp",
  },
  {
    id: "complete",
    name: "SCHAULT Complete",
    description: "Full modular set, all 3 parts",
    price: "₹1,799",
    image: "/images/fullshoe.webp",
  },
];

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

// ── Product Card ────────────────────────────────────────────────────────────

function ProductCard({
  product,
}: {
  product: ProductType;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

export default function ShopSection() {
  const [shoes, setShoes] = useState<ProductType[]>(MOCK_SHOES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data: ShopifyProduct[] = await res.json();
          if (data && data.length > 0) {
            setShoes(data.map(shopifyToProduct));
          }
        }
      } catch {
        // Shopify not configured – silently use mock data
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section
      id="shop"
      className="border-t border-black/10 bg-[#FFFFFF] px-6 py-24 md:px-12 lg:px-24"
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
              <div key={i} className="aspect-[3/4] animate-pulse bg-black/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shoes.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <h3 className="mt-16 mb-8 font-bebas text-3xl tracking-wide text-black/90">
          SOLES
        </h3>
        <div className="flex items-center justify-center p-12 border border-dashed border-black/20 bg-black/5">
          <p className="font-inter text-sm text-black/50 uppercase tracking-wide">
            Coming Soon
          </p>
        </div>
      </div>
    </section>
  );
}
