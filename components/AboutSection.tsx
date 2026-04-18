"use client";

import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".about-text > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });

    gsap.from(".about-badge", {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });
  }, { scope: container });

  return (
    <section
      id="about"
      ref={container}
      className="border-t border-black/10 bg-[#FFFFFF] px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="about-text">
            <p className="font-inter text-xs uppercase tracking-widest text-[#0350F0]">
              OUR STORY
            </p>
            <h2 className="mt-4 font-bebas text-4xl tracking-wide text-black/90 md:text-5xl uppercase">
              Born From Frustration.
            </h2>
            <div className="mt-6 space-y-4 font-inter text-sm leading-relaxed text-black/70">
              <p className="italic text-black/80 border-l-2 border-[#0350F0] pl-4 py-1">
                "Why do we throw away an entire shoe when only the sole wears out?"
              </p>
              <p>
                As a Materials Science & Engineering student at IIT Kanpur, Founder Harsh Maheshwari watched perfectly good uppers, the fabric, stitching, and fit built up over months, get discarded simply because the sole gave out.
              </p>
              <p>
                The frustration wasn't just personal, it was a systems failure. Billions of shoes enter landfills every year, most structurally sound except for one worn-out part. SCHAULT is the answer: a shoe engineered from day one to be taken apart and put back together, effortlessly, by you.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-block font-inter text-sm font-medium text-[#0350F0] transition-opacity duration-200 hover:opacity-80"
            >
              Read the full story →
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="about-badge w-full max-w-sm border border-black/10 bg-white p-8">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#0350F0]" />
                <span className="font-inter text-xs font-medium uppercase tracking-widest text-black/70">
                  Patent Published
                </span>
              </div>
              <p className="mt-2 font-inter text-sm text-black/60">
                Intellectual Property India
              </p>
              <div className="mt-6 flex h-12 w-12 items-center justify-center rounded border border-black/10 bg-black/5 font-inter text-xs text-black/50">
                IP
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
