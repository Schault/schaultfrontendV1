import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import Link from "next/link";

export default function RefundPolicyPage() {
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
                    RETURN & REFUND POLICY
                </h1>
                <p className="mt-3 font-inter text-black/50 text-sm">SCHAULT</p>
            </div>

            <section className="bg-white">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 font-inter text-black/80 space-y-6 leading-relaxed">
                    <p>At SCHAULT, we strive to ensure that every customer is satisfied with their purchase. If for any reason you are not completely happy, we&apos;re here to help.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">1. Return Eligibility</h2>
                    <p>To be eligible for a return, the product must meet the following conditions:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The return request is made within <strong>3 DAYS</strong> of delivery.</li>
                        <li>The product is unused, unworn, and in original condition.</li>
                        <li>All original packaging, tags, and accessories are intact.</li>
                        <li>The product is not damaged due to misuse, improper handling, or normal wear and tear.</li>
                    </ul>
                    <p>We reserve the right to reject returns that do not meet the above criteria.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">2. Return Timeframe</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must initiate a return within <strong>3 DAYS</strong> from the date of delivery.</li>
                        <li>Once approved, the product must be shipped back within <strong>5 DAYS</strong>.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">3. Exchange Policy</h2>
                    <p>We offer exchanges in the following cases:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Size issues</li>
                        <li>Manufacturing defects</li>
                        <li>Damaged product received</li>
                    </ul>
                    <p>Exchanges are subject to product availability. If the requested item is unavailable, a refund will be processed instead.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">4. Refund Process</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Once we receive and inspect the returned product, we will notify you of approval or rejection.</li>
                        <li>If approved, the refund will be processed within <strong>7 Working Days</strong>.</li>
                        <li>Refunds will be credited to the original payment method.</li>
                    </ul>
                    <p><em>Please note: Shipping charges (if any) are non-refundable unless the return is due to our error.</em></p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">5. Return Shipping</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Customers may be required to bear return shipping costs unless the product is defective or incorrect.</li>
                        <li>We recommend using a trackable shipping method to ensure safe delivery.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">6. Damaged or Defective Products</h2>
                    <p>If you receive a damaged, defective, or incorrect product:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Contact us within 48 hours of delivery.</li>
                        <li>Share clear photos/videos as proof.</li>
                        <li>Email us at: <strong>WEARSCHAULT@GMAIL.COM</strong></li>
                    </ul>
                    <p>We will arrange a replacement or full refund at no additional cost.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">7. Non-Returnable Items</h2>
                    <p>The following items are not eligible for return:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Products that have been used, worn, or washed.</li>
                        <li>Customized or made-to-order items.</li>
                        <li>Items returned without original packaging or tags.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">8. Late or Missing Refunds</h2>
                    <p>If you haven&apos;t received your refund yet:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Check your bank account or payment method again.</li>
                        <li>Contact your bank/payment provider (processing times may vary).</li>
                        <li>If the issue persists, contact us at <strong>WEARSCHAULT@GMAIL.COM</strong></li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">9. Contact Us</h2>
                    <p>For any return or refund-related queries, please reach out to us:</p>
                    <p>Email: <strong>WEARSCHAULT@GMAIL.COM</strong></p>
                </div>
            </section>

            <section className="bg-[#111111] py-16 px-6 text-center">
                <div className="mx-auto max-w-3xl">
                    <h2 className="font-bebas text-3xl md:text-5xl tracking-wide text-white mb-6">REDEFINE FOOTWEAR</h2>
                    <p className="font-inter text-white/70 max-w-2xl mx-auto">
                        Schault redefines footwear with a modular design that lets you switch styles effortlessly without buying multiple pairs. Built for comfort, durability, and sustainability, our shoes adapt to your lifestyle while reducing waste. Designed with precision and trusted for everyday versatility, Schault keeps you moving.
                    </p>
                </div>
            </section>

            <CTAFooter />
            <Footer />
        </main>
    );
}
