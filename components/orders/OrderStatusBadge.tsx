import { OrderStatus } from "@/lib/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  type?: "status" | "payment";
}

export function OrderStatusBadge({ status, type = "status" }: OrderStatusBadgeProps) {
  let bgColor = "bg-zinc-100";
  let textColor = "text-zinc-800";
  let displayLabel = String(status || "").replace(/_/g, " ").toUpperCase();

  if (type === "payment") {
    const s = String(status).toLowerCase();
    if (s === "paid") {
      bgColor = "bg-emerald-50 border border-emerald-200";
      textColor = "text-emerald-700";
    } else if (s === "refunded") {
      bgColor = "bg-rose-50 border border-rose-200";
      textColor = "text-rose-700";
    } else {
      bgColor = "bg-amber-50 border border-amber-200";
      textColor = "text-amber-700";
    }
  } else {
    switch (status) {
      case "pending":
        bgColor = "bg-amber-50 border border-amber-200";
        textColor = "text-amber-700";
        break;
      case "confirmed":
        bgColor = "bg-blue-50 border border-blue-200";
        textColor = "text-blue-700";
        break;
      case "processing":
        bgColor = "bg-indigo-50 border border-indigo-200";
        textColor = "text-indigo-700";
        break;
      case "shipped":
        bgColor = "bg-purple-50 border border-purple-200";
        textColor = "text-purple-700";
        break;
      case "out_for_delivery":
        bgColor = "bg-orange-50 border border-orange-200";
        textColor = "text-orange-700";
        break;
      case "delivered":
        bgColor = "bg-emerald-50 border border-emerald-200";
        textColor = "text-emerald-700";
        break;
      case "cancelled":
        bgColor = "bg-rose-50 border border-rose-200";
        textColor = "text-rose-700";
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${bgColor} ${textColor}`}
    >
      {displayLabel}
    </span>
  );
}
