import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCHAULT — Replace parts. Not the entire shoe.",
  description:
    "Modular footwear with a patented snap-fit system. Upper, midsole, and outsole can be individually replaced, cleaned, or swapped.",
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
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        }}
        className="bg-[#FFFFFF] font-inter text-black/90 antialiased"
      >
        <Providers>
          <CartDrawer />
          <Navbar />
          {children}
          <div className="grain-overlay" aria-hidden />
        </Providers>
      </body>
    </html>
  );
}
