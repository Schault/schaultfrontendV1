"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

// ── Types ───────────────────────────────────────────────────────────────────

type PlaceholderItem = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  isAvailable?: boolean;
};

// ── Data ────────────────────────────────────────────────────────────────────

const SHOES: PlaceholderItem[] = [
  { id: "shoe-1", name: "BlueBird", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/bluewhite.jpg", isAvailable: false },
  { id: "shoe-2", name: "RedEye", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/brownblack.jpg", isAvailable: true },
  { id: "shoe-3", name: "DayDream", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/darkblue.jpg", isAvailable: true },
  { id: "shoe-4", name: "DayBreak", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/whitefull.jpg", isAvailable: true },
  { id: "shoe-5", name: "WildRoot", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/yellow.jpg", isAvailable: false },
  { id: "shoe-6", name: "SunDaze", price: "₹2,999", originalPrice: "₹3,999", image: "/images/shoes/SunDaze/1.png", isAvailable: true },
];

const SOLES: PlaceholderItem[] = [
  { id: "sole-1", name: "White Outsole", price: "₹799", image: "/images/sole_1.webp", isAvailable: false },
  { id: "sole-2", name: "Black Outsole", price: "₹799", image: "/images/sole_2.webp", isAvailable: false },
];

// ── Placeholder Card ────────────────────────────────────────────────────────

function PlaceholderCard({ item, index }: { item: PlaceholderItem; index: number }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const isAvailable = item.isAvailable !== false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group flex flex-col bg-white transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-sm relative"
    >
      <div className="flex flex-col flex-1 h-full w-full outline-none">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
          {!isAvailable && (
            <div className="absolute top-3 right-3 z-10 bg-black/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Out of Stock
            </div>
          )}
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className={`h-full w-full object-contain transition-transform duration-250 group-hover:scale-[1.02] p-4 ${
                !isAvailable ? "opacity-50" : ""
              }`}
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
          <h3 className="font-inter text-xl tracking-wide text-black/90">
            {item.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="font-inter text-base font-bold text-black">
              {item.price}
            </span>
            {item.originalPrice && (
              <>
                <span className="font-inter text-xs text-black/40 line-through">
                  {item.originalPrice}
                </span>
                <span className="font-inter text-xs font-bold text-green-600">
                  25% off
                </span>
              </>
            )}
          </div>
          {isAvailable ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: item.id,
                  name: item.name,
                  price: parseInt(item.price.replace(/[^\d]/g, ""), 10) || 2999,
                  image: item.image,
                  quantity: 1,
                  color: "Default",
                  size: "US 9"
                });
                toast.success(`${item.name} added to cart!`);
              }}
              className="mt-6 w-full border border-black py-2.5 text-center font-inter text-[10px] uppercase tracking-widest transition-all duration-250 ease-out hover:border-[#0350F0] hover:bg-[#0350F0] hover:text-white"
            >
              Add to Cart
            </button>
          ) : (
            <button 
              disabled
              className="mt-6 w-full cursor-not-allowed border border-black/20 bg-black/5 py-2.5 text-center font-inter text-[10px] uppercase tracking-widest text-black/40"
            >
              Out of Stock
            </button>
          )}
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
          <div className="mb-4 h-0.5 w-12 bg-[#0350F0]" aria-hidden />
          <h1 className="font-inter text-5xl tracking-[0.1em] text-black md:text-7xl lg:text-8xl">
            OUR COLLECTION
          </h1>
          <p className="mt-4 max-w-xl font-inter text-base text-black/60 md:text-lg">
            Switch your style. Discover our fully modular lineup engineered for performance, style, and sustainability.
          </p>
        </motion.div>

        {/* Shoes Collection */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-inter text-4xl tracking-[0.05em] text-black/90 md:text-5xl">
              CARPE DIEM
            </h2>
            <div className="h-[1px] flex-1 bg-black/10" />
            <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Series 01</span>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SHOES.map((item, index) => (
              <PlaceholderCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Soles Collection */}
        <div>
          <h2 className="mb-8 font-inter text-3xl tracking-wide text-black/90 md:text-4xl">
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
