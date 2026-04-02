"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "./providers";

const NAV_LINKS = [
  { href: "#", label: "Home" },
  { href: "#shop", label: "Shop" },
  { href: "#about", label: "About Us" },
  { href: "#faq", label: "FAQ" },
];

const SCROLL_THRESHOLD = 80;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const { items, setIsCartOpen } = useCart();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 px-8 py-4 transition-all duration-300 ease-in-out ${scrolled
            ? "border-b border-[#CC0000] bg-white/95 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
          }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="#"
            className="font-bebas text-[1.4rem] tracking-[0.2em] text-black"
            onClick={() => setActiveLink("Home")}
          >
            SCHAULT
          </Link>

          {/* Center links — hidden on mobile */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex md:items-center md:gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={`group relative font-inter text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${activeLink === label ? "text-[#CC0000]" : "text-black/70"
                  } hover:text-[#CC0000]`}
                onClick={() => setActiveLink(label)}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[#CC0000] transition-all duration-200 ${activeLink === label ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* Right: Icons + CTA on desktop, hamburger on mobile */}
          <div className="flex items-center gap-5">
            <Link
              href="/profile"
              className="text-black/80 transition-colors hover:text-[#CC0000]"
            >
              <User size={22} className="stroke-[1.5]" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-black/80 transition-colors hover:text-[#CC0000]"
            >
              <ShoppingCart size={22} className="stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            <Link
              href="/#shop"
              className={`hidden border px-4 py-2 font-inter text-xs uppercase tracking-widest transition-all duration-200 md:inline-block ${scrolled ? "border-black" : "border-black/80"
                } text-black hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white`}
            >
              Order Now
            </Link>
            <button
              type="button"
              className="flex flex-col gap-1.5 p-2 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="h-[1.5px] w-6 bg-black" />
              <span className="h-[1.5px] w-6 bg-black" />
              <span className="h-[1.5px] w-6 bg-black" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-white"
          >
            <div className="flex h-full flex-col px-8 pt-16 pb-12">
              <button
                type="button"
                className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center font-inter text-2xl text-black transition-colors hover:text-[#CC0000]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
              <nav className="flex flex-1 flex-col justify-center gap-8">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="font-bebas text-3xl tracking-wide text-black transition-colors hover:text-[#CC0000]"
                    onClick={() => {
                      setActiveLink(label);
                      setMobileOpen(false);
                    }}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="#shop"
                  className="mt-4 inline-block w-fit border-2 border-[#CC0000] px-6 py-3 font-inter text-sm font-medium uppercase tracking-widest text-[#CC0000] transition-colors hover:bg-[#CC0000] hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Order Now
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
