import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCHAULT — Replace parts. Not the entire shoe.",
  description:
    "Modular footwear with a patented snap-fit system. Upper, midsole, and outsole can be individually replaced, cleaned, or swapped.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <body
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          minHeight: "100vh",
          position: "relative",
        }}
        className="bg-[#FFFFFF] font-inter text-black/90 antialiased"
      >
        {children}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
