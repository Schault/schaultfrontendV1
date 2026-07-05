import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
import LenisProvider from "@/components/LenisProvider.tsx/Lenis";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "SCHAULT | Modular Footwear & Interchangeable Sneakers",
    template: "%s | SCHAULT"
  },
  description:
    "Engineered for circular fashion. SCHAULT features a patented snap-fit mechanical system that lets you replace individual worn-out parts instead of the entire shoe.",
  keywords: [
    "modular shoes India",
    "sustainable footwear",
    "replaceable sole shoes",
    "eco-friendly sneakers",
    "modular sneakers",
    "circular fashion India",
    "IIT Kanpur startup"
  ],
  metadataBase: new URL("https://www.schault.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "SCHAULT | Modular Footwear & Interchangeable Sneakers",
    description: "Engineered for circular fashion. Replace only what is worn, not the entire shoe.",
    url: "https://www.schault.com",
    siteName: "SCHAULT",
    images: [
      {
        url: "/assets/logo.webp",
        width: 800,
        height: 600,
        alt: "SCHAULT Modular Shoes"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SCHAULT | Modular Footwear",
    description: "Replace only what is worn, not the entire shoe. Patented snap-fit sneaker system.",
    images: ["/assets/logo.webp"]
  },
  icons: {
    icon: "/assets/logo.webp",
  },
};

import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import CartToast from "@/components/CartToast";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        }}
        className={`bg-[#FFFFFF] font-inter text-black/90 antialiased ${inter.variable}`}
      >
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SCHAULT",
              "url": "https://www.schault.com",
              "logo": "https://www.schault.com/assets/logo.webp",
              "description": "SCHAULT is a modular footwear brand with a patented snap-fit interlocking system. Swap uppers and soles in under 10 seconds without tools or adhesives.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.instagram.com/schault.official",
                "https://www.linkedin.com/company/schault"
              ]
            })
          }}
        />
        <Providers>
          <LenisProvider>
            <CartToast />
            <CartDrawer />
            <Navbar />
            {children}
            <div className="grain-overlay" aria-hidden />
          </LenisProvider>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
