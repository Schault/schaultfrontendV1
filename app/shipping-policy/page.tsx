import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import Link from "next/link";

export default function ShippingPolicyPage() {
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
                    SHIPPING POLICY
                </h1>
                <p className="mt-3 font-inter text-black/50 text-sm">SCHAULT</p>
            </div>

            <section className="bg-white">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 font-inter text-black/80 space-y-6 leading-relaxed">
                    <p>At SCHAULT, we are committed to delivering your orders quickly and safely.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">1. Order Processing</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All orders are processed within 2 days after payment confirmation.</li>
                        <li>Orders are processed on business days only (Monday to Saturday, excluding public holidays).</li>
                        <li>Once your order is processed, it will be handed over to our shipping partner.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">2. Shipping Methods</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We offer standard shipping across India.</li>
                        <li>Additional shipping options (if available) will be shown at checkout.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">3. Delivery Timeframes</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Estimated delivery time: <strong>7 BUSINESS DAYS</strong>.</li>
                        <li>Delivery timelines may vary depending on your location and serviceability.</li>
                        <li>Remote or non-metro locations may take longer.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">4. Shipping Charges</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Shipping charges are calculated at checkout.</li>
                        <li>Orders may qualify for free shipping above a certain order value (if applicable).</li>
                        <li>Any applicable charges will be clearly displayed before payment.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">5. Order Tracking</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Once your order is shipped, you will receive a tracking link via email or SMS.</li>
                        <li>You can use this link to track your shipment in real time.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">6. Delivery Issues and Delays</h2>
                    <p>While we aim to deliver within the estimated timeframe, delays may occur due to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Weather conditions</li>
                        <li>Logistics disruptions</li>
                        <li>High order volumes</li>
                    </ul>
                    <p>If your order is significantly delayed, please contact us at: <strong>WEARSCHAULT@GMAIL.COM</strong></p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">7. Incorrect Address or Failed Delivery</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Please ensure your shipping address is accurate at checkout.</li>
                        <li>We are not responsible for delays or losses due to incorrect or incomplete addresses.</li>
                        <li>If a delivery fails, re-shipping charges may apply.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">8. Damaged or Missing Packages</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>If your order arrives damaged or incomplete, contact us within 48 hours of delivery.</li>
                        <li>Please provide clear photos/videos as proof for quick resolution.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">9. International Shipping</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Currently not available to all countries / Available to select countries.</li>
                        <li>Additional shipping charges, customs duties, and taxes (if applicable) will be borne by the customer.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">10. Contact Us</h2>
                    <p>For any shipping-related queries, please contact:</p>
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
