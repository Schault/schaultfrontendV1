import { OrderStatus } from "@/lib/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let displayLabel = status.replace(/_/g, " ").toUpperCase();

  switch (status) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "confirmed":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "processing":
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-800";
      break;
    case "shipped":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
    case "out_for_delivery":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;
    case "delivered":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${bgColor} ${textColor}`}
    >
      {displayLabel}
    </span>
  );
}
