"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface SettingsViewProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
}

export default function SettingsView({ settings, setSettings }: SettingsViewProps) {
  const [gstNum, setGstNum] = useState(settings.store.gst);
  const [storeAddress, setStoreAddress] = useState(settings.store.address);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    setSettings((prev: any) => ({
      ...prev,
      store: {
        ...prev.store,
        gst: gstNum.trim().toUpperCase(),
        address: storeAddress.trim()
      }
    }));

    toast.success("SYSTEM PARAMETERS REGISTERED SUCCESSFUL");
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM CONFIGURATION</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">STORE SETTINGS & API CONNECTIONS</p>
      </div>

      <form onSubmit={handleSaveSettings} className="border border-[#e4e4e7] bg-white p-8 space-y-8 font-mono text-[11px] shadow-sm">

        {/* GST & Invoicing detail section */}
        <div className="space-y-4">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-3">
            GST & REGISTRATION PARAMETERS
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">GSTIN / TAX IDENTIFIER</label>
              <input
                type="text"
                value={gstNum}
                onChange={(e) => setGstNum(e.target.value)}
                className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">REGISTERED TRADE NAME</label>
              <input
                type="text"
                disabled
                value={settings.store.name}
                className="w-full bg-zinc-50 border border-[#e4e4e7] px-4 py-2.5 text-xs text-zinc-400 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">CORRESPONDENCE PHYSICAL ADDRESS</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-3 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>
        </div>

        {/* Carrier keys configuration */}
        <div className="space-y-3">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-3">
            LOGISTICS API ENCRYPTION KEYS
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["Delhivery Key", "Bluedart Token", "Shiprocket Webhook"].map((carrier, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{carrier}</label>
                <input
                  type="password"
                  value="••••••••••••••••••••••••"
                  disabled
                  className="w-full bg-zinc-50 border border-[#e4e4e7] px-4 py-2.5 text-xs text-zinc-400 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.25em] py-3.5 transition-all uppercase"
        >
          COMMIT SYSTEM MODIFICATIONS
        </button>
      </form>
    </div>
  );
}
