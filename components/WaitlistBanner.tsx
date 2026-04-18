"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const WaitlistBanner = () => {
  const text = "Change your style, Join waitlist now";
  const { scrollY } = useScroll();
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      // Offset matches Navbar safeThreshold
      setThreshold(window.innerHeight * 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeThreshold = threshold || 4000;
  const shrinkDistance = 400;

  // Animate banner sliding up out of view
  const topRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [0, -50] // Move up slightly more than its height (approx 44px)
  );
  const top = useMotionTemplate`${topRaw}px`;

  // Fade out as it slides
  const opacity = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [1, 0]
  );
  
  return (
    <motion.div 
      style={{ top, opacity }}
      className="fixed left-0 w-full bg-[#0350F0] py-2.5 overflow-hidden z-[10001]"
    >
      <div className="flex animate-marquee w-max select-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <p className="font-bebas text-lg md:text-xl text-white whitespace-nowrap tracking-[0.1em] uppercase">
              {text}
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WaitlistBanner;
