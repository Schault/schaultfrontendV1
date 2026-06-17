"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Leaf, Sliders } from "lucide-react";

const SEQUENCE_PATH = "/sequence";
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_EXT = "jpg";

function getFramePath(i: number): string {
  return `${SEQUENCE_PATH}/${FRAME_PREFIX}${String(i + 1).padStart(3, "0")}.${FRAME_EXT}`;
}

const ANGLES = [
  { name: "Front", frame: 0 },
  { name: "Side", frame: 40 },
  { name: "Perspective", frame: 80 },
  { name: "Top", frame: 120 },
  { name: "Sole", frame: 160 },
  { name: "Back", frame: 200 },
];

export default function HeroMobile() {
  const [activeStep, setActiveStep] = useState(0);

  // Framer Motion entrance variants for smooth luxury staggered load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full bg-[#F6F6F4] pt-28 pb-6 flex flex-col justify-between px-6 md:px-12 select-none overflow-hidden">
      
      {/* Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex-1 flex flex-col justify-between"
      >
        {/* TEXT COLUMN: Left-aligned on mobile, Center-aligned on tablet (md breakpoint) */}
        <motion.div 
          variants={itemVariants}
          className="w-full text-left md:text-center md:items-center md:flex md:flex-col md:max-w-2xl md:mx-auto"
        >
          {/* Brand Heading */}
          <div className="space-y-1">
            <h1 
              style={{
                fontSize: "clamp(34px, 7vw, 56px)",
                fontWeight: 300,
                letterSpacing: "0.25em",
                lineHeight: 1.1,
              }}
              className="font-sans text-[#0A0A0A] font-light uppercase"
            >
              SCHAULT.
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#666666] font-medium pl-0.5 md:pl-0">
              Replace parts. Not the entire shoe.
            </p>
          </div>

          {/* Description */}
          <p className="mt-4 text-xs sm:text-sm text-[#666666] leading-relaxed max-w-[450px] md:mx-auto">
            SCHAULT sneakers are built for change.<br className="hidden xs:block" />
            Swap parts. Extend life. Express you.<br className="hidden xs:block" />
            Sustainable by design. Unique by choice.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3.5 justify-start md:justify-center">
            <Link href="/shop" className="block">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-[#0A0A0A] px-6 py-3.5 font-inter text-[10px] font-semibold uppercase tracking-widest text-[#FFFFFF] shadow-sm active:bg-black/80"
              >
                SHOP COLLECTION
              </motion.button>
            </Link>

            <Link href="/create-your-own-shoe" className="block">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-black/15 bg-[#FFFFFF] px-6 py-3.5 font-inter text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A] shadow-sm active:bg-[#F6F6F4]"
              >
                CREATE YOUR OWN
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* SHOE VISUALIZATION AREA: Centered floating sneaker with soft shadow */}
        <motion.div 
          variants={itemVariants}
          className="relative flex-1 flex flex-col justify-center items-center py-6 min-h-[300px] md:min-h-[360px]"
        >
          {/* Center-aligned Fixed Wrapper */}
          <div
            className="relative flex items-center justify-center w-full max-w-[310px] sm:max-w-[350px] md:max-w-[380px] aspect-square"
          >
            {/* Smooth transition between angle frames */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                src={getFramePath(ANGLES[activeStep].frame)}
                alt={`SCHAULT angle ${ANGLES[activeStep].name}`}
                className="w-full h-full object-contain mix-blend-multiply pointer-events-none"
              />
            </AnimatePresence>

            {/* Realistic soft shadow underneath */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-black/10 rounded-full blur-[12px] pointer-events-none"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* PRODUCT ANGLE SELECTOR AT BOTTOM: Horizontal touch slider */}
      <div className="w-full pt-2">
        <div className="flex items-center gap-3 overflow-x-auto w-full py-2 px-1 scrollbar-none justify-start md:justify-center select-none">
          {ANGLES.map((angle, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={angle.name}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2.5 bg-[#FFFFFF] p-2 rounded-xl cursor-pointer shadow-xs min-w-[115px] border transition-all duration-300 ${
                  isActive
                    ? "border-[#2457FF] ring-2 ring-[#2457FF]/10"
                    : "border-black/5 active:border-black/10"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#F6F6F4] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={getFramePath(angle.frame)}
                    alt={angle.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-inter text-[9px] font-bold text-[#0A0A0A] uppercase tracking-wider">
                    {angle.name}
                  </span>
                  <span className="font-inter text-[7px] text-[#9B9B9B] uppercase tracking-wide">
                    Angle {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
