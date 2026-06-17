"use client";

import { useTransform, motion } from "framer-motion";
import { useShoeScroll } from "./ShoeScroll";
import Link from "next/link";
import { RefreshCw, Leaf, Sliders } from "lucide-react";

export default function ScrollOverlays() {
  const { scrollProgress } = useShoeScroll();

  // Smoothly fade out the hero content as the user reaches the end of the scroll sequence
  const opacity = useTransform(scrollProgress, [0.85, 0.95], [1, 0]);
  const y = useTransform(scrollProgress, [0.85, 0.95], [0, -20]);

  // Framer Motion entrance variants for smooth luxury staggered load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom premium easeOut
      },
    },
  };

  return (
    <motion.div
      style={{ opacity, y }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col justify-center select-none"
    >
          {/* Brand/Product Heading */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 
              style={{
                fontSize: "clamp(38px, 3.8vw, 68px)",
                fontWeight: 300,
                letterSpacing: "0.25em",
                lineHeight: 1.1,
              }}
              className="font-sans text-[#0A0A0A] font-light uppercase"
            >
              SCHAULT.
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#666666] font-medium pl-1">
              Replace parts. Not the entire shoe.
            </p>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="mt-8 text-sm md:text-base text-[#666666] leading-relaxed max-w-[450px] font-normal pl-1"
          >
            SCHAULT sneakers are built for change.<br />
            Swap parts. Extend life. Express you.<br />
            Sustainable by design. Unique by choice.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4 pl-1"
          >
            <Link href="/shop" className="block">
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: "#2457FF", 
                  boxShadow: "0 10px 20px rgba(36, 87, 255, 0.15)" 
                }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-[#0A0A0A] px-8 py-4 font-inter text-xs font-semibold uppercase tracking-widest text-[#FFFFFF] transition-colors duration-300"
              >
                SHOP COLLECTION
              </motion.button>
            </Link>

            <Link href="/create-your-own-shoe" className="block">
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  borderColor: "#0A0A0A",
                  backgroundColor: "#0A0A0A",
                  color: "#FFFFFF"
                }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-black/20 bg-[#FFFFFF] px-8 py-4 font-inter text-xs font-semibold uppercase tracking-widest text-[#0A0A0A] transition-all duration-300"
              >
                CREATE YOUR OWN
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Highlights Grid */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 grid grid-cols-3 gap-6 pt-10 border-t border-[#0A0A0A]/10 max-w-[500px]"
          >
            {/* Feature 1 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F6F4] text-[#0A0A0A]">
                <RefreshCw size={14} className="stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-inter text-[11px] font-bold text-[#0A0A0A] uppercase tracking-wider">
                  Replaceable Parts
                </h4>
                <p className="font-inter text-[10px] text-[#666666] leading-snug">
                  Swap. Style. Repeat.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F6F4] text-[#0A0A0A]">
                <Leaf size={14} className="stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-inter text-[11px] font-bold text-[#0A0A0A] uppercase tracking-wider">
                  Sustainable
                </h4>
                <p className="font-inter text-[10px] text-[#666666] leading-snug">
                  Built to reduce waste.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6F6F4] text-[#0A0A0A]">
                <Sliders size={14} className="stroke-[1.5]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-inter text-[11px] font-bold text-[#0A0A0A] uppercase tracking-wider">
                  Made for You
                </h4>
                <p className="font-inter text-[10px] text-[#666666] leading-snug">
                  Customizable always.
                </p>
              </div>
            </div>
          </motion.div>
    </motion.div>
  );
}
