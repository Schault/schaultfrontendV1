import React from "react";
import Link from "next/link";
import Image from "next/image";
import { OrderListItem } from "@/lib/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ArrowRight, Package, Calendar, FileText } from "lucide-react";

interface OrderCardProps {
  order: OrderListItem;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const shortOrderId = order.id.split("-")[0].toUpperCase();
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="group border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/30 hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Product Thumbnail + Main Info */}
        <div className="flex items-start gap-5">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border border-black/10 bg-zinc-50 p-2">
            {order.first_item_image ? (
              <Image
                src={order.first_item_image}
                alt={order.first_item_name || "Product Thumbnail"}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <Package size={24} />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-black/90">
                ORD-{shortOrderId}
              </span>
              {order.invoice_number && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                  <FileText size={10} /> {order.invoice_number}
                </span>
              )}
            </div>

            <p className="mt-1 font-inter text-xs text-black/60 line-clamp-1 font-medium">
              {order.first_item_name || "SCHAULT Product"}
              {order.item_count > 1 ? ` (+${order.item_count - 1} more)` : ""}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-inter">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-zinc-400" />
                Placed: {formattedDate}
              </span>
              <span>•</span>
              <span>{order.item_count} item{order.item_count !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Status Badges, Amount, & Action Button */}
        <div className="flex flex-wrap items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-4 pt-4 border-t border-black/5 lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} type="status" />
            <OrderStatusBadge status={order.payment_status} type="payment" />
          </div>

          <div className="flex items-baseline gap-2 lg:text-right">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Total</span>
            <span className="font-inter text-xl font-black text-black/90">
              ₹{order.total.toLocaleString("en-IN")}
            </span>
          </div>

          {formattedDelivery && (
            <span className="text-[11px] text-emerald-600 font-medium">
              Est. Delivery: {formattedDelivery}
            </span>
          )}

          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-[#0350F0] transition-colors group-hover:text-black"
          >
            View Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
