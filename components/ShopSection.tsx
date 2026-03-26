"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PRODUCTS = [
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

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[0];
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex flex-col bg-white transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
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
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bebas text-xl tracking-wide text-black/90">
          {product.name}
        </h3>
        <p className="mt-1 font-inter text-xs text-black/50">
          {product.description}
        </p>
        <p className="mt-3 font-inter text-sm font-semibold text-black">
          {product.price}
        </p>
        <button
          type="button"
          className="mt-4 w-full border border-black py-2.5 font-inter text-xs uppercase tracking-wide transition-all duration-250 ease-out hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white"
        >
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}

export default function ShopSection() {
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
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
