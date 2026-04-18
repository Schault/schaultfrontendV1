"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FeatureGrid: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".feature-card-wrapper", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="bg-[#FFFFFF] px-6 pt-24 pb-12 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        {/* Subtle Section Title */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-black/20" />
          <span className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
            The System
          </span>
          <div className="h-px w-8 bg-black/20" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="feature-card-wrapper">
            <div className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:border-black/10 hover:bg-white hover:shadow-xl hover:shadow-black/5">
              <div className="mb-6 h-1 w-12 bg-[#0350F0] transition-all duration-500 group-hover:w-20 group-hover:bg-black" aria-hidden />
              <h3 className="font-bebas text-2xl tracking-widest text-black/90">
                Hygiene & Comfort
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-black/60">
                Upper and sole separate for individual cleaning.
              </p>
            </div>
          </div>
          <div className="feature-card-wrapper">
            <div className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:border-black/10 hover:bg-white hover:shadow-xl hover:shadow-black/5">
              <div className="mb-6 h-1 w-12 bg-[#0350F0] transition-all duration-500 group-hover:w-20 group-hover:bg-black" aria-hidden />
              <h3 className="font-bebas text-2xl tracking-widest text-black/90">
                Cost Efficiency
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-black/60">
                Replace only the worn part, not the whole shoe.
              </p>
            </div>
          </div>
          <div className="feature-card-wrapper">
            <div className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:border-black/10 hover:bg-white hover:shadow-xl hover:shadow-black/5">
              <div className="mb-6 h-1 w-12 bg-[#0350F0] transition-all duration-500 group-hover:w-20 group-hover:bg-black" aria-hidden />
              <h3 className="font-bebas text-2xl tracking-widest text-black/90">
                Sustainability
              </h3>
              <p className="mt-4 font-inter text-sm leading-relaxed text-black/60">
                30–50% reduction in material waste per lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
