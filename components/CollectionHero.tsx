"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

type PlaceholderItem = {
  id: string;
  name: string;
  price: string;
  image: string;
};

// ── Data ────────────────────────────────────────────────────────────────────

const SHOES: PlaceholderItem[] = [
  { id: "shoe-1", name: "Shoe One", price: "₹1,999", image: "/images/shoes/bluewhite.jpg" },
  { id: "shoe-2", name: "Shoe Two", price: "₹1,999", image: "/images/shoes/brownblack.jpg" },
  { id: "shoe-3", name: "Shoe Three", price: "₹1,999", image: "/images/shoes/darkblue.jpg" },
  { id: "shoe-4", name: "Shoe Four", price: "₹1,999", image: "/images/shoes/whitefull.jpg" },
  { id: "shoe-5", name: "Shoe Five", price: "₹1,999", image: "/images/shoes/yellow.jpg" },
];

const SOLES: PlaceholderItem[] = [
  { id: "sole-1", name: "Standard Outsole", price: "₹899", image: "/images/outsole.webp" },
  { id: "sole-2", name: "Comfort Midsole", price: "₹599", image: "/images/midsole.webp" },
];

// ── Placeholder Card ────────────────────────────────────────────────────────

function PlaceholderCard({ item, index }: { item: PlaceholderItem; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group flex flex-col bg-white transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-sm"
    >
      <div className="flex flex-col flex-1 h-full w-full outline-none">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain transition-transform duration-250 group-hover:scale-[1.02] p-4"
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
            {item.name}
          </h3>
          <p className="mt-3 font-inter text-sm font-semibold text-black">
            {item.price}
          </p>
          <button className="mt-auto w-full border border-black py-2.5 text-center font-inter text-[10px] uppercase tracking-widest transition-all duration-250 ease-out hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────

export default function CollectionHero() {
  return (
    <section className="bg-[#FFFFFF] px-4 sm:px-6 pt-32 pb-24 md:px-12 lg:px-24 min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Animated Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="mb-4 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
          <h1 className="font-bebas text-5xl tracking-[0.1em] text-black md:text-7xl lg:text-8xl">
            OUR COLLECTION
          </h1>
          <p className="mt-4 max-w-xl font-inter text-base text-black/60 md:text-lg">
            Replace parts. Not the entire shoe. Discover our fully modular lineup engineered for performance, style, and sustainability.
          </p>
        </motion.div>

        {/* Shoes Collection */}
        <div className="mb-20">
          <h2 className="mb-8 font-bebas text-3xl tracking-wide text-black/90 md:text-4xl">
            Collection Name
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SHOES.map((item, index) => (
              <PlaceholderCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Soles Collection */}
        <div>
          <h2 className="mb-8 font-bebas text-3xl tracking-wide text-black/90 md:text-4xl">
            Soles
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SOLES.map((item, index) => (
              <PlaceholderCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
