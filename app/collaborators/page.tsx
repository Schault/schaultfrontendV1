"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
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

    // MOU section animation
    gsap.from(".collab-mou", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".collab-mou",
        start: "top 80%",
      },
    });

    // Partner section animation
    gsap.from(".collab-partner", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".collab-partner",
        start: "top 85%",
      },
    });

    // Grid items animation
    gsap.from(".collab-grid-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".collab-grid",
        start: "top 95%",
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
            <span className="text-black/90 font-medium">Collaborators</span>
          </div>

          {/* Hero Section */}
          <div className="collab-hero border-b border-black/10 pb-16 mb-20">
            <h1 className="font-bebas text-5xl sm:text-6xl md:text-[80px] lg:text-[96px] text-black/90 leading-[0.9] tracking-wide mb-6 uppercase">
              OUR<br />
              COLLABORATORS.
            </h1>
            <p className="font-inter text-lg text-black/60 max-w-2xl leading-relaxed">
              We don't build in isolation. SCHAULT is supported by a network of world-class academic institutions, design pioneers, and sustainability leaders who share our vision for a modular future.
            </p>
          </div>

          {/* MOUs Section */}
          <div className="collab-mou mb-12">
            <h2 className="font-bebas text-[40px] sm:text-[48px] md:text-[64px] text-[#CC0000] text-center mb-16 uppercase tracking-wide">
              OUR MOUS
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
              <div className="w-full md:w-[45%]">
                <div className="aspect-[4/5] bg-black/5 relative w-full overflow-hidden">
                   {/* Placeholder, assuming the image is uploaded or will be manually swapped */}
                   <Image 
                     src="/images/harsh.jpg" 
                     alt="Harsh Maheshwari" 
                     fill 
                     className="object-cover"
                   />
                </div>
              </div>
              <div className="w-full md:w-[55%] text-left md:text-right">
                <h3 className="font-inter text-lg md:text-xl font-bold text-[#CC0000] mb-8">
                  Kapas Paduka (INDIA) × Harsh Maheshwari (IIT KANPUR)
                </h3>
                
                <div className="space-y-6 font-inter text-black/80 text-sm md:text-base leading-relaxed md:ml-auto md:max-w-xl">
                  <p>
                    <strong className="text-black/90 font-semibold">Harsh Maheshwari</strong> is a Materials Science & Engineering undergraduate at IIT Kanpur, Uttar Pradesh, INDIA, working at the intersection of engineering, sustainability, and everyday products.
                  </p>
                  <p>
                    Through academic research and on-ground prototyping, he developed a modular footwear system designed to reduce waste, improve hygiene, and extend product life. This work has been published and protected as a patented technology, ensuring the innovation is credible, original, and built for real-world impact.
                  </p>
                  <p>
                    Together with Kapas Paduka, this collaboration brings responsible design closer to conscious consumers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 pt-12 mb-4">
            <h2 className="font-bebas text-[40px] tracking-wide text-black/90 mb-8 uppercase">
              NETWORK
            </h2>
          </div>

          {/* Liberty Shoes Featured Section */}
          <div className="collab-partner border border-black/10 bg-[#F9F9F9] p-8 md:p-12 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[#CC0000] mb-4 font-bold">Manufacturing Partner</p>
                <h3 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-black/90 mb-6 tracking-wide leading-none">
                  LIBERTY SHOES
                </h3>
                <p className="font-inter text-sm md:text-base text-black/70 leading-relaxed">
                  Supported by Liberty Shoes, Schault is redefining footwear through modular innovation. 
                  With guidance from an established industry leader, we are building durable, customizable, 
                  and sustainable solutions that reduce waste and enhance user experience, shaping the 
                  future of how shoes are designed, used, and replaced.
                </p>
              </div>
              <div className="order-1 md:order-2 flex justify-center items-center h-48 md:h-64 border border-black/5 bg-white p-12">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/liberty-logo.webp" 
                    alt="Liberty Shoes Logo" 
                    fill 
                    className="object-contain transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Section */}
          <div className="collab-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
          </div>

          {/* Partner with us CTA */}
          <div className="collab-hero border-t border-black/10 pt-16 text-center">
            <h2 className="font-bebas text-[40px] sm:text-[48px] md:text-[64px] tracking-wide text-black/90 mb-6 uppercase">
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
