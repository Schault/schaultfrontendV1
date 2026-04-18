"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function EveryLayerSection() {
  return (
    <section className="bg-white px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <span className="font-inter text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
          The Schault System
        </span>

        <h2 className="mt-6 font-bebas text-4xl tracking-wide text-black md:text-6xl lg:text-7xl">
          Every Layer. Perfected.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl font-inter text-base leading-relaxed text-black/70 md:text-lg">
          22 billion shoes are discarded every year. We discard 100% of a shoe
          even when only 20-30% is damaged. SCHAULT fixes that.
        </p>

        <Link
          href="#shop"
          className="mt-10 inline-block border-2 border-[#1E3A8A] bg-white px-10 py-4 font-inter text-sm font-medium text-[#1E3A8A] transition-colors duration-300 hover:bg-[#1E3A8A] hover:text-white"
        >
          SHOP THE SYSTEM
        </Link>
      </motion.div>
    </section>
  );
}
