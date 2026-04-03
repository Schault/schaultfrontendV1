import React from "react";

const StatsSection: React.FC = () => {
  return (
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
  );
};

export default StatsSection;
