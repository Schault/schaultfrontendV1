"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const StatsSection: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".stat-box", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="bg-[#FFFFFF] px-6 pt-4 pb-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-[#FAFAFA] md:grid-cols-3">
          <div className="stat-box group flex flex-col items-center p-12 text-center transition-colors duration-500 hover:bg-white">
            <p className="font-bebas text-5xl tracking-wide text-[#0350F0] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              22B
            </p>
            <p className="mt-4 max-w-[200px] font-inter text-sm leading-relaxed text-black/60">
              Pairs discarded annually worldwide
            </p>
          </div>
          <div className="stat-box group flex flex-col items-center border-t border-black/10 p-12 text-center transition-colors duration-500 hover:bg-white md:border-t-0 md:border-l">
            <p className="font-bebas text-5xl tracking-wide text-[#0350F0] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              90–95%
            </p>
            <p className="mt-4 max-w-[200px] font-inter text-sm leading-relaxed text-black/60">
              End up in landfills
            </p>
          </div>
          <div className="stat-box group flex flex-col items-center border-t border-black/10 p-12 text-center transition-colors duration-500 hover:bg-white md:border-t-0 md:border-l">
            <p className="font-bebas text-5xl tracking-wide text-[#0350F0] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              1
            </p>
             <p className="mt-4 max-w-[200px] font-inter text-sm font-medium leading-relaxed text-black/80">
              Patent Published
            </p>
            <p className="mt-1 font-inter text-xs text-black/50">
              Intellectual Property India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
