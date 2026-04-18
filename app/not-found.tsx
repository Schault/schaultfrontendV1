"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function NotFound() {
  // Use framer-motion springs for smooth, responsive eye tracking
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // We bind a global window event listener to track the mouse position.
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1] relative to the center of the window
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Adjust these limits to control how far the pupil moves within the eye.
  const leftPupilLimit = 40; 
  const rightPupilLimit = 35;

  const moveLeftX = useTransform(mouseX, [-1, 1], [-leftPupilLimit, leftPupilLimit]);
  const moveLeftY = useTransform(mouseY, [-1, 1], [-leftPupilLimit, leftPupilLimit]);
  
  const moveRightX = useTransform(mouseX, [-1, 1], [-rightPupilLimit, rightPupilLimit]);
  const moveRightY = useTransform(mouseY, [-1, 1], [-rightPupilLimit, rightPupilLimit]);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-red-50 selection:bg-[#0350F0] selection:text-white">
      {/* Eyes Container */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-2 md:gap-4 mb-16 md:mb-24">
        
        {/* Left Eye - Slightly Larger */}
        <div className="relative flex h-[180px] w-[180px] md:h-[260px] md:w-[260px] items-center justify-center rounded-full bg-white shadow-sm border border-black/5">
          <motion.div
            style={{ x: moveLeftX, y: moveLeftY }}
            className="h-[80px] w-[80px] md:h-[110px] md:w-[110px] rounded-full bg-[#111111]"
          />
        </div>

        {/* Right Eye - Slightly Smaller & Positioned slightly lower/higher for quirkiness if desired, but we keep it clean */}
        <div className="relative flex h-[160px] w-[160px] md:h-[240px] md:w-[240px] items-center justify-center rounded-full bg-white shadow-sm border border-black/5 mt-0 md:-mt-8">
          <motion.div
            style={{ x: moveRightX, y: moveRightY }}
            className="h-[70px] w-[70px] md:h-[100px] md:w-[100px] rounded-full bg-[#111111]"
          />
        </div>

      </div>

      {/* Typography & CTA Container */}
      <div className="z-10 flex flex-col items-center gap-10 px-6 text-center">
        {/* We use inter font with lightweight and negative tracking to emulate a refined editorial feel, 
            avoiding default serif since the brand emphasizes Inter & Bebas Neue. */}
        <h1 className="font-inter text-4xl md:text-[3.5rem] font-light tracking-[-0.03em] text-black">
          404, Page Not Found.
        </h1>
        
        <Link
          href="/"
          className="group relative flex items-center justify-center overflow-hidden rounded-full bg-[#111111] px-8 py-3.5 font-inter text-sm md:text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#0350F0] hover:shadow-xl hover:shadow-[#0350F0]/20"
        >
          <span className="relative z-10">Please Take Me Home</span>
        </Link>
      </div>
    </main>
  );
}
