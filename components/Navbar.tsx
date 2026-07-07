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
import { ShoppingCart, User, ChevronDown, Info, BookOpen, Newspaper, ArrowRight } from "lucide-react";
import { LuMenu, LuX } from "react-icons/lu";
import { useCart } from "./providers";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/create-your-own-shoe", label: "CREATE YOUR OWN SHOE" },
  {
    label: "COMPANY",
    submenu: [
      { href: "/about", label: "About Us", desc: "Our story & patented modular technology" },
      { href: "/blog", label: "Blog", desc: "Insights on design, tech & sustainability" },
      { href: "/news", label: "News", desc: "Announcements & press releases" },
    ],
  },
  { href: "/collaborators", label: "COLLABORATORS" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("Home");
  const [companyHovered, setCompanyHovered] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [threshold, setThreshold] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
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
    [100, 90]
  );
  const width = useMotionTemplate`${widthRaw}%`;

  const topRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [44, 16] // Offset by 44px (banner height) initially, then shrink to 16px
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
    [safeWindowWidth, safeWindowWidth * 0.85] 
  );
  const maxWidth = useMotionTemplate`${maxWidthRaw}px`;

  const blurRaw = useTransform(
    scrollY,
    [safeThreshold, safeThreshold + shrinkDistance],
    [0, 12]
  );
  const backdropFilter = useMotionTemplate`blur(${blurRaw}px)`;

  if (isAuthPage || isAdminPage || !mounted) return null;

  const isHomePage = pathname === "/";

  const dynamicStyles = isHomePage ? {
    width,
    top,
    paddingTop: paddingY,
    paddingBottom: paddingY,
    borderRadius,
    backgroundColor,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    maxWidth,
  } : {
    width: "100%",
    top: 0,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    maxWidth: "100%",
  };

  return (
    <>
      <motion.header
        data-lenis-prevent
        style={dynamicStyles}
        className="fixed left-0 right-0 mx-auto z-[10000] border border-black/10 px-4 md:px-8"
      >
        <nav className="mx-auto flex h-full w-full items-center justify-between">
          {/* LEFT: Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.webp"
              alt="Schault Logo"
              width={40}
              height={40}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex md:items-center md:gap-4 xl:gap-8">
            {NAV_LINKS.map((link) => {
              if (link.submenu) {
                const isSubmenuActive = link.submenu.some((sub) => pathname === sub.href);
                return (
                  <div
                    key={link.label}
                    className="relative py-2"
                    onMouseEnter={() => setCompanyHovered(true)}
                    onMouseLeave={() => setCompanyHovered(false)}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1 font-inter text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ${
                        isSubmenuActive
                          ? "text-[#0350F0]"
                          : "text-black/70 hover:text-black/90"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${companyHovered ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {companyHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-1/2 top-full z-[11000] -translate-x-1/2 mt-2 w-80 rounded-[24px] border border-black/5 bg-white/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl"
                        >
                          {/* Hover bridge to close any physical pixel gap between trigger button and menu card */}
                          <div className="absolute top-[-12px] left-0 right-0 h-[12px] bg-transparent" />
                          
                          <div className="flex flex-col gap-1.5">
                            {link.submenu.map((sub, index) => {
                              const SubIcon = index === 0 ? Info : index === 1 ? BookOpen : Newspaper;
                              return (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  className="group/item flex items-center justify-between rounded-2xl p-3 transition-all duration-300 hover:bg-black/[0.02] hover:translate-x-1"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0350F0]/5 text-[#0350F0] transition-all duration-300 group-hover/item:bg-[#0350F0] group-hover/item:text-white group-hover/item:scale-105">
                                      <SubIcon size={18} />
                                    </div>
                                    <div className="text-left">
                                      <p className="font-inter text-sm font-semibold text-black/90 transition-colors duration-200 group-hover/item:text-[#0350F0]">
                                        {sub.label}
                                      </p>
                                      <p className="font-inter text-xs text-black/50 leading-normal mt-0.5">
                                        {sub.desc}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="opacity-0 -translate-x-2 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0 pr-1 text-[#0350F0]">
                                    <ArrowRight size={16} />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative font-inter text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "text-[#0350F0]"
                      : "text-black/70 hover:text-black/90"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#0350F0]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className={`p-2 transition-colors hover:text-[#0350F0] ${
                pathname.startsWith("/auth") ? "text-[#0350F0]" : "text-black/80"
              }`}
            >
              <User size={22} className="stroke-[1.5]" />
            </Link>

            <Link
              href="/cart"
              className={`relative p-2 transition-colors hover:text-[#0350F0] mr-2 ${
                pathname === "/cart" ? "text-[#0350F0]" : "text-black/80"
              }`}
            >
              <ShoppingCart size={22} className="stroke-[1.5]" />
              {cartItemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#0350F0] text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/shop"
              className="hidden rounded-full border border-black/90 px-5 py-2 font-inter text-sm font-medium text-black/90 transition-all duration-300 hover:border-[#0350F0] hover:bg-[#0350F0] hover:text-white md:inline-block"
            >
              ORDER NOW
            </Link>

            <button
              type="button"
              className="p-2 md:hidden"
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
            className="fixed inset-0 z-[11000] flex flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-8 py-5">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/assets/logo.webp"
                  alt="Schault Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <button
                type="button"
                className="p-1"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <LuX
                  size={28}
                  className="text-black/90 transition-colors hover:text-[#0350F0]"
                />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-6 px-8 py-12 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                if (link.submenu) {
                  const isSubmenuActive = link.submenu.some((sub) => pathname === sub.href);
                  return (
                    <div key={link.label}>
                      <button
                        type="button"
                        onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                        className={`flex w-full items-center justify-between font-inter text-lg font-medium tracking-wide transition-colors ${
                          isSubmenuActive
                            ? "text-[#0350F0]"
                            : "text-black/80 hover:text-[#0350F0]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-300 ${mobileCompanyOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileCompanyOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden pl-4 flex flex-col gap-4 mt-4 border-l border-black/10 text-left"
                          >
                            {link.submenu.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className={`font-inter text-base font-medium tracking-wide transition-colors ${
                                  pathname === sub.href ? "text-[#0350F0]" : "text-black/60 hover:text-[#0350F0]"
                                }`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label.toUpperCase()}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-inter text-lg font-medium tracking-wide transition-colors text-left ${
                      isActive
                        ? "text-[#0350F0]"
                        : "text-black/80 hover:text-[#0350F0]"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/shop"
                className="mt-8 block rounded-full border border-black/90 px-6 py-4 text-center font-inter text-lg font-medium text-black/90 transition-all duration-300 hover:border-[#0350F0] hover:bg-[#0350F0] hover:text-white"
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
