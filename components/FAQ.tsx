"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    q: "What makes SCHAULT modular?",
    a: "SCHAULT uses a patented snap-fit connector system where the upper and sole attach and detach without any tools. Each component can be replaced, cleaned, or swapped independently.",
  },
  {
    q: "How do I replace a part?",
    a: "Simply press the connector nodes on the upper into the matching cavities on the sole. It snaps in securely and releases with a simple press. No glue, no tools, no cobbler needed.",
  },
  {
    q: "Are the parts sold separately?",
    a: "Yes. You can buy the upper, midsole, and outsole individually or as a complete set. Mix and match styles as you like.",
  },
  {
    q: "Is SCHAULT sustainable?",
    a: "Our system enables 30–50% reduction in material waste per shoe lifecycle. The uppers and soles are compatible with biodegradable materials and we are working towards fully recyclable components.",
  },
  {
    q: "What sizes are available?",
    a: "SCHAULT is currently available in sizes UK 6–11 for men and UK 4–9 for women. More sizes coming soon.",
  },
  {
    q: "Where do you deliver?",
    a: "We currently deliver across India. International shipping is coming soon.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="border-t border-black/10 bg-[#FFFFFF] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
        <h2 className="font-bebas text-4xl tracking-wide text-black/90 md:text-5xl">
          FAQ
        </h2>
        <ul className="mt-12">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <li
                key={index}
                className="border-b border-black/10 last:border-b-0"
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors duration-200 hover:opacity-80"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-inter text-base font-medium text-black/90">
                    {item.q}
                  </span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[#CC0000] transition-transform duration-200"
                    aria-hidden
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl leading-none"
                    >
                      +
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 font-inter text-sm leading-relaxed text-black/60">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
