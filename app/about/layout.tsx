import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story & Patented Modularity",
  description: "From academic frustration to patented circular innovation. Read the story of SCHAULT, founded by IIT Kanpur material scientist Harsh Maheshwari.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About SCHAULT | Modular Sneaker Footwear System",
    description: "Designed for longevity. Replace only what is worn, not the entire shoe.",
    url: "https://www.schault.com/about"
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
