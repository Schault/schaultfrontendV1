"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import { LuMenu, LuX } from "react-icons/lu";
import { useCart } from "./providers";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT US" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("Home");
  const { items, setIsCartOpen } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [threshold, setThreshold] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  if (pathname.startsWith("/auth")) return null;

  useEffect(() => {
    const handleResize = () => {
      // The ShoeScroll container is 500vh tall. The animation hits the last frame 
      // exactly when the user has scrolled 400vh down (500vh - 100vh viewport).
      setThreshold(window.innerHeight * 4);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Framer Motion continuous scroll mapping
  const { scrollY } = useScroll();

  // Safely fallback to 4000 for SSR rendering before layout effect triggers
  const safeThreshold = threshold || 4000;
  const shrinkDistance = 400; // It takes 400px of pure scrolling to transition fully

  const widthRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [100, 80]
  );
  const width = useMotionTemplate`${widthRaw}%`;

  const topRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [0, 16]
  );
  const top = useMotionTemplate`${topRaw}px`;

  const radiusRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [0, 9999]
  );
  const borderRadius = useMotionTemplate`${radiusRaw}px`;

  const paddingYRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [16, 12]
  );
  const paddingY = useMotionTemplate`${paddingYRaw}px`;

  const bgAlpha = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [1, 0.8]
  );
  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgAlpha})`;

  // Framer Motion cannot natively interpolate between different unit types ("100vw" -> "1024px").
  // This causes invalid CSS output resulting in the squashed layout.
  // Instead, we safely calculate pure numeric pixel values via windowWidth!
  const safeWindowWidth = windowWidth || 1920; 

  const maxWidthRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [safeWindowWidth, 1024] // 1024px is Tailwind's max-w-5xl
  );
  const maxWidth = useMotionTemplate`${maxWidthRaw}px`;

  const blurRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [0, 12]
  );
  const backdropFilter = useMotionTemplate`blur(${blurRaw}px)`;

  return (
    <>
      <motion.header
        style={{
          width,
          top,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          borderRadius,
          backgroundColor,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          maxWidth,
        }}
        className="fixed left-1/2 -translate-x-1/2 z-50 border border-black/10 px-8"
      >
        <nav className="mx-auto flex h-full w-full items-center justify-between">
          {/* LEFT: Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/Schault_icon_bgr.png"
              alt="Schault Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="font-serif text-lg font-medium tracking-widest text-black/90">
              SCHAULT
            </span>
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex md:items-center md:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative font-inter text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-[#CC0000]"
                      : "text-black/70 hover:text-black/90"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#CC0000]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-black/80 transition-colors hover:text-[#CC0000]"
            >
              <User size={22} className="stroke-[1.5]" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-black/80 transition-colors hover:text-[#CC0000] mr-2"
            >
              <ShoppingCart size={22} className="stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            <Link
              href="/shop"
              className="hidden rounded-full border border-black/90 px-5 py-2 font-inter text-sm font-medium text-black/90 transition-all duration-300 hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white md:inline-block"
            >
              ORDER NOW
            </Link>

            <button
              type="button"
              className="p-1 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <LuMenu size={26} className="text-black/90" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-8 py-5">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/assets/Schault_icon.webp"
                  alt="Schault Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="font-serif text-lg font-medium tracking-widest text-black/90">
                  SCHAULT
                </span>
              </Link>
              <button
                type="button"
                className="p-1"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <LuX
                  size={28}
                  className="text-black/90 transition-colors hover:text-[#CC0000]"
                />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-8 px-8 py-12">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-inter text-lg font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-[#CC0000]"
                        : "text-black/80 hover:text-[#CC0000]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/shop"
                className="mt-8 block rounded-full border border-black/90 px-6 py-4 text-center font-inter text-lg font-medium text-black/90 transition-all duration-300 hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                ORDER NOW
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
