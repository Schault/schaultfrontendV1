import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-[#F5F5F5]">
            <Navbar />

            <div className="pt-32 pb-12 px-6 md:px-12 lg:px-24 mx-auto max-w-4xl">
                <div className="mb-6">
                    <Link href="/" className="group flex w-fit items-center font-inter text-sm text-black/60 transition-colors hover:text-[#0350F0]">
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
                    </Link>
                </div>
                <div className="mb-2 h-0.5 w-12 bg-[#0350F0]" aria-hidden />
                <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-black/95">
                    TERMS OF SERVICE
                </h1>
                <p className="mt-3 font-inter text-black/50 text-sm">SCHAULT</p>
            </div>

            <section className="bg-white">
                <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 font-inter text-black/80 space-y-6 leading-relaxed">
                    <p>These Terms of Service (&quot;Terms&quot;) govern your use of the website operated by SCHAULT (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). By accessing or using our website, you agree to be bound by these Terms.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">1. Eligibility and Account Terms</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You must be at least 18 years old or accessing the website under the supervision of a parent or guardian.</li>
                        <li>You agree to provide accurate, complete, and current information.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">2. Pricing and Payment</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All prices are listed in Indian Rupees (INR) unless stated otherwise.</li>
                        <li>Prices are subject to change without prior notice.</li>
                        <li>We reserve the right to cancel any order due to pricing or listing errors.</li>
                        <li>Payments must be completed through approved payment methods before order processing.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">3. Product Descriptions</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We aim to ensure all product descriptions, images, and specifications are accurate.</li>
                        <li>Minor variations in color, texture, or design may occur due to display settings or manufacturing processes.</li>
                        <li>Schault does not guarantee that all product information is error-free.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">4. Order Acceptance and Cancellation</h2>
                    <p>Placing an order does not guarantee acceptance. We reserve the right to refuse or cancel any order due to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Product unavailability</li>
                        <li>Errors in pricing or description</li>
                        <li>Suspected fraudulent activity</li>
                    </ul>
                    <p>If an order is canceled after payment, a full refund will be issued.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">5. Shipping and Delivery</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Orders are processed within 5 BUSINESS DAYS.</li>
                        <li>Delivery timelines may vary based on location and external factors.</li>
                        <li>We are not responsible for delays caused by courier services or unforeseen circumstances.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">6. Returns and Refunds</h2>
                    <p>Returns and refunds are governed by our Return and Refund Policy. Customers must comply with the eligibility criteria outlined in that policy.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">7. Prohibited Uses</h2>
                    <p>You agree not to use the website for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Any unlawful or fraudulent activities.</li>
                        <li>Violating applicable laws or regulations.</li>
                        <li>Attempting to disrupt or compromise website security.</li>
                        <li>Uploading harmful code or malicious software.</li>
                    </ul>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">8. Intellectual Property</h2>
                    <p>All content on this website, including logos, images, text, and designs, is the property of Schault. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">9. Limitation of Liability</h2>
                    <p>Schault shall not be liable for indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the amount paid for the purchased product.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">10. Indemnification</h2>
                    <p>You agree to indemnify and hold harmless SCHAULT, its owners, and affiliates from any claims, damages, or losses resulting from your use of the website or violation of these Terms.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">11. Third-Party Services</h2>
                    <p>We may use third-party services such as payment gateways, logistics providers, and analytics tools. We are not responsible for their policies or actions.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">12. Governing Law</h2>
                    <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in Uttar Pradesh.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">13. Changes to Terms</h2>
                    <p>We reserve the right to update or modify these Terms at any time. Changes will take effect immediately upon being posted on the website.</p>

                    <h2 className="font-bebas text-2xl tracking-wide text-black mt-10 mb-4">14. Contact Information</h2>
                    <p>For any questions regarding these Terms, please contact us at:</p>
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
