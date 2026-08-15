"use client";

import Footer from "@/components/Footer";
import ThreeModelViewer from "@/components/ThreeModelViewer";
import Link from "next/link";
import { useState } from "react";

type ModelOption = {
  name: string;
  path: string;
  image?: string;
  isAvailable?: boolean;
};

const UPPER_MODELS: ModelOption[] = [
  {
    name: "WildRoot",
    path: "/assets/models/customizer/upper/Ocre_and_Olive-lowres.glb",
    image: "/images/shoes/WildRoot/1.png",
    isAvailable: false,
  },
  {
    name: "DayDream",
    path: "/assets/models/customizer/upper/White_and_Blue-lowres.glb",
    image: "/images/shoes/DayDream/1.png",
    isAvailable: true,
  },
  {
    name: "DayBreak",
    path: "/assets/models/customizer/upper/White_and_Yellow-lowres.glb",
    image: "/images/shoes/DayBreak/1.png",
    isAvailable: true,
  },
  {
    name: "RedEye",
    path: "/assets/models/customizer/upper/Red_and_Black-lowres.glb",
    image: "/images/shoes/RedEye/1.png",
    isAvailable: true,
  },
  {
    name: "BlueBird",
    path: "/assets/models/customizer/upper/Blue_Sun-lowres.glb",
    image: "/images/shoes/BlueBird/1.png",
    isAvailable: false,
  },
  {
    name: "SunDaze",
    path: "/assets/models/customizer/upper/Blue_Sun-lowres.glb",
    image: "/images/shoes/SunDaze/1.png",
    isAvailable: true,
  },
];

const SOLE_MODELS: ModelOption[] = [
  {
    name: "Sole Black",
    path: "/assets/models/customizer/sole/sole_black.glb",
    image : '/images/sole_2.webp',
  },
  {
    name: "Sole White",
    path: "/assets/models/customizer/sole/sole_white.glb",
    image : '/images/sole_1.webp',
  },
  {
    name: "Coffee",
    path: "/assets/models/customizer/sole/Lower_Coffee.glb",
    image : '',
  },
  // {
  //   name: "Dark Blue",
  //   path: "/assets/models/customizer/sole/Lower_DBlue.glb",
  //   image : '',
  // },
  // {
  //   name: "Grey",
  //   path: "/assets/models/customizer/sole/Lower_Grey.glb",
  //   image : '',
  // },
  {
    name: "Olive",
    path: "/assets/models/customizer/sole/Lower_Olive.glb",
    image : '',
  },
];

type SelectionTab = "upper" | "sole";

export default function CreateYourOwnShoePage() {
  const [selectedUpper, setSelectedUpper] = useState<ModelOption>(UPPER_MODELS[0]);
  const [selectedSole, setSelectedSole] = useState<ModelOption>(SOLE_MODELS[0]);
  const [isSwitchingModel, setIsSwitchingModel] = useState(false);
  const [activeTab, setActiveTab] = useState<SelectionTab>("upper");

  return (
    <>
      <main className="min-h-screen bg-white px-4 pb-20 pt-32 sm:px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex items-center gap-2 font-inter text-[10px] uppercase tracking-widest text-black/50">
            <Link href="/" className="transition-colors hover:text-black/90">
              Home
            </Link>
            <span>&gt;</span>
            <span className="font-medium text-black/90">Create Your Own Shoe</span>
          </div>

          <section className="border border-black/10 bg-gradient-to-br from-white via-[#F8F8F8] to-[#EFEFEF] p-8 text-center sm:p-12 md:p-16">
            <p className="mb-4 font-inter text-xs uppercase tracking-[0.25em] text-[#0350F0]">
              3D Customizer
            </p>
            <h1 className="mb-6 font-inter text-5xl leading-[0.9] tracking-wide text-black/90 sm:text-6xl md:text-[84px]">
              CREATE YOUR OWN SHOE
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-inter text-sm leading-relaxed text-black/60 md:text-base">
              Select upper and sole variants to preview your modular SCHAULT pair in 3D.
            </p>

            <Link
              href="/shop"
              className="inline-block border border-black/90 px-8 py-4 font-inter text-sm font-medium tracking-wide text-black/90 transition-all duration-300 hover:border-[#0350F0] hover:bg-[#0350F0] hover:text-white"
            >
              SHOP CURRENT COLLECTION
            </Link>
          </section>

          <section className="mt-12 grid gap-6 border border-black/10 bg-white p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-inter text-3xl tracking-wide text-black/90 sm:text-4xl">3D PREVIEW</h2>
                <span className="font-inter text-xs uppercase tracking-[0.18em] text-black/50">Live</span>
              </div>
              <div className="h-[420px] w-full border border-black/10 bg-[#0f2d1b]">
                <ThreeModelViewer
                  upperPath={selectedUpper.path}
                  solePath={selectedSole.path}
                  onLoadingChange={setIsSwitchingModel}
                />
              </div>
            </div>

            <div className="flex flex-col border border-black/10">
              <div className="flex border-b border-black/10">
                <button
                  onClick={() => setActiveTab("upper")}
                  className={`flex-1 px-4 py-3 font-inter text-sm font-semibold uppercase tracking-wide transition ${
                    activeTab === "upper"
                      ? "border-b-2 border-[#0350F0] bg-white text-black/90"
                      : "bg-gray-50 text-black/50 hover:bg-white"
                  }`}
                >
                  Upper
                </button>
                <button
                  onClick={() => setActiveTab("sole")}
                  className={`flex-1 px-4 py-3 font-inter text-sm font-semibold uppercase tracking-wide transition ${
                    activeTab === "sole"
                      ? "border-b-2 border-[#0B8F4D] bg-white text-black/90"
                      : "bg-gray-50 text-black/50 hover:bg-white"
                  }`}
                >
                  Sole <span className="text-[10px] lowercase text-amber-600 font-normal">(out of stock)</span>
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4">
                {activeTab === "upper" && (
                  <div className="grid grid-cols-3 gap-4">
                    {UPPER_MODELS.map((model) => (
                      <button
                        key={model.name}
                        disabled={isSwitchingModel}
                        onClick={() => setSelectedUpper(model)}
                        className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                          isSwitchingModel ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                        } ${
                          selectedUpper.name === model.name
                            ? "border-[#0350F0] bg-[#0350F0]/5"
                            : "border-black/10 hover:border-[#0350F0]/40"
                        }`}
                      >
                        <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-200/50 group-hover:bg-gray-200">
                          {model.image ? (
                            <img src={model.image} alt={model.name} className="h-full w-full object-contain p-2" />
                          ) : (
                            <span className="font-inter text-3xl font-bold text-black/30">{model.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="text-center font-inter text-xs font-medium text-black/80 flex flex-col items-center">
                          {model.name}
                          {model.isAvailable === false && (
                            <span className="text-[10px] lowercase text-amber-600 font-normal">(out of stock)</span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === "sole" && (
                  <div className="grid grid-cols-3 gap-4">
                    {SOLE_MODELS.map((model) => (
                      <button
                        key={model.name}
                        disabled={isSwitchingModel}
                        onClick={() => setSelectedSole(model)}
                        className={`group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${
                          isSwitchingModel ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                        } ${
                          selectedSole.name === model.name
                            ? "border-[#0B8F4D] bg-[#0B8F4D]/10"
                            : "border-black/10 hover:border-[#0B8F4D]/40"
                        }`}
                      >
                        <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-200/50 group-hover:bg-gray-200">
                          {model.image ? (
                            <img src={model.image} alt={model.name} className="h-full w-full object-contain p-2" />
                          ) : (
                            <span className="font-inter text-3xl font-bold text-black/30">{model.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="text-center font-inter text-xs font-medium text-black/80">{model.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
