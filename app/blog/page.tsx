"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Design", "Sustainability", "Technology", "Editorial"] as const;

export default function BlogHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category === selectedCategory;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const regularPosts = filteredPosts.filter((p) => p.slug !== featuredPost.slug || selectedCategory !== "All");

  return (
    <main className="bg-[#FFFFFF] min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto text-center md:text-left py-12 md:py-20 border-b border-black/5">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-inter text-xs tracking-widest text-[#0350F0] font-semibold uppercase"
        >
          Insights & Exploration
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-inter text-4xl md:text-7xl font-black tracking-tight text-black/90 mt-4 leading-none"
        >
          THE SCHAULT LOG
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-inter text-black/50 max-w-2xl mt-6 text-sm md:text-base leading-relaxed"
        >
          Unveiling the engineering, art, and philosophy behind modular footwear, circular ecosystems, and customizable street style.
        </motion.p>
      </section>

      {/* Featured Article Section */}
      {selectedCategory === "All" && featuredPost && (
        <section className="px-6 md:px-16 max-w-7xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center bg-black/[0.02] rounded-3xl p-6 md:p-8 border border-black/5 overflow-hidden"
          >
            {/* Image */}
            <div className="lg:col-span-7 aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden relative shadow-md">
              <Link href={`/blog/${featuredPost.slug}`}>
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full font-inter text-[10px] tracking-wider text-black font-semibold uppercase">
                FEATURED
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              <span className="font-inter text-[10px] tracking-widest text-[#0350F0] font-semibold uppercase">
                {featuredPost.category}
              </span>
              <h2 className="font-inter text-2xl md:text-4xl font-extrabold text-black/90 mt-4 leading-tight group-hover:text-[#0350F0] transition-colors duration-300">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="font-inter text-black/50 text-sm mt-4 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              {/* Author & Meta */}
              <div className="mt-8 flex items-center gap-4">
                <Image
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover h-10 w-10 border border-black/5"
                />
                <div>
                  <p className="font-inter text-xs font-bold text-black/80">{featuredPost.author.name}</p>
                  <p className="font-inter text-[10px] text-black/40 mt-0.5">{featuredPost.publishedAt} · {featuredPost.readTime}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Categories & Grid */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-black/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-6 py-2.5 rounded-full font-inter text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${
                selectedCategory === cat
                  ? "text-white"
                  : "text-black/50 hover:text-black/80 hover:bg-black/5"
              }`}
            >
              {selectedCategory === cat && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#0350F0] rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="py-16">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-inter text-black/40 text-lg">No stories found in this category.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {regularPosts.map((post) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={post.slug}
                    className="group flex flex-col justify-between text-left"
                  >
                    <div className="flex flex-col">
                      {/* Image container */}
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-black/5 shadow-sm">
                        <Link href={`/blog/${post.slug}`}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-inter text-[9px] tracking-wider text-black font-semibold uppercase">
                          {post.category}
                        </div>
                      </div>

                      {/* Header info */}
                      <span className="font-inter text-[10px] text-black/40 mt-6 tracking-wide font-medium">
                        {post.publishedAt} · {post.readTime}
                      </span>
                      <h3 className="font-inter text-lg font-bold text-black/90 mt-2 leading-snug group-hover:text-[#0350F0] transition-colors duration-300">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="font-inter text-black/50 text-xs mt-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="mt-6 flex items-center gap-3 pt-6 border-t border-black/5">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover h-8 w-8 border border-black/5"
                      />
                      <div>
                        <p className="font-inter text-[10px] font-bold text-black/80">{post.author.name}</p>
                        <p className="font-inter text-[9px] text-black/40 mt-0.5">{post.author.role}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="bg-black rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0350F0]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="font-inter text-[10px] tracking-widest text-[#0350F0] font-bold uppercase mb-4">
              Get Notified
            </span>
            <h2 className="font-inter text-2xl md:text-5xl font-black tracking-tight leading-none">
              NEVER MISS A DROP
            </h2>
            <p className="font-inter text-white/50 text-xs md:text-sm mt-4 max-w-md leading-relaxed">
              Subscribe to the Schault newsletter for exclusive technology deep-dives, styling concepts, and release updates.
            </p>
            
            {/* Input field */}
            <div className="mt-8 flex w-full max-w-md flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-white/10 bg-white/5 px-5 py-3 font-inter text-xs text-white placeholder-white/30 rounded-full focus:border-[#0350F0] focus:outline-none transition-colors duration-200"
              />
              <button
                type="button"
                className="bg-white text-black px-6 py-3 font-inter text-xs font-bold tracking-wider rounded-full hover:bg-[#0350F0] hover:text-white transition-colors duration-200 uppercase whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
