import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Announcements | SCHAULT",
  description: "Read the latest press releases, product launch announcements, and modular circular footwear news from SCHAULT.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News & Announcements | SCHAULT",
    description: "Read the latest press releases, product launch announcements, and modular circular footwear news from SCHAULT.",
    url: "https://www.schault.com/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
