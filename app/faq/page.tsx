import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-[#F5F5F5]">
            <Navbar />

            {/* Header Padding since Navbar is fixed */}
            <div className="pt-32 pb-12 px-6 md:px-12 lg:px-24 mx-auto max-w-6xl">
                <div className="mb-6">
                    <Link href="/" className="group flex w-fit items-center font-inter text-sm text-black/60 transition-colors hover:text-[#CC0000]">
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
                    </Link>
                </div>
                <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
                <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-black/95">
                    FREQUENTLY ASKED QUESTIONS
                </h1>
                <p className="mt-3 font-inter text-lg text-black/60">
                    Everything you need to know about the SCHAULT system.
                </p>
            </div>

            <section className="bg-white">
                <FAQ />
            </section>

            <CTAFooter />
            <Footer />
        </main>
    );
}
