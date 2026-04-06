import ShoeScroll from "@/components/ShoeScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollOverlays from "@/components/ScrollOverlays";
import ShopSection from "@/components/ShopSection";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FeatureGrid from "@/components/FeatureGrid";
import StatsSection from "@/components/StatsSection";
import CTAFooter from "@/components/CTAFooter";

export default function Home() {
  return (
    <main className="bg-[#FFFFFF]">

      <ShoeScroll>
        <ScrollProgressBar />
        <ScrollOverlays />
      </ShoeScroll>

      {/* Section A — THE SYSTEM */}
      <FeatureGrid />

      {/* Section B — THE NUMBERS */}
      <StatsSection />

      <ShopSection />
      <AboutSection />
      <FAQ />

      {/* Section C — CTA FOOTER */}
      <CTAFooter />

      <Footer />
    </main>
  );
}
