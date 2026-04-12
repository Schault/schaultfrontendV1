"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COLLABORATORS = [
  { name: "IIT KANPUR", description: "Incubation & Technical Support", category: "Academic" },
  { name: "NIFT", description: "Design & Style Collaboration", category: "Design" },
  { name: "RECYCLE INDIA", description: "Sustainability & Logistics Partner", category: "Eco-System" },
  { name: "TECH TEXTILES", description: "Material Science Research", category: "Manufacturing" },
  { name: "FASHION FORWARD", description: "Media & Brand Partner", category: "Media" },
  { name: "GREEN VENTURES", description: "Sustainability Advisor", category: "Advisory" },
];

export default function CollaboratorsPage() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Hero Section animation
    gsap.from(".collab-hero > *", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Grid items animation
    gsap.from(".collab-grid-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".collab-grid",
        start: "top 80%",
      },
    });
  }, { scope: container });

  return (
    <>
      <main ref={container} className="bg-white min-h-screen pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-inter text-[10px] text-black/50 mb-12 uppercase tracking-widest">
            <Link href="/" className="hover:text-black/90 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-black/90 font-medium">Collaborators</span>
          </div>

          {/* Hero Section */}
          <div className="collab-hero border-b border-black/10 pb-16 mb-16">
            <h1 className="font-bebas text-[64px] md:text-[96px] text-black/90 leading-[0.9] tracking-wide mb-6 uppercase">
              OUR<br />
              COLLABORATORS.
            </h1>
            <p className="font-inter text-lg text-black/60 max-w-2xl leading-relaxed">
              We don't build in isolation. SCHAULT is supported by a network of world-class academic institutions, design pioneers, and sustainability leaders who share our vision for a modular future.
            </p>
          </div>

          {/* Grid Section */}
          <div className="collab-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {COLLABORATORS.map((collab, index) => (
              <div 
                key={index} 
                className="collab-grid-item border border-black/10 p-8 hover:border-[#CC0000] transition-all duration-300 group bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 flex justify-between items-start">
                   <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/20 group-hover:bg-[#CC0000]/10 group-hover:text-[#CC0000] transition-colors">
                      <span className="font-bebas text-xl">{collab.name.charAt(0)}</span>
                   </div>
                   <span className="font-inter text-[10px] uppercase tracking-widest text-black/40 border border-black/10 px-3 py-1 rounded-full group-hover:border-[#CC0000]/20 group-hover:text-[#CC0000]/60 transition-colors">
                      {collab.category}
                   </span>
                </div>
                <h3 className="font-bebas text-3xl text-black/90 mb-2 group-hover:text-[#CC0000] transition-colors tracking-wide">
                  {collab.name}
                </h3>
                <p className="font-inter text-sm text-black/50 leading-relaxed group-hover:text-black/70 transition-colors">
                  {collab.description}
                </p>
              </div>
            ))}
          </div>

          {/* Partner with us CTA */}
          <div className="collab-hero border-t border-black/10 pt-24 text-center">
            <h2 className="font-bebas text-[48px] md:text-[64px] tracking-wide text-black/90 mb-6 uppercase">
              WANT TO COLLABORATE?
            </h2>
            <p className="font-inter text-black/60 text-sm md:text-base max-w-xl mx-auto mb-10">
              We are always looking for partners in material science, distribution, and sustainable design. 
              Let's rebuild the industry together.
            </p>
            <a 
              href="mailto:partners@schault.com" 
              className="inline-block bg-black text-white font-bebas text-lg px-12 py-5 hover:bg-[#CC0000] transition-colors tracking-widest"
            >
              GET IN TOUCH
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
