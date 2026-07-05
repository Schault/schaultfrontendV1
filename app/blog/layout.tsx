import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schault Log | Insights into Modularity & Sustainability",
  description: "Read about the material science, mechanical snap-fit systems, circular fashion supply chains, and design iterations backing SCHAULT.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Schault Log | Modularity & Sustainability Insights",
    description: "Read about the material science, mechanical snap-fit systems, and design backing SCHAULT.",
    url: "https://www.schault.com/blog"
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
