"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { getValidNextStatuses } from "../lib/status-utils";

// 1. Order Detail Drawer
interface OrderDetailDrawerProps {
  orderId: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
  updateOrderStatus?: (orderId: string, newStatus: string, note?: string) => Promise<boolean>;
}

export default function OrderDetailDrawer({ orderId, orders, setOrders, onClose, updateOrderStatus }: OrderDetailDrawerProps) {
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const [internalNotes, setInternalNotes] = useState(order?.notes || "");
  const [fulfillmentState, setFulfillmentState] = useState(order?.fulfillment_status || "Processing");
  const [paymentState, setPaymentState] = useState(order?.payment_status || "Pending");
  const [isSaving, setIsSaving] = useState(false);

  // Save detailed manual override changes
  const handleSaveDetails = async () => {
    // If fulfillment status changed, persist to database via edge function
    if (updateOrderStatus && fulfillmentState !== order?.fulfillment_status) {
      setIsSaving(true);
      const success = await updateOrderStatus(orderId, fulfillmentState, internalNotes.trim() || undefined);
      setIsSaving(false);
      if (!success) return; // Error toast is handled inside updateOrderStatus
    } else {
      // Only local fields changed (notes, payment) — update local state
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            payment_status: paymentState,
            notes: internalNotes.trim(),
          };
        }
        return o;
      }));
      toast.success(`ORDER OVERRIDES COMMITTED FOR ${orderId}`);
    }
    onClose();
  };

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex justify-end font-inter"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="w-full max-w-xl bg-white border-l border-[#e4e4e7] h-full z-10 flex flex-col justify-between overflow-y-auto shadow-xl"
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">TRANSACTION METADATA</span>
              <span className="text-lg font-black tracking-widest text-black font-mono uppercase block mt-1">{order.id}</span>
            </div>
            <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="space-y-2 border border-[#e4e4e7] p-4 bg-zinc-50">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">CUSTOMER DOSSIER</span>
              <div className="space-y-1 text-xs">
                <div className="text-black font-bold text-sm">{order.customer.name}</div>
                <div className="text-zinc-500 font-mono">{order.customer.phone}</div>
                <div className="text-zinc-500 font-mono">{order.customer.email}</div>
                <div className="text-zinc-700 leading-relaxed mt-2 pt-2 border-t border-[#e4e4e7]">{order.customer.address}</div>
              </div>
            </div>

            {/* Modular Items Breakdown */}
            <div className="space-y-3">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">ORDERED MODULAR ITEMS</span>
              <div className="space-y-2.5">
                {order.products.map((p: any, idx: number) => (
                  <div key={idx} className="border border-[#e4e4e7] p-3 bg-white flex items-center justify-between font-mono text-[11px] shadow-sm">
                    <div>
                      <span className="text-black font-bold text-xs block font-sans">{p.name}</span>
                      <span className="text-zinc-500 block font-semibold uppercase mt-0.5">SIZE: {p.size} • COLOR: {p.color}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-black font-bold block">₹{p.price.toLocaleString()}</span>
                      <span className="text-zinc-500 block">QTY: {p.quantity}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e4e4e7] pt-3 text-xs font-mono">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest">NET PAYABLE AMOUNT:</span>
                  <span className="text-black font-black text-sm">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipment details */}
            <div className="space-y-2 border border-[#e4e4e7] p-4 bg-zinc-50 font-mono text-xs">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">COURIER DISPATCH METRICS</span>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px]">PARTNER CARRIER:</span>
                  <span className="text-black font-bold block mt-0.5">{order.tracking.courier || "AWAITING"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px]">AWB BILLING NO:</span>
                  <span className="text-black font-bold block mt-0.5">{order.tracking.awb || "UNASSIGNED"}</span>
                </div>
              </div>
            </div>

            {/* Status Overrides */}
            <div className="space-y-4 border border-[#e4e4e7] p-4 bg-zinc-50">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">MANUAL STATUS OVERRIDES</span>
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold block uppercase tracking-widest">PAYMENT STATE</label>
                  <select
                    value={paymentState}
                    onChange={(e) => setPaymentState(e.target.value)}
                    className="w-full bg-white border border-[#e4e4e7] px-3 py-2 text-black outline-none w-full uppercase focus:border-black shadow-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold block uppercase tracking-widest">FULFILLMENT STAGE</label>
                  {(() => {
                    const validNext = getValidNextStatuses(order?.fulfillment_status || "Pending");
                    const isTerminal = validNext.length === 0;
                    return (
                      <select
                        value={fulfillmentState}
                        onChange={(e) => setFulfillmentState(e.target.value)}
                        disabled={isTerminal}
                        className="w-full bg-white border border-[#e4e4e7] px-3 py-2 text-black outline-none uppercase focus:border-black shadow-sm disabled:bg-zinc-50 disabled:text-zinc-400"
                      >
                        <option value={order?.fulfillment_status}>{order?.fulfillment_status} (CURRENT)</option>
                        {validNext.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    );
                  })()}
                  {getValidNextStatuses(order?.fulfillment_status || "Pending").length === 0 && (
                    <span className="text-[8px] text-zinc-400 uppercase tracking-widest">NO FURTHER TRANSITIONS AVAILABLE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Internal Team Notes */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase block font-mono">INTERNAL DISPATCH NOTES</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="WRITE SECURE INTERNAL NOTE FOR WAREHOUSE PACKERS..."
                rows={3}
                className="w-full bg-white border border-[#e4e4e7] text-xs p-3 text-black outline-none focus:border-black placeholder-[#a1a1aa] uppercase font-sans shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-6 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            onClick={handleSaveDetails}
            disabled={isSaving}
            className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-[0.25em] py-3.5 transition-all uppercase shadow-md disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "COMMIT DETAILS CHANGES"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
