"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// 3. Inventory Edit Modal
interface InventoryEditModalProps {
  skuItem: any;
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
  updateStockQuantity?: (variantId: string, newQuantity: number) => Promise<boolean>;
}

export default function InventoryEditModal({ skuItem, inventory, setInventory, onClose, updateStockQuantity }: InventoryEditModalProps) {
  const [qty, setQty] = useState(skuItem.quantity);
  const [threshold, setThreshold] = useState(skuItem.threshold);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    if (qty < 0 || threshold < 0) {
      toast.error("VALUES CANNOT BE NEGATIVE");
      return;
    }

    if (updateStockQuantity && qty !== skuItem.quantity) {
      // Persist quantity change to Supabase
      setIsSaving(true);
      const success = await updateStockQuantity(skuItem.id, qty);
      setIsSaving(false);
      if (!success) return; // Error toast handled inside updateStockQuantity

      // Update threshold locally (no backend column for this yet)
      if (threshold !== skuItem.threshold) {
        setInventory(prev => prev.map(sku => {
          if (sku.id === skuItem.id) return { ...sku, threshold };
          return sku;
        }));
      }
    } else {
      // Only threshold changed — update locally
      setInventory(prev => prev.map(sku => {
        if (sku.id === skuItem.id) {
          return { ...sku, quantity: qty, threshold };
        }
        return sku;
      }));
      toast.success(`INVENTORY PROTOCOLS APPLIED FOR SKU ${skuItem.sku}`);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 font-inter"
    >
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm bg-white border border-[#e4e4e7] p-6 z-10 space-y-6 shadow-xl rounded-none"
      >
        {/* Header */}
        <div className="border-b border-[#e4e4e7] pb-4 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">INVENTORY ADJUSTMENT</span>
            <span className="text-sm font-black text-black font-mono tracking-widest block mt-0.5">{skuItem.sku}</span>
          </div>
          <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
            <X size={14} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 font-mono text-[11px]">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">CURRENT QUANTITY IN WAREHOUSE</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">WARNING THRESHOLD LIMIT</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 border border-[#e4e4e7] hover:bg-zinc-50 text-zinc-500 hover:text-black font-extrabold text-[9px] tracking-[0.2em] py-3.5 transition-all uppercase bg-white shadow-sm"
          >
            CANCEL
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-1/2 bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.2em] py-3.5 transition-all uppercase shadow-md disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "SAVE QUANTITY"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
