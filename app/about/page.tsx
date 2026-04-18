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
    gsap.from(".about-hero-animate", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    });

    // Stats divider
    gsap.from(".about-divider > *", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-divider",
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

    // Innovation section
    gsap.from(".about-innovation > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-innovation",
        start: "top 80%",
      },
    });

    // Longevity section
    gsap.from(".about-longevity-top > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-longevity-top",
        start: "top 80%",
      },
    });

    gsap.from(".longevity-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".longevity-cards",
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
      <main ref={container} className="bg-white min-h-screen">

        {/* ─── HERO SECTION (Split) ─── */}
        <div className="about-hero min-h-[600px] flex flex-col lg:flex-row border-b border-black/5">
          
          {/* Left Side — Blue background with Image */}
          <div className="w-full lg:w-1/2 bg-[#052ca8] flex items-start justify-center p-8 sm:p-12 lg:p-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="about-hero-animate relative w-full max-w-[540px] aspect-[4/5] group transition-transform duration-500">
              <Image
                src="/images/shoe-image-for-about-us-section.jpeg"
                alt="Schault Modular Footwear"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side — White background with Text content */}
          <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 md:py-24">
            <div className="max-w-[540px]">
              {/* Breadcrumb */}
              <div className="about-hero-animate flex items-center gap-2 font-inter text-[10px] text-black/50 mb-10 uppercase tracking-widest">
                <Link href="/" className="hover:text-black/90 transition-colors">Home</Link>
                <span>&gt;</span>
                <span className="text-black/90 font-medium tracking-normal">About Us</span>
              </div>

              {/* Eyebrow */}
              <div className="about-hero-animate flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-[#052ca8]" />
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-[#052ca8]">The Mission</span>
              </div>

              {/* Headline */}
              <h1 className="about-hero-animate font-bebas text-5xl sm:text-6xl md:text-[80px] lg:text-[90px] text-black/90 leading-[0.95] tracking-wide mb-8 uppercase">
                Rethinking<br />
                <span className="italic text-[#052ca8]">Footwear</span><br />
                Entirely.
              </h1>

              {/* Subline */}
              <p className="about-hero-animate font-inter text-lg text-black/60 leading-relaxed">
                For centuries, a broken sole meant a discarded shoe. We asked a different question: what if the shoe never had to end? SCHAULT was built on the belief that great footwear should be modular, repairable, and built to last a lifetime.
              </p>
            </div>
          </div>
        </div>


        {/* ─── STATS DIVIDER ─── */}
        <div className="about-divider border-y border-black/10 px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-[1440px] mx-auto py-12 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="font-bebas text-4xl md:text-5xl text-black/90 tracking-wide">22<span className="text-[#0350F0]">B+</span></p>
              <p className="mt-1 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">Shoes discarded yearly</p>
            </div>
            <div className="hidden sm:block w-[1px] h-14 bg-black/10" />
            <div className="text-center">
              <p className="font-bebas text-4xl md:text-5xl text-[#0350F0] tracking-wide">1</p>
              <p className="mt-1 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">Patent Published</p>
            </div>
            <div className="hidden sm:block w-[1px] h-14 bg-black/10" />
            <div className="text-center">
              <p className="font-bebas text-4xl md:text-5xl text-black/90 tracking-wide"><span className="text-[#0350F0]">0</span></p>
              <p className="mt-1 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">Tools needed to swap soles</p>
            </div>
            <div className="hidden sm:block w-[1px] h-14 bg-black/10" />
            <div className="text-center">
              <p className="font-bebas text-3xl md:text-4xl text-black/90 tracking-wide leading-tight">PU Casted</p>
              <p className="mt-1 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">Sole for flexibility &amp; durability</p>
            </div>
          </div>
        </div>


        {/* ─── ORIGIN SECTION ─── */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Origin Image */}
            <div className="about-story-col relative">
              <div className="aspect-[4/5] w-full relative overflow-hidden bg-black/5">
                <Image
                  src="/images/broken-shoe-image.webp"
                  alt="A broken shoe illustrating the frustration that led to Schault"
                  fill
                  className="object-cover grayscale-[15%]"
                />
              </div>
              {/* Red accent frame */}
              <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-[#0350F0] -z-10" />
            </div>

            {/* Origin Text */}
            <div className="about-story-col">
              <p className="font-inter text-xs uppercase tracking-widest text-[#0350F0] mb-4">The Origin</p>
              <h2 className="font-bebas text-[40px] md:text-[56px] leading-none mb-6 text-black/90 tracking-wide">
                Born From<br />
                <span className="italic text-[#0350F0]">Frustration.</span>
              </h2>

              {/* Blockquote */}
              <blockquote className="border-l-[3px] border-[#0350F0] pl-5 mb-8">
                <p className="font-inter text-lg md:text-xl italic text-black/80 leading-relaxed">
                  &ldquo;Why do we throw away an entire shoe when only the sole wears out?&rdquo;
                </p>
              </blockquote>

              <div className="space-y-5 font-inter text-[15px] text-black/65 leading-[1.85]">
                <p>
                  It started with a worn-out pair of shoes and a question that wouldn&apos;t go away. As a Materials Science & Engineering student at IIT Kanpur, Harsh Maheshwari watched perfectly good uppers, the fabric, the stitching, the fit built up over months, get discarded simply because the sole gave out.
                </p>
                <p>
                  The traditional fix meant a trip to the cobbler, waiting, hoping. Often, it meant just buying new. The frustration wasn&apos;t just personal, it was a systems failure. Billions of shoes enter landfills every year, most of them structurally sound except for one worn-out component. SCHAULT was the answer.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* ─── INNOVATION SECTION (Dark) ─── */}
        <div className="about-innovation bg-black text-white px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Innovation Text */}
            <div>
              <p className="font-inter text-xs uppercase tracking-widest text-[#0350F0] mb-4">The Innovation</p>
              <h2 className="font-bebas text-[40px] md:text-[56px] leading-none mb-6 text-white tracking-wide">
                Patented<br />
                <span className="italic text-[#0350F0]">Snap-Fit</span><br />
                System.
              </h2>
              <div className="space-y-5 font-inter text-[15px] text-white/65 leading-[1.85] mb-10">
                <p>
                  At the core of SCHAULT is a deceptively simple mechanism, a precision snap-fit interface between upper and sole that requires no tools, no adhesive, and no expertise. Press down to lock. Pull to release.
                </p>
                <p>
                  The connector elements on the synthetic leather upper engage directly with cavities machined into the polyurethane sole, creating a secure bond strong enough to withstand rigorous daily use. The optimised CAD design, refined through real-world casting and 3D printing iterations, ensures dimensional precision.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-5">
                {[
                  { title: "Tool-Free Assembly", desc: "Swap soles bare-handed in under 10 seconds." },
                  { title: "PU Casted Sole", desc: "Flexibility and durability for everyday use." },
                  { title: "Traction Spikes", desc: "Removable grip system for the upper unit." },
                  { title: "IP Protected", desc: "Federally protected mechanical interlocking mechanism." },
                ].map((f) => (
                  <div key={f.title} className="border-t-2 border-white/15 pt-3">
                    <p className="font-inter text-xs font-bold uppercase tracking-widest text-[#0350F0] mb-1">{f.title}</p>
                    <p className="font-inter text-sm text-white/50 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Innovation Image */}
            <div className="relative">
              <div className="aspect-[4/5] w-full relative overflow-hidden">
                <Image
                  src="/images/fullshoe.webp"
                  alt="SCHAULT modular shoe with snap-fit system"
                  fill
                  className="object-cover grayscale-[30%] contrast-[1.1]"
                />
              </div>
              <div className="absolute top-6 left-6 bg-[#0350F0] text-white font-inter text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2.5">
                Patent Published
              </div>
            </div>
          </div>
        </div>


        {/* ─── LONGEVITY SECTION ─── */}
        <div className="bg-[#F5F5F5]">

          {/* Top text */}
          <div className="about-longevity-top px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-12">
            <div className="max-w-[900px]">
              <p className="font-inter text-xs uppercase tracking-widest text-[#0350F0] mb-4">The Philosophy</p>
              <h2 className="font-bebas text-[40px] md:text-[68px] leading-[1.05] mb-7 text-black/90 tracking-wide">
                Built for <span className="italic text-[#0350F0]">Longevity.</span><br />
                Engineered for Change.
              </h2>
              <p className="font-inter text-lg text-black/55 leading-[1.8] max-w-xl">
                A shoe that lasts isn&apos;t just better for your wallet, it&apos;s better for the planet. SCHAULT is engineered with the entire lifecycle of the product in mind.
              </p>
            </div>
          </div>

          {/* Longevity Cards */}
          <div className="longevity-cards grid grid-cols-1 sm:grid-cols-3 border-t border-black/10">
            {[
              { num: "01", title: "Reduce Waste", desc: "Replace only what's worn. Keep everything else." },
              { num: "02", title: "Improve Hygiene", desc: "Detachable soles mean fully washable footwear systems." },
              { num: "03", title: "Personalise", desc: "Mix uppers and soles for style, terrain, or occasion." },
            ].map((card) => (
              <div key={card.num} className="longevity-card p-8 md:p-10 border-l border-black/10 first:border-l-0 group hover:bg-white transition-colors duration-300">
                <p className="font-bebas text-5xl text-[#0350F0] mb-3 tracking-wide">{card.num}</p>
                <p className="font-inter text-sm font-bold uppercase tracking-[0.06em] text-black/90 mb-2">{card.title}</p>
                <p className="font-inter text-sm text-black/50 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Dark quote box */}
          <div className="bg-black px-4 sm:px-6 md:px-12 lg:px-20 py-12">
            <blockquote className="max-w-[1440px] mx-auto">
              <p className="font-inter text-lg md:text-xl italic text-white/90 leading-relaxed">
                &ldquo;The most sustainable shoe is the one you <span className="text-[#0350F0]">never have to replace.</span>&rdquo;
              </p>
            </blockquote>
          </div>
        </div>


        {/* ─── PATENT CALLOUT ─── */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 border-b border-black/10">
          <div className="max-w-[1440px] mx-auto">
            <div className="border border-black/10 bg-black/[0.03] p-6 md:p-8 flex items-start gap-6 hover:border-[#0350F0] transition-colors group max-w-2xl">
              <div className="h-12 w-12 shrink-0 border border-black/20 rounded-full flex items-center justify-center bg-white group-hover:bg-[#0350F0] group-hover:border-transparent group-hover:text-white transition-colors font-bebas text-lg">
                IP
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-[#0350F0]" />
                  <span className="font-inter text-xs font-bold uppercase tracking-widest text-black/90">Patent Published</span>
                </div>
                <p className="font-inter text-sm text-black/60">
                  Recognized under Intellectual Property India. Our mechanical interlocking mechanism is federally protected for its unique, glue-less assembly standard.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* ─── TEAM SECTION ─── */}
        <TeamSection />


        {/* ─── CTA SECTION ─── */}
        <div className="about-cta text-center bg-black text-white p-16 md:p-24 relative overflow-hidden group">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0350F0] rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />

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

      </main>
      <Footer />
    </>
  );
}