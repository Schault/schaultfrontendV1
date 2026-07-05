"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog-data";
import Footer from "@/components/Footer";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostReader({ params }: BlogPostPageProps) {
  const { slug } = params;

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts (same category or others, excluding current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="bg-[#FFFFFF] min-h-screen pt-28 relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] bg-[#0350F0] origin-left z-[100000]"
        style={{ scaleX }}
      />

      {/* Back Button */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-inter text-xs font-bold text-black/50 hover:text-[#0350F0] transition-colors duration-200"
        >
          <span>&larr;</span> BACK TO LOG
        </Link>
      </div>

      {/* Article Header */}
      <header className="px-6 md:px-16 max-w-4xl mx-auto text-left py-6">
        <span className="font-inter text-xs tracking-widest text-[#0350F0] font-semibold uppercase">
          {post.category}
        </span>
        <h1 className="font-inter text-3xl md:text-5xl font-black tracking-tight text-black/95 mt-4 leading-tight">
          {post.title}
        </h1>
        <p className="font-inter text-black/50 text-sm md:text-base mt-6 leading-relaxed italic">
          "{post.excerpt}"
        </p>

        {/* Author Details */}
        <div className="mt-8 flex items-center gap-4 border-b border-black/5 pb-8">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={48}
            height={48}
            className="rounded-full object-cover h-12 w-12 border border-black/5"
          />
          <div>
            <p className="font-inter text-sm font-bold text-black/85">{post.author.name}</p>
            <p className="font-inter text-xs text-black/40 mt-0.5">{post.author.role}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-inter text-xs text-black/40">{post.publishedAt}</p>
            <p className="font-inter text-[10px] text-[#0350F0] font-semibold mt-0.5 uppercase tracking-wider">
              {post.readTime}
            </p>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <section className="px-6 md:px-16 max-w-5xl mx-auto py-6">
        <div className="aspect-[16/9] rounded-3xl overflow-hidden relative shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="px-6 md:px-16 max-w-3xl mx-auto py-8">
        <div
          className="font-inter text-black/70 text-sm md:text-base leading-relaxed space-y-6 
            [&>p]:leading-relaxed [&>p]:text-black/70 
            [&>h3]:font-inter [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-extrabold [&>h3]:text-black/90 [&>h3]:pt-8 [&>h3]:pb-2
            [&>h4]:font-inter [&>h4]:text-base [&>h4]:md:text-lg [&>h4]:font-bold [&>h4]:text-black/80 [&>h4]:pt-6 [&>h4]:pb-1
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:text-black/70
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#0350F0] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-black/50 [&>blockquote]:py-2 [&>blockquote]:font-inter [&>blockquote]:my-6 [&>blockquote]:text-base"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related Posts */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto py-16 border-t border-black/5">
        <h2 className="font-inter text-xl md:text-2xl font-black text-black/95 mb-10 text-left uppercase tracking-tight">
          KEEP READING
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {relatedPosts.map((related) => (
            <Link
              href={`/blog/${related.slug}`}
              key={related.slug}
              className="group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-black/5 shadow-sm">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-inter text-[9px] tracking-wider text-black font-semibold uppercase">
                    {related.category}
                  </div>
                </div>
                <h3 className="font-inter text-sm md:text-base font-bold text-black/90 mt-4 leading-snug group-hover:text-[#0350F0] transition-colors duration-300">
                  {related.title}
                </h3>
              </div>
              <span className="font-inter text-[10px] text-black/40 mt-3 font-medium">
                {related.publishedAt} · {related.readTime}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
