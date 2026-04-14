"use client";

import { useTransform, motion } from "framer-motion";
import Link from "next/link";
import { useShoeScroll } from "./ShoeScroll";

export default function ScrollOverlays() {
  const { scrollProgress } = useShoeScroll();

  const headline1Opacity = useTransform(scrollProgress, [0, 0.08, 0.2], [1, 1, 0]);
  const headline2Opacity = useTransform(
    scrollProgress,
    [0.12, 0.2, 0.32, 0.42],
    [0, 1, 1, 0]
  );
  const headline3Opacity = useTransform(
    scrollProgress,
    [0.38, 0.46, 0.58, 0.68],
    [0, 1, 1, 0]
  );
  const headline4Opacity = useTransform(
    scrollProgress,
    [0.62, 0.7, 0.8, 0.88],
    [0, 1, 1, 0]
  );
  const headline5Opacity = useTransform(
    scrollProgress,
    [0.82, 0.9, 1],
    [0, 1, 1]
  );

  return (
    <>
      {/* 0% — Centered hero */}
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center md:px-12"
        style={{ opacity: headline1Opacity }}
      >
        <h1 className="font-bebas text-[12vw] tracking-[0.15em] text-black leading-none md:text-7xl lg:text-8xl md:tracking-[0.2em]">
          SCHAULT.
        </h1>
        <p className="mt-4 max-w-md font-inter text-base text-black/60 md:text-lg">
          Replace parts. Not the entire shoe.
        </p>
      </motion.div>

      {/* ~20% — Upper */}
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex items-center px-6 md:left-0 md:max-w-md md:px-12 lg:px-24"
        style={{ opacity: headline2Opacity }}
      >
        <div className="text-left">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl">
            Breathable Upper.
          </h2>
          <p className="mt-3 font-inter text-sm text-black/60 md:text-base">
            Separates in seconds. Wash it, swap it, style it differently.
          </p>
        </div>
      </motion.div>

      {/* ~45% — Midsole */}
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex items-center px-6 md:right-0 md:left-auto md:max-w-md md:px-12 md:text-right lg:px-24"
        style={{ opacity: headline3Opacity }}
      >
        <div className="ml-auto text-left md:text-right">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl">
            Precision Cushioning Midsole.
          </h2>
          <p className="mt-3 font-inter text-sm text-black/70 md:text-base">
            Engineered for grip and flexibility.
          </p>
        </div>
      </motion.div>

      {/* ~70% — Outsole */}
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex items-center px-6 md:left-0 md:max-w-md md:px-12 lg:px-24"
        style={{ opacity: headline4Opacity }}
      >
        <div className="text-left">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl">
            Ground-Grip Rubber Outsole.
          </h2>
          <p className="mt-3 font-inter text-sm text-black/60 md:text-base">
            PU-casted with customized tread. Built to last longer,
            independently.
          </p>
        </div>
      </motion.div>

      {/* ~90% — CTA: card background so text and button aren't overshadowed by shoe */}
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: headline5Opacity }}
      >
        <div className="w-full max-w-2xl rounded-none bg-white/95 px-6 py-10 shadow-none md:px-12 md:py-14">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl lg:text-5xl">
            Every Layer. Perfected.
          </h2>
          <p className="mt-4 max-w-xl font-inter text-sm leading-relaxed text-black/70 md:text-base">
            22 billion shoes are discarded every year. We discard 100% of a shoe
            even when only 20–30% is damaged. SCHAULT fixes that.
          </p>
          <Link
            href="#shop"
            className="mt-8 inline-block border-2 border-[#CC0000] bg-transparent px-8 py-3 font-inter text-sm font-medium text-[#CC0000] transition-colors duration-300 ease-in-out hover:bg-[#CC0000] hover:text-white"
          >
            SHOP
          </Link>
        </div>
      </motion.div>
    </>
  );
}
