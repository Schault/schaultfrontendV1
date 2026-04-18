"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { 
  Recycle, 
  Globe, 
  Leaf, 
  Sprout, 
  Factory, 
  ShieldCheck, 
  Globe2, 
  Microscope, 
  Store, 
  Warehouse, 
  Briefcase, 
  Package, 
  Settings, 
  Award, 
  Footprints 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── COLLABORATOR DATA ─── */
const COLLABORATORS = [
  {
    num: "01",
    name: "Kapas Paduka",
    tagline: "India's Most Biodegradable Footwear Brand · Agra",
    category: "Sustainability",
    description: [
      "Kapas Paduka is pioneering the biodegradable footwear movement in India, crafting sneakers where every single component, from organic cotton uppers and cork-based leather to jute insoles and natural rubber outsoles, is designed to return safely to the earth. Their flagship Earthform® line is among the world's first sneakers with a jute-based insole, packaged in zero-waste bamboo wood boxes.",
      "For every product sold, Kapas Paduka plants 8 trees, a commitment that goes far beyond the product itself. GRS-certified, cruelty-free, and guided by the belief that fashion and ecology must coexist, they are the perfect sustainability counterpart to SCHAULT's modular, long-life design ethos.",
    ],
    whyTitle: "Aligned on Every Value That Matters.",
    whyIntro: "The collaboration with Kapas Paduka is a natural alignment, two brands asking the same question from different angles: how do we make footwear that doesn't cost the earth?",
    whyCards: [
      { icon: Recycle, title: "Reducing Material Waste", desc: "Biodegradable construction means zero landfill contribution. SCHAULT's modular soles mean fewer full-shoe discards." },
      { icon: Globe, title: "Carbon Footprint", desc: "GRS-certified recycled materials and organic sourcing keep carbon output minimal, aligned with SCHAULT's sustainable manufacturing goals." },
      { icon: Leaf, title: "Soil Pollution", desc: "Traditional synthetic shoes leach microplastics into the soil for decades. Kapas Paduka's natural decomposition ethos directly counters this." },
      { icon: Sprout, title: "Sustainability Vision", desc: "8 trees planted per sale. Bamboo packaging. Bio-based foam. Holistic thinking that complements SCHAULT's design for longevity philosophy." },
    ],
    website: "https://kapaspaduka.com",
    instagram: "https://www.instagram.com/kapaspaduka",
    image: "/images/kpas-pduka-logo.webp",
  },
  {
    num: "02",
    name: "Expose Trendze",
    tagline: "Premium Leather Footwear Manufacturer · Agra, Since 2011",
    category: "Manufacturing",
    description: [
      "Founded in 2011 and headquartered in Agra, the leather capital of India, Expose Trendze is a dynamic force in handcrafted, hi-fashion leather footwear. For over a decade, they have delivered world-class upper manufacturing services to export markets across Europe, with a particularly strong footprint in Germany, Portugal, and Italy.",
      "With certified PCP/AZO free leather, deep tannery affiliations, and a track record supplying brands like Maddox, Fuchs, Haus Hubert, Alpin de Lux, and Jordan Footwear, Expose Trendze brings the manufacturing muscle and global credibility that SCHAULT needs to scale from prototype to production.",
    ],
    whyTitle: "The Manufacturing Backbone We Need.",
    whyIntro: "SCHAULT's snap-fit upper unit demands precision manufacturing. Expose Trendze's 15+ year pedigree, global client roster, and certified leather supply chain make them the natural production partner.",
    whyCards: [
      { icon: Factory, title: "Established Since 2011", desc: "Over a decade of continuous operation building trust with European buyers, institutional knowledge that de-risks SCHAULT's manufacturing at scale." },
      { icon: ShieldCheck, title: "Certified Materials", desc: "PCP/AZO free leather certification is non-negotiable for European markets. Expose Trendze already operates to these standards." },
      { icon: Globe2, title: "Global Export Network", desc: "Active connections in Germany, Portugal and Italy give SCHAULT a direct path into premium European footwear retail." },
      { icon: Microscope, title: "Sample-First Process", desc: "Free sampling before full production, a model that perfectly mirrors SCHAULT's own prototype-first engineering philosophy." },
    ],
    website: "https://exposetrendze.in",
    instagram: "https://www.instagram.com/exposetrendze",
    image: "/images/logo-expose-tran.png",
  },
];

const SUPPORTED_BY = {
  name: "Liberty Shoes",
  tagline: "Large-Scale Footwear Leader · India, Since 1954",
  category: "Retail & Scale",
  description: [
    "Liberty Shoes Limited, one of India's largest and most recognised footwear companies, has been at the forefront of the Indian footwear industry for over seven decades. With a manufacturing capacity spanning multiple state of the art facilities and a retail presence across thousands of touchpoints nationwide, Liberty brings unmatched distribution expertise and consumer trust.",
    "As SCHAULT scales from prototype to market, Liberty's established infrastructure, supply chain mastery, and brand visibility across India position them as a key supporter for reaching millions of conscious consumers who are ready for modular, sustainable footwear.",
  ],
  whyTitle: "Scale Meets Innovation.",
  whyIntro: "Liberty's manufacturing scale and distribution network empower SCHAULT's engineering innovation — together, bringing modular footwear from the lab to every Indian household.",
  whyCards: [
    { icon: Store, title: "Pan-India Retail Reach", desc: "Thousands of retail touchpoints and online presence ensure SCHAULT's modular system reaches consumers everywhere." },
    { icon: Warehouse, title: "Manufacturing at Scale", desc: "Decades of industrial manufacturing expertise to help SCHAULT transition from artisanal prototyping to mass production." },
    { icon: Briefcase, title: "Brand Trust", desc: "Over 70 years of consumer trust makes Liberty a credible launchpad for introducing new footwear technology to mainstream India." },
    { icon: Package, title: "Supply Chain Mastery", desc: "Vertically integrated operations from raw material sourcing to final delivery — infrastructure that SCHAULT can leverage from day one." },
  ],
  website: "https://www.libertyshoesonline.com/",
  instagram: "https://www.instagram.com/libertyshoesltd/",
  image: "/images/liberty-logo.webp",
};

export default function CollaboratorsPage() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Hero Section animation
    gsap.from(".collab-hero-text > *", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(".hero-pill-item", {
      x: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.5,
    });


    // Each collaborator section
    document.querySelectorAll(".collab-partner").forEach((el) => {
      gsap.from(el.querySelectorAll(".collab-animate"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    });

    // Joint vision
    gsap.from(".joint-vision > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".joint-vision",
        start: "top 80%",
      },
    });

    // CTA
    gsap.from(".collab-cta > *", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".collab-cta",
        start: "top 85%",
      },
    });
  }, { scope: container });

  return (
    <>
      <main ref={container} className="bg-white min-h-screen">

        {/* ─── HERO SECTION ─── */}
        <div className="pt-20 md:pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">

            {/* Left — Text */}
            <div className="collab-hero-text px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 flex flex-col justify-center">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 font-inter text-[10px] text-black/50 mb-8 uppercase tracking-widest">
                <Link href="/" className="hover:text-black/90 transition-colors">Home</Link>
                <span>&gt;</span>
                <span className="text-black/90 font-medium">Collaborators</span>
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-[#0350F0]" />
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-[#0350F0]">Our Partners</span>
              </div>

              {/* Headline */}
              <h1 className="font-bebas text-5xl sm:text-6xl md:text-[72px] lg:text-[80px] text-black/90 leading-[1.02] tracking-wide mb-7 uppercase">
                Built Together.<br />
                <span className="italic text-[#0350F0]">Better</span><br />
                Together.
              </h1>

              {/* Sub */}
              <p className="font-inter text-[15px] text-black/55 max-w-[440px] leading-[1.8]">
                SCHAULT doesn&apos;t build the future of footwear alone. We align with partners who share our conviction, that great shoes should be responsibly made, thoughtfully designed, and built to last.
              </p>
            </div>

            {/* Right — Dark panel with pills */}
            <div className="bg-black relative overflow-hidden flex flex-col items-start justify-end px-8 sm:px-12 py-10 md:py-14 gap-2.5">
              {/* Ghost text */}
              <span className="absolute -top-3 -right-5 font-bebas text-[130px] text-white/[0.03] leading-none pointer-events-none select-none tracking-tight">
                COLLAB
              </span>

              {[
                { label: "Sustainability First", green: true },
                { label: "World-Class Manufacturing", green: false },
                { label: "Certified Materials", green: false },
                { label: "Export-Grade Quality", green: true },
              ].map((pill) => (
                <div key={pill.label} className="hero-pill-item inline-flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.12] px-5 py-2.5 text-white font-inter text-[12px] font-semibold uppercase tracking-[0.14em]">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pill.green ? "bg-green-500" : "bg-[#0350F0]"}`} />
                  {pill.label}
                </div>
              ))}

              <p className="font-bebas text-[28px] text-white mt-5 leading-snug tracking-wide">
                2 Strategic <span className="text-[#0350F0]">Collaborators</span><br />
                & Supported By <span className="text-[#0350F0]">Liberty Shoes.</span>
              </p>
            </div>
          </div>
        </div>


        {/* ─── PHILOSOPHY BAR ─── */}
        <div className="philosophy-bar bg-[#0350F0] py-5 overflow-hidden">
          <div className="flex animate-[marquee_25s_linear_infinite] w-max">
            {[...Array(2)].map((_, dupeIdx) => (
              <div key={dupeIdx} className="flex items-center gap-4">
                {["Sustainability", "Biodegradable Materials", "Carbon Footprint Reduction", "Zero Soil Pollution", "World-Class Craftsmanship", "Global Export Standards", "Certified Leather", "Ethical Production"].map((item, i) => (
                  <React.Fragment key={`${dupeIdx}-${item}`}>
                    {(i > 0 || dupeIdx > 0) && <span className="w-[5px] h-[5px] rounded-full bg-white/50 flex-shrink-0" />}
                    <p className="font-inter text-[13px] font-bold uppercase tracking-[0.15em] text-white whitespace-nowrap">{item}</p>
                  </React.Fragment>
                ))}
                <span className="w-[5px] h-[5px] rounded-full bg-white/50 flex-shrink-0" />
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>


        {/* ─── COLLABORATOR SECTIONS ─── */}
        {COLLABORATORS.map((collab, idx) => (
          <section key={collab.num} className="collab-partner border-b border-black/10">

            {/* Partner Header */}
            <div className={`grid grid-cols-1 md:grid-cols-2`}>

              {/* Image side */}
              <div className={`relative overflow-hidden min-h-[400px] md:min-h-[480px] group ${idx % 2 === 1 ? "md:order-1" : "md:order-2"} bg-[#F8F8F8] p-12 md:p-20`}>
                <Image
                  src={collab.image}
                  alt={`${collab.name} collaboration partner`}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute bottom-6 left-6 bg-white py-3 px-5 border-l-[3px] border-[#0350F0]">
                  <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Collaborator</p>
                  <p className="font-bebas text-xl text-black/90 tracking-wide">{collab.num}</p>
                </div>
              </div>

              {/* Text side */}
              <div className={`collab-animate px-6 sm:px-10 md:px-14 lg:px-16 py-14 md:py-20 flex flex-col justify-center ${idx % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0350F0] mb-3">
                  Collaborator {collab.num} · {collab.category}
                </p>
                <p className="font-bebas text-[90px] md:text-[100px] text-black/[0.07] leading-none -mb-3 tracking-tight">{collab.num}</p>
                <h2 className="collab-animate font-bebas text-[40px] sm:text-[48px] md:text-[54px] text-black/90 leading-[1.05] tracking-wide mb-2">
                  {collab.name.split(" ").map((word, wi) => (
                    <React.Fragment key={wi}>
                      {wi > 0 && <br />}
                      {wi === collab.name.split(" ").length - 1 ? (
                        <span className="italic text-[#0350F0]">{word}</span>
                      ) : (
                        word
                      )}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="collab-animate font-inter text-[13px] font-semibold uppercase tracking-[0.1em] text-black/40 mb-7">{collab.tagline}</p>

                {collab.description.map((para, pi) => (
                  <p key={pi} className="collab-animate font-inter text-[15px] text-black/60 leading-[1.85] mb-5 max-w-[480px]">{para}</p>
                ))}

                {/* Links */}
                <div className="collab-animate flex flex-wrap gap-3 mt-3">
                  <a
                    href={collab.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-white font-inter text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-[#0350F0] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                    Visit Website
                  </a>
                  <a
                    href={collab.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-transparent text-black border-[1.5px] border-black font-inter text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-black hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Why We Collaborate */}
            <div className="bg-[#F5F5F5] px-4 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16">
              <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
                  <div>
                    <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0350F0] mb-3">Why We Collaborate</p>
                    <h3 className="collab-animate font-bebas text-[32px] md:text-[40px] text-black/90 tracking-wide leading-snug">
                      {collab.whyTitle.split(" ").map((word, wi) => {
                        // Italicize words that are typically emphasized
                        const emphasize = ["Every", "Value", "Backbone", "Innovation"];
                        if (emphasize.includes(word)) {
                          return <span key={wi} className="italic text-[#0350F0]">{word} </span>;
                        }
                        return word + " ";
                      })}
                    </h3>
                  </div>
                  <p className="collab-animate font-inter text-[14px] text-black/50 leading-[1.75] max-w-sm">{collab.whyIntro}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px]">
                  {collab.whyCards.map((card) => (
                    <div key={card.title} className="collab-animate bg-white p-7 border-t-[3px] border-transparent hover:border-[#0350F0] transition-colors duration-200">
                      <span className="mb-4 block">
                        <card.icon size={28} className="text-[#0350F0]" />
                      </span>
                      <p className="font-inter text-[13px] font-bold uppercase tracking-[0.06em] text-black/90 mb-2">{card.title}</p>
                      <p className="font-inter text-sm text-black/50 leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        ))}

        {/* ─── SUPPORTED BY SECTION ─── */}
        <section className="collab-partner border-b border-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image side */}
            <div className="relative overflow-hidden min-h-[400px] md:min-h-[480px] group bg-[#F8F8F8] p-12 md:p-20">
              <Image
                src={SUPPORTED_BY.image}
                alt={`${SUPPORTED_BY.name} supported partner`}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute bottom-6 left-6 bg-white py-3 px-5 border-l-[3px] border-[#0350F0]">
                <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Partner</p>
                <p className="font-bebas text-xl text-black/90 tracking-wide">Supported By</p>
              </div>
            </div>

            {/* Text side */}
            <div className="collab-animate px-6 sm:px-10 md:px-14 lg:px-16 py-14 md:py-20 flex flex-col justify-center">
              <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0350F0] mb-3">
                Supported By · {SUPPORTED_BY.category}
              </p>
              <h2 className="collab-animate font-bebas text-[40px] sm:text-[48px] md:text-[54px] text-black/90 leading-[1.05] tracking-wide mb-2">
                {SUPPORTED_BY.name.split(" ").map((word, wi) => (
                  <React.Fragment key={wi}>
                    {wi > 0 && <br />}
                    {wi === SUPPORTED_BY.name.split(" ").length - 1 ? (
                      <span className="italic text-[#0350F0]">{word}</span>
                    ) : (
                      word
                    )}
                  </React.Fragment>
                ))}
              </h2>
              <p className="collab-animate font-inter text-[13px] font-semibold uppercase tracking-[0.1em] text-black/40 mb-7">{SUPPORTED_BY.tagline}</p>

              {SUPPORTED_BY.description.map((para, pi) => (
                <p key={pi} className="collab-animate font-inter text-[15px] text-black/60 leading-[1.85] mb-5 max-w-[480px]">{para}</p>
              ))}

              {/* Links */}
              <div className="collab-animate flex flex-wrap gap-3 mt-3">
                <a
                  href={SUPPORTED_BY.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white font-inter text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-[#0350F0] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                  Visit Website
                </a>
                <a
                  href={SUPPORTED_BY.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent text-black border-[1.5px] border-black font-inter text-[12px] font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-black hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ─── JOINT VISION BANNER ─── */}
        <section className="joint-vision bg-[#F5F5F5] relative overflow-hidden py-20 md:py-24 px-4 sm:px-6 md:px-12 text-center">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0350F0] via-[#0350F0] to-black" />

          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0350F0] mb-5">The Bigger Picture</p>
          <h2 className="font-bebas text-[36px] sm:text-[48px] md:text-[64px] text-black/90 leading-[1.08] tracking-wide max-w-[900px] mx-auto mb-8">
            Collectively <span className="italic text-[#0350F0]">Committed.</span>
          </h2>
          <p className="font-inter text-[15px] text-black/55 max-w-[700px] mx-auto mb-12 leading-[1.85]">
            SCHAULT&apos;s modular system, Kapas Paduka&apos;s biodegradable materials, and Expose Trendze&apos;s precision manufacturing represent three complementary forces converging on a single goal: footwear that is responsibly made, exceptionally crafted, and designed to never become waste. Supported by Liberty Shoes, we have the scale to make this vision mainstream.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Settings, name: "SCHAULT", desc: "Modular snap-fit architecture. Replace the sole, keep the upper. Zero full-shoe waste." },
              { icon: Sprout, name: "Kapas Paduka", desc: "Biodegradable materials. 8 trees per sale. Nature-safe at end of product life." },
              { icon: Award, name: "Expose Trendze", desc: "World-class certified manufacturing. European export standards. Built for global scale." },
              { icon: Footprints, name: "Liberty Shoes", desc: "Pan-India retail reach. 70+ years of trust. Scale to bring modular footwear to millions." },
            ].map((item) => (
              <div key={item.name} className="bg-white p-7 text-left border-b-[3px] border-transparent hover:border-[#0350F0] hover:-translate-y-1 transition-all duration-200">
                <span className="mb-3 block">
                  <item.icon size={26} className="text-[#0350F0]" />
                </span>
                <p className="font-inter text-[13px] font-bold uppercase tracking-[0.08em] text-black/90 mb-2">{item.name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0350F0]" />
                  <span className="font-inter text-[10px] font-semibold uppercase tracking-widest text-black/40">
                    {item.name === "Liberty Shoes" ? "Supported Partner" : "Collaborator"}
                  </span>
                </div>
                <p className="font-inter text-[13px] text-black/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ─── PARTNER CTA ─── */}
        <div className="collab-cta bg-black text-white py-20 md:py-28 px-4 sm:px-6 md:px-12 text-center relative overflow-hidden group">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0350F0] rounded-full blur-[120px] opacity-15 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-bebas text-[40px] sm:text-[48px] md:text-[64px] tracking-wide text-white mb-6 uppercase">
              WANT TO COLLABORATE?
            </h2>
            <p className="font-inter text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10">
              We are always looking for partners in material science, distribution, and sustainable design.
              Let&apos;s rebuild the industry together.
            </p>
            <a
              href="mailto:partners@schault.com"
              className="inline-block bg-white text-black font-bebas text-lg px-12 py-5 hover:bg-[#0350F0] hover:text-white transition-colors tracking-widest"
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