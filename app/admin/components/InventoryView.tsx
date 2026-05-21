"use client";

import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import toast from "react-hot-toast";

interface InventoryViewProps {
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  setEditSku: (sku: any) => void;
  updateStockQuantity?: (variantId: string, newQuantity: number) => Promise<boolean>;
}

export default function InventoryView({ inventory, setInventory, setEditSku, updateStockQuantity }: InventoryViewProps) {
  const [restockSku, setRestockSku] = useState("");
  const [restockQty, setRestockQty] = useState(0);
  const [isRestocking, setIsRestocking] = useState(false);

  const handleBulkRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockSku) { toast.error("PLEASE SELECT AN ACTIVE SKU"); return; }
    if (restockQty <= 0) { toast.error("INVALID QUANTITY VALUE"); return; }

    const targetSku = inventory.find(sku => sku.sku === restockSku);
    if (!targetSku) { toast.error("SKU NOT FOUND"); return; }

    if (updateStockQuantity) {
      setIsRestocking(true);
      const newQty = targetSku.quantity + restockQty;
      const success = await updateStockQuantity(targetSku.id, newQty);
      setIsRestocking(false);
      if (success) {
        setRestockSku("");
        setRestockQty(0);
      }
    } else {
      // Fallback to local state mutation
      setInventory(prev => prev.map(sku => {
        if (sku.sku === restockSku) return { ...sku, quantity: sku.quantity + restockQty, restocked_at: new Date().toISOString().split('T')[0] };
        return sku;
      }));
      toast.success(`INVENTORY RESTOCKED FOR SKU ${restockSku}: +${restockQty} UNITS`);
      setRestockSku("");
      setRestockQty(0);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">INVENTORY LOGISTICS</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">PRODUCT STOCK LEVELS & REORDER SYSTEMS</p>
        </div>
        <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                  <th className="p-4">SKU CODE</th><th className="p-4">ITEM NAME</th><th className="p-4">VARIANT SPEC</th><th className="p-4 text-center">QUANTITY</th><th className="p-4 text-center">THRESHOLD</th><th className="p-4 text-center">STATUS</th><th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {inventory.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-zinc-400 tracking-widest uppercase font-mono text-xs">NO INVENTORY DATA LOADED</td></tr>
                ) : (
                  inventory.map((sku) => {
                    const isCritical = sku.quantity === 0;
                    const isLow = sku.quantity <= 5 && sku.quantity > 0;
                    return (
                      <tr key={sku.id} className={`hover:bg-[#fafafa] ${isCritical ? "bg-red-50/20" : ""}`}>
                        <td className="p-4 font-bold text-black text-xs">{sku.sku}</td>
                        <td className="p-4 font-sans font-semibold text-black text-xs">{sku.product_name}</td>
                        <td className="p-4 text-zinc-500 font-sans">{sku.variant}</td>
                        <td className="p-4 text-center font-bold text-black text-xs">{sku.quantity}</td>
                        <td className="p-4 text-center text-zinc-500 font-bold">{sku.threshold}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${isCritical ? "bg-red-100 text-red-700" : isLow ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                            {isCritical ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "OK"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => setEditSku(sku)} className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white shadow-sm"><Edit2 size={11} /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-1">
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-6 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">INVENTORY RESTOCK PANEL</span>
          <form onSubmit={handleBulkRestock} className="space-y-5 font-mono text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">SELECT ACTIVE SKU</label>
              <select value={restockSku} onChange={(e) => setRestockSku(e.target.value)} className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-wider px-3 py-2.5 text-black outline-none uppercase focus:border-black">
                <option value="">CHOOSE SKU CODE</option>
                {inventory.map(sku => (<option key={sku.id} value={sku.sku}>{sku.sku} ({sku.product_name.split(" ")[0]})</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">RESTOCK QUANTITY (UNITS)</label>
              <input type="number" min="1" placeholder="UNITS COUNT" value={restockQty || ""} onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-wider px-4 py-2.5 text-black outline-none placeholder-[#a1a1aa] font-mono focus:border-black" />
            </div>
            <button type="submit" disabled={isRestocking} className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.25em] py-3.5 transition-all uppercase disabled:opacity-50">
              {isRestocking ? "UPDATING..." : "SAVE INVENTORY LEVEL"}
            </button>
          </form>
        </div>
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">THRESHOLD LOG PROTOCOL</span>
          <p className="text-[10px] leading-relaxed text-zinc-500 uppercase tracking-[0.05em]">SYSTEM AUTOMATICALLY DISPATCHES ALERT CORRESPONDENCE TO WHITELISTED ADMINS WHEN SKU VALUES LOWER BEYOND THEIR SET CONFIGURATIONS.</p>
        </div>
      </div>
    </div>
  );
}
