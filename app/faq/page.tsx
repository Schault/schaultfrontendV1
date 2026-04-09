import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Link from "next/link";
import CTAFooter from "@/components/CTAFooter";

export default function FAQPage() {
  return (
    <>
      <main className="bg-white min-h-screen pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-2 font-inter text-[10px] text-black/50 mb-12 uppercase tracking-widest">
            <Link href="/" className="hover:text-black/90 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-black/90 font-medium">FAQ</span>
          </div>
        </div>

        <FAQ />
      </main>
      <CTAFooter />
      <Footer />
    </>
  );
}
