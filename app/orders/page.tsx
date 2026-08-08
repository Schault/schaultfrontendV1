import React from "react";
import { getOrders } from "@/lib/orders/getOrders";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyOrders } from "@/components/orders/EmptyOrders";

export const metadata = {
  title: "My Orders | SCHAULT Modular Footwear",
  description: "View and track your SCHAULT orders, status, and invoices.",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-black/10 pb-6 mb-8">
          <h1 className="font-inter text-2xl font-black uppercase tracking-[0.2em] text-black">
            MY ORDERS
          </h1>
          <p className="mt-1 font-inter text-xs text-zinc-500 tracking-wider">
            TRACK YOUR MODULAR FOOTWEAR DISPATCHES AND INVOICES
          </p>
        </div>

        {/* Orders List or Empty State */}
        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
