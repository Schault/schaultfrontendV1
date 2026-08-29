"use client";

import React, { useMemo } from "react";

// ==========================================
// ANALYTICS VIEW SUB-COMPONENT (DYNAMIC SVG CHARTS)
// ==========================================
interface AnalyticsViewProps {
  orders: any[];
  waitlist: any[];
  inventory: any[];
}

export default function AnalyticsView({ orders, waitlist, inventory }: AnalyticsViewProps) {
  // Compute last 7 days order count & revenue trend dynamically
  const { ordersTrend, revenueTrend } = useMemo(() => {
    const dateMap: Record<string, { count: number; revenue: number; label: string }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      dateMap[key] = { count: 0, revenue: 0, label };
    }

    orders.forEach((order) => {
      if (!order.created_at) return;
      const key = new Date(order.created_at).toISOString().split("T")[0];
      if (dateMap[key]) {
        dateMap[key].count += 1;
        dateMap[key].revenue += Number(order.total) || 0;
      }
    });

    const oTrend = Object.values(dateMap).map((d) => ({ label: d.label, value: d.count }));
    const rTrend = Object.values(dateMap).map((d) => ({ label: d.label, value: d.revenue }));

    return { ordersTrend: oTrend, revenueTrend: rTrend };
  }, [orders]);

  // Compute top metro cities from order shipping addresses
  const topCities = useMemo(() => {
    const cityCounts: Record<string, number> = {};
    orders.forEach((order) => {
      const addr = order.customer?.address || "";
      const parts = addr.split(",").map((s: string) => s.trim()).filter(Boolean);
      const city = parts.length > 1 ? parts[parts.length - 2] : parts[0] || "";
      if (city && city !== "N/A") {
        const uppercaseCity = city.toUpperCase();
        cityCounts[uppercaseCity] = (cityCounts[uppercaseCity] || 0) + 1;
      }
    });

    const totalWithCity = Object.values(cityCounts).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({
        city,
        orders: count,
        share: `${Math.round((count / totalWithCity) * 100)}%`,
      }));

    return sorted.length > 0 ? sorted : [];
  }, [orders]);

  // Compute delivery performance dynamically
  const deliveryPerformance = useMemo(() => {
    if (orders.length === 0) {
      return [
        { label: "ON-TIME SHIPMENTS", value: "0.0%", color: "text-zinc-500" },
        { label: "DELAYED SHIPMENTS", value: "0.0%", color: "text-zinc-500" },
        { label: "FAILED ATTEMPTS", value: "0.0%", color: "text-zinc-500" },
      ];
    }
    const total = orders.length;
    const delayed = orders.filter((o) => o.tracking?.status === "Delayed").length;
    const failed = orders.filter((o) => o.fulfillment_status === "Cancelled").length;
    const onTime = Math.max(0, total - delayed - failed);

    return [
      { label: "ON-TIME SHIPMENTS", value: `${((onTime / total) * 100).toFixed(1)}%`, color: "text-green-600" },
      { label: "DELAYED SHIPMENTS", value: `${((delayed / total) * 100).toFixed(1)}%`, color: "text-amber-600" },
      { label: "FAILED ATTEMPTS", value: `${((failed / total) * 100).toFixed(1)}%`, color: "text-red-600" },
    ];
  }, [orders]);

  // Compute top selling SKUs from products in orders
  const topSkus = useMemo(() => {
    const skuMap: Record<string, { count: number; name: string }> = {};
    orders.forEach((order) => {
      (order.products || []).forEach((p: any) => {
        const key = p.sku || p.name || "Unknown SKU";
        if (!skuMap[key]) skuMap[key] = { count: 0, name: p.name || key };
        skuMap[key].count += p.quantity || 1;
      });
    });

    const totalQty = Object.values(skuMap).reduce((sum, item) => sum + item.count, 0) || 1;
    return Object.entries(skuMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([sku, item]) => ({
        sku,
        label: item.name,
        share: Math.round((item.count / totalQty) * 100),
      }));
  }, [orders]);

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = 20;

  const maxOrderVal = Math.max(...ordersTrend.map((t) => t.value), 1);
  const maxRevenueVal = Math.max(...revenueTrend.map((t) => t.value), 1);

  const orderPoints = ordersTrend
    .map((t, idx) => {
      const x = padding + (idx / Math.max(1, ordersTrend.length - 1)) * (width - padding * 2);
      const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

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
              <polyline fill="none" stroke="black" strokeWidth="2.5" points={orderPoints} />
              {ordersTrend.map((t, idx) => {
                const x = padding + (idx / Math.max(1, ordersTrend.length - 1)) * (width - padding * 2);
                const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
                return (
                  <g key={idx} className="group">
                    <circle cx={x} cy={y} r="4" fill="white" stroke="black" strokeWidth="2" />
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
              {ordersTrend.map((t, idx) => {
                const x = padding + (idx / Math.max(1, ordersTrend.length - 1)) * (width - padding * 2);
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
              {revenueTrend.map((t, idx) => {
                const barWidth = 30;
                const x = padding + (idx / Math.max(1, revenueTrend.length - 1)) * (width - padding * 2) - barWidth / 2;
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
                      ₹{t.value >= 1000 ? `${(t.value / 1000).toFixed(0)}K` : t.value}
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
            TOP CITIES BY VOLUME
          </span>
          <div className="space-y-2 font-semibold">
            {topCities.length === 0 ? (
              <div className="py-4 text-center text-zinc-400 font-mono text-[10px]">NO REGIONAL ORDER DATA</div>
            ) : (
              topCities.map((c, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#f4f4f5]">
                  <span className="text-zinc-700">{c.city}</span>
                  <span className="text-black">{c.orders} Orders ({c.share})</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            DELIVERY PERFORMANCE CODES
          </span>
          <div className="space-y-3 pt-2">
            {deliveryPerformance.map((perf, idx) => (
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
            {topSkus.length === 0 ? (
              <div className="py-4 text-center text-zinc-400 font-mono text-[10px]">NO ITEM PRODUCT DATA</div>
            ) : (
              topSkus.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold text-zinc-700">{s.sku}</span>
                    <span className="text-black font-bold">{s.share}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1">
                    <div className="bg-black h-full" style={{ width: `${s.share}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

