import React from "react";

const FeatureGrid: React.FC = () => {
  return (
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
  );
};

export default FeatureGrid;
