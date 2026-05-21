"use client";

import React from "react";


// 7. ANALYTICS VIEW SUB-COMPONENT (CUSTOM SVG CHARTS)
// ==========================================
interface AnalyticsViewProps {
  orders: any[];
  waitlist: any[];
  inventory: any[];
}

export default function AnalyticsView({ orders, waitlist, inventory }: AnalyticsViewProps) {
  // Precision SVG line coordinates generator
  const mockOrdersTrend = [
    { label: "05/11", value: 3 },
    { label: "05/12", value: 6 },
    { label: "05/13", value: 4 },
    { label: "05/14", value: 8 },
    { label: "05/15", value: 12 },
    { label: "05/16", value: 14 },
    { label: "05/17", value: 9 }
  ];

  const mockRevenueTrend = [
    { label: "05/11", value: 26997 },
    { label: "05/12", value: 53994 },
    { label: "05/13", value: 35996 },
    { label: "05/14", value: 71992 },
    { label: "05/15", value: 107988 },
    { label: "05/16", value: 125986 },
    { label: "05/17", value: 80991 }
  ];

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = 20;

  // Max calculations
  const maxOrderVal = Math.max(...mockOrdersTrend.map(t => t.value), 1);
  const maxRevenueVal = Math.max(...mockRevenueTrend.map(t => t.value), 1);

  // Line coordinates helper
  const orderPoints = mockOrdersTrend.map((t, idx) => {
    const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
    const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM ANALYTICS</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">OPERATIONAL PERFORMANCE & MONOCHROME DATA STREAMS</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Orders Line Chart */}
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            ORDERS STREAM (LAST 7 DAYS)
          </span>

          <div className="relative pt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grids */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = padding + p * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#e4e4e7"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Line */}
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                points={orderPoints}
              />
              {/* Dots */}
              {mockOrdersTrend.map((t, idx) => {
                const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
                const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
                return (
                  <g key={idx} className="group">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      stroke="black"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      fill="black"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      {t.value}
                    </text>
                  </g>
                );
              })}
              {/* X Axis Labels */}
              {mockOrdersTrend.map((t, idx) => {
                const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={height - 2}
                    fill="#a1a1aa"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="font-bold"
                  >
                    {t.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            REVENUE LOGS (LAST 7 DAYS)
          </span>

          <div className="relative pt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grids */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = padding + p * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#e4e4e7"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Bars */}
              {mockRevenueTrend.map((t, idx) => {
                const barWidth = 30;
                const x = padding + (idx / (mockRevenueTrend.length - 1)) * (width - padding * 2) - barWidth / 2;
                const barHeight = (t.value / maxRevenueVal) * (height - padding * 2);
                const y = height - padding - barHeight;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="#f4f4f5"
                      stroke="#a1a1aa"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="black"
                      fontSize="7"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      ₹{(t.value / 1000).toFixed(0)}K
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={height - 2}
                      fill="#a1a1aa"
                      fontSize="7"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Demographics & Demands Bento Split */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            TOP METRO CITIES BY VOLUME
          </span>
          <div className="space-y-2 font-semibold">
            {[
              { city: "BENGALURU, KA", share: "34%", orders: 48 },
              { city: "MUMBAI, MH", share: "28%", orders: 40 },
              { city: "NEW DELHI, DL", share: "18%", orders: 25 },
              { city: "HYDERABAD, TS", share: "12%", orders: 17 },
              { city: "CHENNAI, TN", share: "8%", orders: 11 }
            ].map((c, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-[#f4f4f5]">
                <span className="text-zinc-700">{c.city}</span>
                <span className="text-black">{c.orders} Orders ({c.share})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            DELIVERY PERFORMANCE CODES
          </span>
          <div className="space-y-3 pt-2">
            {[
              { label: "ON-TIME SHIPMENTS", value: "85.7%", color: "text-green-600" },
              { label: "DELAYED SHIPMENTS", value: "14.3%", color: "text-amber-600" },
              { label: "FAILED ATTEMPTS", value: "0.0%", color: "text-zinc-500" }
            ].map((perf, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold text-[10px]">{perf.label}</span>
                <span className={`font-black text-sm ${perf.color}`}>{perf.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            TOP-SELLING SKUs
          </span>
          <div className="space-y-2">
            {[
              { sku: "CD-01-BW", share: 44, label: "Midnight stealth Upper" },
              { sku: "CD-02-WO", share: 36, label: "White Outsole v1" },
              { sku: "CD-05-BO", share: 20, label: "Black Outsole v1" }
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-zinc-700">{s.sku} ({s.label.split(" ")[0]})</span>
                  <span className="text-black font-bold">{s.share}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1">
                  <div className="bg-black h-full" style={{ width: `${s.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
