"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  image: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "modular-platform-v1",
    title: "Schault Launches Modular Platform V1 Globally",
    excerpt: "We are thrilled to announce the official global release of our modular footwear platform, bringing customizable, circular street style to creators everywhere.",
    date: "July 05, 2026",
    tag: "Launch",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "harsh-maheshwari-sustainability-award",
    title: "Founder Harsh Maheshwari Named to Sustainability Innovation List",
    excerpt: "IIT Kanpur material scientist and Schault founder, Harsh Maheshwari, has been recognized for pioneering glue-free mechanical snap-fit structures in modern footwear.",
    date: "June 28, 2026",
    tag: "Recognition",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "fall-2026-collaborations",
    title: "Preview: High-Fidelity Collaborations Arriving Fall 2026",
    excerpt: "Schault is partnering with leading street style designers and circular artists to deliver limited-edition customizable upper designs and textured outsoles.",
    date: "June 12, 2026",
    tag: "Partnership",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "snap-fit-design-award",
    title: "Patented Snap-Fit Technology Wins Global Footwear Design Award",
    excerpt: "Our engineering team's break from traditional heat-welding and toxic adhesives has won top honors for structural longevity and environmental stewardship.",
    date: "May 29, 2026",
    tag: "Award",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop",
  },
];

export default function NewsPage() {
  return (
    <main className="bg-[#FFFFFF] min-h-screen pt-28 flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto text-center md:text-left py-12 md:py-20 border-b border-black/5">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-inter text-xs tracking-widest text-[#0350F0] font-semibold uppercase"
          >
            Company Announcements
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-inter text-4xl md:text-7xl font-black tracking-tight text-black/90 mt-4 leading-none"
          >
            THE NEWSROOM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-black/50 max-w-2xl mt-6 text-sm md:text-base leading-relaxed"
          >
            Get the latest updates on our circular manufacturing breakthroughs, street culture collaborations, and product announcements.
          </motion.p>
        </section>

        {/* News Grid */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {NEWS_ITEMS.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col justify-between bg-black/[0.01] border border-black/5 rounded-3xl p-6 md:p-8 hover:bg-black/[0.02] transition-colors duration-300"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl relative shadow-sm mb-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-[10px] tracking-wider text-black/40 font-medium">
                      {item.date}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-black/20" />
                    <span className="bg-[#0350F0]/10 text-[#0350F0] px-2.5 py-1 rounded-full font-inter text-[9px] tracking-wider font-semibold uppercase">
                      {item.tag}
                    </span>
                  </div>

                  <h2 className="font-inter text-xl md:text-2xl font-bold text-black/90 mt-4 leading-snug group-hover:text-[#0350F0] transition-colors duration-300">
                    {item.title}
                  </h2>
                  <p className="font-inter text-black/50 text-sm mt-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-black/5 flex items-center">
                  <span className="font-inter text-xs font-semibold text-[#0350F0] tracking-wide group-hover:underline cursor-pointer">
                    Read Release &rarr;
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
