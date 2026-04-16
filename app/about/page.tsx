"use client";

import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutPage() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Hero Section animation
    gsap.from(".about-hero > *", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Image Placeholder 1
    gsap.from(".about-hero-img", {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-hero-img",
        start: "top 85%",
      },
    });

    // The Story & Origin grid
    gsap.from(".about-story-col", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-story-col",
        start: "top 80%",
      },
    });

    // Image Placeholder 2 & Mission Statement
    gsap.from(".about-mission-grid > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-mission-grid",
        start: "top 80%",
      },
    });

    // Mission Stats
    gsap.from(".about-stats > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-stats",
        start: "top 85%",
      },
    });

    // Team Founder
    gsap.from(".team-founder > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".team-founder",
        start: "top 85%",
      },
    });

    // Team Mentors
    gsap.from(".team-mentors > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".team-mentors",
        start: "top 85%",
      },
    });

    // Team Grid
    gsap.from(".team-grid > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".team-grid",
        start: "top 85%",
      },
    });

    // Join Us CTA
    gsap.from(".about-cta > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-cta",
        start: "top 85%",
      },
    });
  }, { scope: container });

  return (
    <>
      <main ref={container} className="bg-white min-h-screen pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-inter text-[10px] text-black/50 mb-12 uppercase tracking-widest">
            <Link href="/" className="hover:text-black/90 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-black/90 font-medium">About Us</span>
          </div>

          {/* Hero Section */}
          <div className="about-hero border-b border-black/10 pb-16 mb-16">
            <h1 className="font-bebas text-5xl sm:text-6xl md:text-[80px] lg:text-[96px] text-black/90 leading-[0.9] tracking-wide mb-6 uppercase">
              RETHINKING<br />
              FOOTWEAR.
            </h1>
            <p className="font-inter text-lg text-black/60 max-w-2xl leading-relaxed">
              We are Schault. A materials-science driven company dedicated to building the world's most modular, sustainable, and functional footwear system. Built from discomfort. Designed for everyone.
            </p>
          </div>


          {/* The Story & Origin grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-32">
            <div className="about-story-col">
              <p className="font-inter text-xs uppercase tracking-widest text-[#CC0000] mb-4">The Origin</p>
              <h2 className="font-bebas text-[40px] leading-none mb-6 text-black/90 tracking-wide">
                BORN FROM FRUSTRATION.
              </h2>
              <div className="space-y-6 font-inter text-sm text-black/70 leading-relaxed">
                <p>
                  SCHAULT was born from a simple frustration,why throw away an entire shoe when only one part is worn out? Founder Harsh Maheshwari, a Materials Science & Engineering student at IIT Kanpur, spent two years prototyping a solution.
                </p>
                <p>
                  We saw that the footwear industry was fundamentally flawed. Shoes were built with toxic glues, making them impossible to repair, recycle, or upgrade. If the sole wore out, the perfectly fine upper went to a landfill.
                </p>
              </div>
            </div>
            <div className="about-story-col">
              <p className="font-inter text-xs uppercase tracking-widest text-[#CC0000] mb-4">The Innovation</p>
              <h2 className="font-bebas text-[40px] leading-none mb-6 text-black/90 tracking-wide">
                PATENTED SNAP-FIT SYSTEM.
              </h2>
              <div className="space-y-6 font-inter text-sm text-black/70 leading-relaxed">
                <p>
                  The result is a patented modular footwear system that lets you replace parts, not the entire shoe. This drastically reduces waste, saves you money, and hands the power of customization back to you.
                </p>
                <p>
                  Our unique snapping nodes and receiver cavities are meticulously engineered using advanced polymers. They guarantee a secure fit during high-impact movement while allowing simple detachment when the time comes to swap.
                </p>
              </div>

              {/* Patent Callout */}
              <div className="mt-10 border border-black/10 bg-black/5 p-6 md:p-8 flex items-start gap-6 hover:border-[#CC0000] transition-colors group">
                <div className="h-12 w-12 shrink-0 border border-black/20 rounded-full flex items-center justify-center bg-white group-hover:bg-[#CC0000] group-hover:border-transparent group-hover:text-white transition-colors font-bebas text-lg">
                  IP
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[#CC0000]" />
                    <span className="font-inter text-xs font-bold uppercase tracking-widest text-black/90">Patent Published</span>
                  </div>
                  <p className="font-inter text-sm text-black/60">
                    Recognized under Intellectual Property India. Our mechanical interlocking mechanism is federally protected for its unique, glue-less assembly standard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="about-mission-grid mb-32 max-w-3xl">
            <div>
              <h2 className="font-bebas text-[48px] leading-none mb-8 text-black/90 tracking-wide">
                BUILT FOR LONGEVITY. <br />
                ENGINEERED FOR CHANGE.
              </h2>
              <div className="space-y-6 font-inter text-sm text-black/70 leading-relaxed border-l-2 border-[#CC0000] pl-6">
                <p>
                  Traditional footwear forces you to compromise. You buy a style, wear out the tread, and trash it. We envisioned an ecosystem where your shoe styles evolve with your wardrobe, and worn-out components slide out for fresh replacements.
                </p>
                <p>
                  No cobblers. No toxic adhesives holding your life together. Just raw, mechanical efficiency.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Stats */}
          <div className="about-stats border-y border-black/10 py-16 mb-24 hidden md:block">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 divide-y sm:divide-y-0 sm:divide-x divide-black/10 text-center">
              <div className="pt-8 sm:pt-0">
                <h3 className="font-bebas text-6xl text-[#CC0000] mb-2 tracking-wide">0%</h3>
                <p className="font-inter text-xs text-black/60 uppercase tracking-widest font-medium">Toxic Glues Used</p>
              </div>
              <div className="pt-8 sm:pt-0">
                <h3 className="font-bebas text-6xl text-black/90 mb-2 tracking-wide">50%</h3>
                <p className="font-inter text-xs text-black/60 uppercase tracking-widest font-medium">Reduction in Waste</p>
              </div>
              <div className="pt-8 sm:pt-0">
                <h3 className="font-bebas text-6xl text-black/90 mb-2 tracking-wide">100%</h3>
                <p className="font-inter text-xs text-black/60 uppercase tracking-widest font-medium">Modular System</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <TeamSection />

          {/* Join Us CTA */}
          <div className="about-cta text-center bg-black text-white p-16 md:p-24 relative overflow-hidden group">
            {/* Background glow effect for brutalist modern touch */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#CC0000] rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-bebas text-[48px] md:text-[64px] tracking-wide mb-6">READY TO REBUILD?</h2>
              <p className="font-inter text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10">
                Join the movement to fundamentally shift how we consume and wear fashion.
                Interchangeable parts, endless possibilities.
              </p>
              <Link href="/shop" className="inline-block border border-white text-white font-bebas text-lg px-10 py-4 hover:bg-white hover:text-black transition-colors tracking-widest">
                EXPLORE THE SHOP
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
