"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Footprints } from "lucide-react";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_DATA = [
  { uk: "4", french: "37", length: "233.3" },
  { uk: "5", french: "38", length: "240.0" },
  { uk: "6", french: "39", length: "246.7" },
  { uk: "7", french: "41", length: "260.0" },
  { uk: "8", french: "42", length: "266.7" },
  { uk: "9", french: "43", length: "273.3" },
  { uk: "10", french: "44.5", length: "283.3" },
  { uk: "11", french: "46", length: "293.3" },
];

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-black shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10 bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <Ruler className="text-[#CC0000]" size={20} />
                <h2 className="font-bebas text-2xl tracking-wide text-black/90">SIZE GUIDE</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/50 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 custom-scrollbar">
              
              {/* Grading Note */}
              <div className="bg-[#CC0000]/5 border-l-4 border-[#CC0000] p-4">
                <p className="font-inter text-xs text-black/70 leading-relaxed uppercase tracking-wider font-semibold">
                  Note: Values are calculated based on the standard French grading of <span className="text-[#CC0000]">6.67mm</span> (Paris Points).
                </p>
              </div>

              {/* Table */}
              <div className="space-y-4">
                <h3 className="font-bebas text-xl tracking-widest text-black/80 flex items-center gap-2">
                  CONVERSION TABLE
                </h3>
                <div className="border border-black/10 overflow-hidden">
                  <table className="w-full text-left font-inter border-collapse">
                    <thead>
                      <tr className="bg-black text-white text-[9px] uppercase tracking-[0.2em]">
                        <th className="px-3 py-2.5 font-medium">UK Size</th>
                        <th className="px-3 py-2.5 font-medium">French (EU)</th>
                        <th className="px-3 py-2.5 font-medium">Foot Length (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] divide-y divide-black/5">
                      {SIZE_DATA.map((row) => (
                        <tr key={row.uk} className="hover:bg-black/5 transition-colors">
                          <td className="px-3 py-2.5 font-bold text-black/90">{row.uk}</td>
                          <td className="px-3 py-2.5 text-black/70">{row.french}</td>
                          <td className="px-3 py-2.5 text-black/70 font-mono">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to Measure */}
              <div className="space-y-6 pt-4 border-t border-black/5">
                <h3 className="font-bebas text-xl tracking-widest text-black/80 flex items-center gap-2">
                  <Footprints size={20} className="text-[#CC0000]" />
                  HOW TO MEASURE
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: "01", title: "PREPARE", desc: "Place a piece of paper on the floor against a flat wall." },
                    { step: "02", title: "STEP", desc: "Stand on the paper with your heel firmly against the wall." },
                    { step: "03", title: "MARK", desc: "Mark the longest part of your foot and measure the distance." }
                  ].map((item) => (
                    <div key={item.step} className="space-y-2">
                      <span className="font-bebas text-2xl text-[#CC0000]/30">{item.step}</span>
                      <h4 className="font-bebas text-lg tracking-wide text-black/90">{item.title}</h4>
                      <p className="font-inter text-xs text-black/50 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="bg-black/5 p-4 font-inter text-[10px] text-black/40 italic text-center text-balance">
                  Tip: Wear the socks you intend to use with the shoes and measure in the afternoon for the best fit.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-black/5 bg-[#FAFAFA] flex justify-end">
              <button 
                onClick={onClose}
                className="bg-black text-white font-bebas text-base px-8 py-2.5 tracking-widest hover:bg-[#CC0000] transition-colors"
              >
                GOT IT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
