import Navbar from "@/components/Navbar";
import ShoeScroll from "@/components/ShoeScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollOverlays from "@/components/ScrollOverlays";
import ShopSection from "@/components/ShopSection";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#FFFFFF]">
      <Navbar />

      <ShoeScroll>
        <ScrollProgressBar />
        <ScrollOverlays />
      </ShoeScroll>

      {/* Section A — THE SYSTEM */}
      <section className="border-t border-black/10 bg-[#FFFFFF] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-3">
            <div>
              <div className="h-0.5 w-12 bg-[#CC0000]" aria-hidden />
              <h3 className="mt-4 font-bebas text-2xl tracking-wide text-black/90">
                Hygiene & Comfort
              </h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-black/60">
                Upper and sole separate for individual cleaning.
              </p>
            </div>
            <div>
              <div className="h-0.5 w-12 bg-[#CC0000]" aria-hidden />
              <h3 className="mt-4 font-bebas text-2xl tracking-wide text-black/90">
                Cost Efficiency
              </h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-black/60">
                Replace only the worn part, not the whole shoe.
              </p>
            </div>
            <div>
              <div className="h-0.5 w-12 bg-[#CC0000]" aria-hidden />
              <h3 className="mt-4 font-bebas text-2xl tracking-wide text-black/90">
                Sustainability
              </h3>
              <p className="mt-3 font-inter text-sm leading-relaxed text-black/60">
                30–50% reduction in material waste per lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B — THE NUMBERS */}
      <section className="border-t border-black/10 bg-[#FFFFFF] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-16 text-center md:grid-cols-3">
            <div>
              <p className="font-bebas text-5xl tracking-wide text-[#CC0000] md:text-6xl lg:text-7xl">
                22B
              </p>
              <p className="mt-2 font-inter text-sm text-black/60">
                Pairs discarded annually worldwide
              </p>
            </div>
            <div>
              <p className="font-bebas text-5xl tracking-wide text-[#CC0000] md:text-6xl lg:text-7xl">
                90–95%
              </p>
              <p className="mt-2 font-inter text-sm text-black/60">
                End up in landfills
              </p>
            </div>
            <div>
              <p className="font-bebas text-5xl tracking-wide text-[#CC0000] md:text-6xl lg:text-7xl">
                1 Patent
              </p>
              <p className="mt-2 font-inter text-sm text-black/60">
                Published, Intellectual Property India
              </p>
            </div>
          </div>
        </div>
      </section>

      <ShopSection />
      <AboutSection />
      <FAQ />

      {/* Section C — CTA FOOTER */}
      <section
        id="explore"
        className="border-t border-black/10 bg-[#FFFFFF] px-6 py-32 md:px-12 lg:px-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-bebas text-3xl tracking-wide text-black/90 md:text-4xl">
            Built different. Worn responsibly.
          </p>
          <Link
            href="#"
            className="mt-10 inline-block border-2 border-[#CC0000] bg-transparent px-10 py-4 font-inter text-sm font-medium text-[#CC0000] transition-colors duration-300 ease-in-out hover:bg-[#CC0000] hover:text-white"
          >
            Get Early Access
          </Link>
        </div>
      </section>
    </main>
  );
}
