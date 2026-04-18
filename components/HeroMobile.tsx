"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroMobile() {
  const [videoVisible, setVideoVisible] = useState(true);
  const [imgSrc, setImgSrc] = useState("/images/mobile.png");

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <img
        src={imgSrc}
        onError={() => setImgSrc("/images/fullshoe.jpg")}
        alt="SCHAULT modular sneaker"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {videoVisible ? (
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={imgSrc}
          onError={() => setVideoVisible(false)}
          aria-hidden
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" />
        </video>
      ) : null}

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        className="absolute inset-x-0 top-0 z-10 flex flex-col px-5 pt-40 sm:pt-44"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="font-lejour text-[14vw] font-light leading-none tracking-[0.2em] text-white sm:text-6xl">
              SCHAULT
            </h1>
            <p className="font-inter text-base font-light tracking-wide text-white/80 sm:text-lg">
              Switch your style
            </p>
          </div>

          <div className="pt-4">
            <div className="h-px w-10 bg-white/30" aria-hidden />
            <div className="mt-4 space-y-1 font-inter text-sm font-light text-white/70 sm:text-base">
              <p>Modular Build</p>
              <p>Washable Upper</p>
              <p>Replaceable Sole</p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 font-inter text-sm font-light tracking-[0.18em] text-white/90 transition-opacity duration-300 hover:opacity-70"
            >
              <span className="relative pb-1">
                EXPLORE PRODUCT
                <span
                  className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-white/80 transition-transform duration-500 ease-out group-hover:scale-x-50"
                  aria-hidden
                />
              </span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
