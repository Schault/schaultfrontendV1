import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#F5F5F5]">
            <Navbar />

            <div className="pt-32 pb-12 px-6 md:px-12 lg:px-24 mx-auto max-w-4xl">
                <div className="mb-6">
                    <Link href="/" className="group flex w-fit items-center font-inter text-sm text-black/60 transition-colors hover:text-[#CC0000]">
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
                    </Link>
                </div>
                <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
                <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-black/95">
                    CONTACT US
                </h1>
                <p className="mt-3 font-inter text-black/50 text-sm">SCHAULT</p>
            </div>

            <section className="bg-white">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 font-inter text-black/80 space-y-8 leading-relaxed">
                    <p className="text-lg">We&apos;re here to help. Whether you have a question about our products, your order, or just want to know more about Schault, feel free to reach out to us.</p>

                    <div>
                        <h2 className="font-bebas text-2xl tracking-wide text-black mb-4">Customer Support</h2>
                        <ul className="space-y-4">
                            <li><strong>Email:</strong> <a href="mailto:WEARSCHAULT@GMAIL.COM" className="text-[#CC0000] hover:underline">WEARSCHAULT@GMAIL.COM</a></li>
                        </ul>
                        <p className="mt-4 text-black/60 text-sm">We aim to respond to all queries within 24–48 HOURS.</p>
                    </div>

                    <div>
                        <h2 className="font-bebas text-2xl tracking-wide text-black mb-4">Business Hours</h2>
                        <ul className="space-y-2">
                            <li><strong>Monday to Saturday:</strong> 10:00 AM – 5:00 PM</li>
                            <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                    </div>
                </div>
            </section>

            <CTAFooter />
            <Footer />
        </main>
    );
}
