"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaInstagram, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      // TODO: Integrate with newsletter service (e.g., Mailchimp)
      setEmail("");
    }
  };

  const navColumns = [
    {
      title: "EXPLORE",
      links: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/shop" },
        { label: "About", href: "/about" },
        { label: "Blog", href: "/#blog" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Shipping Policy", href: "/shipping-policy" },
      ],
    },
  ];

  return (
    <footer className="border-t border-black/10 bg-[#FFFFFF] px-6 pb-8 pt-16 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 text-left md:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {/* Brand + Newsletter Block (Spans 2 columns on Desktop) */}
          <div className="flex flex-col gap-12 lg:col-span-2 lg:pr-12">

            {/* BRAND */}
            <div className="flex flex-col items-start">
              <Image
                src="/assets/Schault_icon.webp"
                alt="Schault Logo"
                width={120}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <p className="mt-4 font-inter text-sm text-black/50">
                Replace parts. Not the entire shoe.
              </p>
              <p className="mt-1 font-bebas text-sm text-black/30">EST. 2024</p>

              <div className="mt-6 flex gap-3">
                <Link
                  href="https://www.instagram.com/wearschault/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-black/10 p-2 text-black/70 transition-all duration-200 hover:scale-110 hover:border-[#CC0000] hover:text-[#CC0000]"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </Link>
                <Link
                  href="mailto:wearschault@gmail.com"
                  className="rounded-full border border-black/10 p-2 text-black/70 transition-all duration-200 hover:scale-110 hover:border-[#CC0000] hover:text-[#CC0000]"
                  aria-label="Email"
                >
                  <FaEnvelope size={18} />
                </Link>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="flex flex-col items-start">
              <h3 className="font-bebas text-xl tracking-wide text-black/90">
                STAY IN THE LOOP
              </h3>
              <p className="mt-1 font-inter text-xs text-black/50">
                New drops, restocks, and behind-the-scenes.
              </p>
              <div className="mt-4 flex w-full max-w-sm flex-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-black/10 bg-transparent px-4 py-2 font-inter text-sm focus:border-black/30 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="bg-black px-4 py-2 font-bebas tracking-wider text-white transition-colors duration-200 hover:bg-[#CC0000]"
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>

          </div>

          {/* Navigation Columns */}
          {navColumns.map((col) => (
            <div key={col.title} className="flex flex-col items-start md:col-span-1">
              <h3 className="mb-4 font-bebas text-xl text-black/90">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group relative flex items-center font-inter text-sm text-black/70 transition-all duration-200 hover:pl-5 hover:text-[#CC0000]"
                    >
                      <span className="absolute left-0 -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                        &rarr;
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 sm:flex-row">
          <p className="font-inter text-xs text-black/40">
            © {currentYear} Schault. All rights reserved.
          </p>
          <p className="font-bebas text-sm tracking-widest text-black/20">
            SCHAULT
          </p>
          <p className="font-inter text-xs text-black/40">Made in India</p>
        </div>
      </div>
    </footer>
  );
}
