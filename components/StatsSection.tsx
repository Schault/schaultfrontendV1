import React from "react";

const StatsSection: React.FC = () => {
  return (
    <section className="bg-[#FFFFFF] px-6 pt-4 pb-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-[#FAFAFA] md:grid-cols-3">
          <div className="group flex flex-col items-center p-12 text-center transition-colors duration-500 hover:bg-white">
            <p className="font-bebas text-6xl tracking-wide text-[#CC0000] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              22B
            </p>
            <p className="mt-4 max-w-[200px] font-inter text-sm leading-relaxed text-black/60">
              Pairs discarded annually worldwide
            </p>
          </div>
          <div className="group flex flex-col items-center border-t border-black/10 p-12 text-center transition-colors duration-500 hover:bg-white md:border-t-0 md:border-l">
            <p className="whitespace-nowrap font-bebas text-6xl tracking-wide text-[#CC0000] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              90–95%
            </p>
            <p className="mt-4 max-w-[200px] font-inter text-sm leading-relaxed text-black/60">
              End up in landfills
            </p>
          </div>
          <div className="group flex flex-col items-center border-t border-black/10 p-12 text-center transition-colors duration-500 hover:bg-white md:border-t-0 md:border-l">
            <p className="font-bebas text-6xl tracking-wide text-[#CC0000] transition-colors duration-500 group-hover:text-black md:text-7xl lg:text-8xl">
              1
            </p>
             <p className="mt-4 max-w-[200px] font-inter text-sm font-medium leading-relaxed text-black/80">
              Patent Published
            </p>
            <p className="mt-1 font-inter text-xs text-black/50">
              Intellectual Property India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
