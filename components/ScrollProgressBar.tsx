"use client";

import { useTransform, motion } from "framer-motion";
import { useShoeScroll } from "./ShoeScroll";

export default function ScrollProgressBar() {
  const { scrollProgress } = useShoeScroll();
  const width = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="absolute left-0 right-0 top-0 z-10 h-0.5 w-full bg-black/5"
      aria-hidden
    >
      <motion.div
        className="h-full bg-[#CC0000]"
        style={{ width }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
