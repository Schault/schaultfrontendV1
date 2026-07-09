"use client";

import React, { useState } from "react";
import { OrderListItem } from "@/lib/types/order";
import Link from "next/link";

interface ProfileClientProps {
  user: {
    email?: string;
    fullName: string;
  };
  orders: OrderListItem[];
  signOut: () => Promise<void>;
}

export default function ProfileClient({ user, orders, signOut }: ProfileClientProps) {
  const [ordersList, setOrdersList] = useState<OrderListItem[]>(orders);

  const loadDemoOrder = () => {
    const demoOrder: OrderListItem = {
      id: "demo-track-991",
      status: "shipped",
      total: 18999,
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      item_count: 1
    };
    setOrdersList([demoOrder]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="font-inter">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6 mb-12">
        <div>
          <h1 className="text-4xl font-light uppercase tracking-wider text-black">
            HELLO, {user.fullName}
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2">
            {user.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-6 md:mt-0 px-6 py-2.5 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300 bg-transparent text-black"
        >
          SIGN OUT
        </button>
      </div>

      {/* Order History */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-6 bg-[#0350F0]" />
          <h2 className="text-lg font-black uppercase tracking-widest text-black">
            ORDER HISTORY
          </h2>
        </div>

        {ordersList.length === 0 ? (
          <div className="border border-black/5 bg-zinc-50/50 p-12 text-center space-y-4">
            <p className="text-zinc-500 text-xs tracking-wider uppercase font-mono">
              NO ORDERS PLACED YET
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/shop"
                className="inline-block border border-black bg-black text-white hover:bg-white hover:text-black transition-colors py-2 px-6 text-[9px] font-black tracking-widest uppercase"
              >
                BROWSE COLLECTION
              </Link>
              <button
                onClick={loadDemoOrder}
                className="inline-block border border-black/20 hover:border-black bg-white text-black transition-colors py-2 px-6 text-[9px] font-black tracking-widest uppercase"
              >
                LOAD DEMO ORDER TRACKING (FOR TESTING)
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-black/10 divide-y divide-black/10 bg-white">
            {ordersList.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="p-6 hover:bg-zinc-50/80 cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group border-b border-black/10 last:border-b-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-black tracking-widest uppercase font-mono group-hover:underline">
                      ORDER #{order.id.split("-")[0].toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-[8px] font-black border uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    PLACED ON {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 font-mono">
                  <div className="text-left md:text-right">
                    <span className="text-zinc-400 block text-[8px] tracking-widest uppercase">ITEMS</span>
                    <span className="text-xs font-bold text-zinc-700 block">{order.item_count} SKU(S)</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-zinc-400 block text-[8px] tracking-widest uppercase">TOTAL AMOUNT</span>
                    <span className="text-xs font-black text-black block">₹{order.total.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-[#0350F0] font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-200 pl-4 select-none shrink-0 hidden md:inline-block">
                    TRACK SHIPMENT →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
