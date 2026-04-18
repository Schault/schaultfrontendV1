"use client";

import { useTransform, motion } from "framer-motion";
import { useShoeScroll } from "./ShoeScroll";

export default function ScrollOverlays() {
  const { scrollProgress } = useShoeScroll();

  const headline1Opacity = useTransform(scrollProgress, [0, 0.08, 0.25], [1, 1, 0]);
  const headline2Opacity = useTransform(
    scrollProgress,
    [0.25, 0.35, 0.55, 0.65],
    [0, 1, 1, 0]
  );
  const headline3Opacity = useTransform(
    scrollProgress,
    [0.65, 0.75, 0.95, 1],
    [0, 1, 1, 0]
  );

  return (
    <>
      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center md:px-12"
        style={{ opacity: headline1Opacity }}
      >
        <h1 className="font-lejour text-[14vw] leading-none tracking-[0.17em] text-black md:text-7xl md:tracking-[0.2em] lg:text-8xl xl:text-9xl">
          SCHAULT.
        </h1>
        <p className="mt-4 max-w-md font-inter text-base text-black/70 md:text-lg lg:text-xl">
          Replace parts. Not the entire shoe.
        </p>
      </motion.div>

      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex items-center px-6 md:left-0 md:max-w-md md:px-12 lg:px-24"
        style={{ opacity: headline2Opacity }}
      >
        <div className="text-left">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl lg:text-5xl">
            Breathable Upper.
          </h2>
          <p className="mt-3 font-inter text-sm text-black/70 md:text-base lg:text-lg">
            Separates in seconds. Wash it, swap it, style it differently.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="scroll-overlay-text absolute inset-0 z-10 flex items-center px-6 md:right-0 md:left-auto md:max-w-md md:px-12 md:text-right lg:px-24"
        style={{ opacity: headline3Opacity }}
      >
        <div className="ml-auto text-left md:text-right">
          <h2 className="font-bebas text-3xl tracking-wide text-black md:text-4xl lg:text-5xl">
            Durable Grip Sole.
          </h2>
          <p className="mt-3 font-inter text-sm text-black/70 md:text-base lg:text-lg">
            PU-casted with customized tread. Built to last longer,
            independently.
          </p>
        </div>
      </motion.div>
    </>
  );
}
