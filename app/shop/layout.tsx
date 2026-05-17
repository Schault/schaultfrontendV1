import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Modular Sneakers | SCHAULT",
  description: "Browse the SCHAULT collection of modular, sustainable sneakers. Choose from Ochre & Earth, Rust & Ash, Arctic Dawn and more. Endless combinations.",
  alternates: {
    canonical: "/shop"
  },
  openGraph: {
    title: "Shop Modular Sneakers | SCHAULT India",
    description: "Modular footwear with a patented snap-fit interlocking system. Swap uppers and soles in under 10 seconds.",
    url: "https://www.schault.com/shop"
  }
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
