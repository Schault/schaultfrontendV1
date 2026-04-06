import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider.tsx/Lenis";

export const metadata: Metadata = {
  title: "SCHAULT — Replace parts. Not the entire shoe.",
  description:
    "Modular footwear with a patented snap-fit system. Upper, midsole, and outsole can be individually replaced, cleaned, or swapped.",
  icons: {
    icon: "/assets/Schault_icon.webp",
  },
};

import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        }}
        className="bg-[#FFFFFF] font-inter text-black/90 antialiased"
      >
        <Providers>
          <LenisProvider>
            <CartDrawer />
            <Navbar />
            {children}
            <div className="grain-overlay" aria-hidden />
          </LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
