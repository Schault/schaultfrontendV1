import React from "react";
import Link from "next/link";

const CTAFooter: React.FC = () => {
  return (
    <section
      id="explore"
      className="border-t border-black/10 bg-[#FFFFFF] px-6 py-32 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-bebas text-3xl tracking-wide text-black/90 md:text-4xl">
          Built different. Worn responsibly.
        </p>
        <Link
          href="#waitlist"
          className="mt-10 inline-block border-2 border-[#0350F0] bg-transparent px-10 py-4 font-inter text-sm font-medium text-[#0350F0] transition-colors duration-300 ease-in-out hover:bg-[#0350F0] hover:text-white"
        >
          Get Early Access
        </Link>
      </div>
    </section>
  );
};

export default CTAFooter;
