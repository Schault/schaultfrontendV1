import ShoeScroll from "@/components/ShoeScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollOverlays from "@/components/ScrollOverlays";
import CollectionHero from "@/components/CollectionHero";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FeatureGrid from "@/components/FeatureGrid";
import StatsSection from "@/components/StatsSection";
import CTAFooter from "@/components/CTAFooter";
import WaitlistForm from "@/components/WaitlistForm";

export default async function Home() {

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

      <CollectionHero />

      <AboutSection />
      <FAQ />

      {/* Section D — WAITLIST */}
      <WaitlistForm />

      {/* Section C — CTA FOOTER */}
      <CTAFooter />

      <Footer />
    </main>
  );
}
