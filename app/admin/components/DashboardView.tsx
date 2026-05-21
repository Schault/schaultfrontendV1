"use client";

import React, { useMemo } from "react";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { getStatusColor } from "../lib/status-utils";

interface DashboardViewProps {
  stats: any;
  orders: any[];
  waitlist: any[];
  lowStock: any[];
  todayWaitlist: number;
  setSelectedOrderId: (id: string) => void;
  changeTab: (tab: string) => void;
}

export default function DashboardView({ stats, orders, waitlist, lowStock, todayWaitlist, setSelectedOrderId, changeTab }: DashboardViewProps) {
  const lastFiveOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  // Dynamic conversion rate
  const conversionRate = useMemo(() => {
    if (waitlist.length === 0) return "0.0";
    const converted = waitlist.filter((w: any) => w.notified_status === "Converted to Order").length;
    return ((converted / waitlist.length) * 100).toFixed(1);
  }, [waitlist]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM COMMAND CENTER</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">REAL-TIME OVERVIEW & METRICS</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "TOTAL ORDERS", value: stats.totalOrders, color: "border-[#e4e4e7]" },
          { label: "IN TRANSIT", value: stats.inTransit, color: "border-[#e4e4e7]", highlight: stats.inTransit > 0 ? "text-amber-600" : "text-black" },
          { label: "DELIVERED", value: stats.delivered, color: "border-[#e4e4e7]", highlight: "text-green-600" },
          { label: "WAITLIST SIZE", value: stats.waitlist, color: "border-[#e4e4e7]" },
          { label: "GROSS REVENUE", value: `₹${stats.revenue.toLocaleString()}`, color: "border-[#e4e4e7] col-span-1 sm:col-span-2 lg:col-span-1" }
        ].map((card, i) => (
          <div key={i} className={`border ${card.color} bg-white p-6 rounded-none flex flex-col justify-between shadow-sm`}>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">{card.label}</span>
            <span className={`text-2xl font-black tracking-tight mt-4 block ${card.highlight || "text-black"}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Two-Column Bento Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Last 5 Orders Table */}
        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none lg:col-span-2 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
            <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase">LATEST TRANSACTIONS</span>
            <button
              onClick={() => changeTab("orders")}
              className="text-[9px] font-bold tracking-[0.15em] text-zinc-500 hover:text-black uppercase flex items-center gap-1.5"
            >
              VIEW ALL <ChevronRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#e4e4e7] text-zinc-500 font-semibold uppercase tracking-[0.1em] text-[10px]">
                  <th className="pb-3 pr-4">ORDER ID</th>
                  <th className="pb-3 pr-4">CUSTOMER</th>
                  <th className="pb-3 pr-4">STATUS</th>
                  <th className="pb-3 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {lastFiveOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-400 tracking-widest uppercase font-mono text-xs">
                      NO ORDERS LOADED YET
                    </td>
                  </tr>
                ) : (
                  lastFiveOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-[#fafafa]">
                      <td className="py-3 pr-4 font-bold text-black">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="hover:underline text-left text-xs text-black uppercase font-black"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="py-3 pr-4 text-zinc-600 font-sans font-medium text-xs">{order.customer.name}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2 py-0.5 text-[8px] font-black uppercase ${getStatusColor(order.fulfillment_status)}`}>
                          {order.fulfillment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-black font-bold">₹{order.total.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operations Alerts */}
        <div className="space-y-6 lg:col-span-1">
          {/* Low Stock Alerts */}
          <div className="border border-[#e4e4e7] bg-white p-6 rounded-none space-y-4 h-full shadow-sm">
            <div className="border-b border-[#e4e4e7] pb-4 flex items-center justify-between">
              <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" /> INVENTORY ALERTS
              </span>
              {lowStock.length > 0 && (
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 text-[8px] font-black font-mono">
                  {lowStock.length} CRITICAL
                </span>
              )}
            </div>

            {lowStock.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400 tracking-widest uppercase font-mono">
                ALL SKUs ABOVE MINIMUM THRESHOLDS
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {lowStock.map((sku) => (
                  <div key={sku.id} className="flex items-center justify-between border border-[#e4e4e7] p-3 bg-[#fafafa] font-mono">
                    <div>
                      <span className="text-[10px] font-black text-black block">{sku.sku}</span>
                      <span className="text-[9px] text-[#71717a] block truncate max-w-[160px] font-sans">{sku.product_name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black block ${sku.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                        STOCK: {sku.quantity}
                      </span>
                      <span className="text-[8px] text-zinc-400 block">LIMIT: {sku.threshold}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => changeTab("inventory")}
              className="w-full mt-4 bg-black hover:bg-zinc-800 text-white text-[9px] font-extrabold tracking-[0.2em] py-3 transition-all uppercase text-center block"
            >
              MANAGE STOCK
            </button>
          </div>
        </div>
      </div>

      {/* Bottom quick stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">TODAY&apos;S WAITLIST LEADS</span>
            <span className="text-xl font-black text-black mt-1 block">{todayWaitlist} SIGN-UPS</span>
          </div>
          <button
            onClick={() => changeTab("waitlist")}
            className="text-[9px] font-extrabold tracking-[0.15em] border border-[#e4e4e7] hover:border-black px-3 py-2 transition-all uppercase font-sans text-zinc-500 hover:text-black"
          >
            MANAGE
          </button>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">WAITLIST CONVERSION RATE</span>
            <span className="text-xl font-black text-green-600 mt-1 block">{conversionRate}%</span>
          </div>
          <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 uppercase tracking-widest font-mono">
            {parseFloat(conversionRate) >= 10 ? "HEALTHY" : "LOW"}
          </span>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">ACTIVE SHIPMENT CARRIERS</span>
            <span className="text-xl font-black text-black mt-1 block">DELHIVERY, BLUEDART</span>
          </div>
          <span className="text-[8px] font-black bg-zinc-100 text-zinc-600 px-1.5 py-0.5 uppercase tracking-widest font-mono">DOMESTIC</span>
        </div>
      </div>
    </div>
  );
}
