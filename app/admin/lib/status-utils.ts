// ============================================================
// Status Utilities — synced with backend transition_order_status()
// Backend statuses: pending, confirmed, processing, shipped,
//                   out_for_delivery, delivered, cancelled
// ============================================================

// All valid backend statuses
export const BACKEND_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type BackendStatus = (typeof BACKEND_STATUSES)[number];

// 1:1 mapping — Backend → Frontend display label
const BACKEND_TO_FRONTEND: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// 1:1 mapping — Frontend display label → Backend status
const FRONTEND_TO_BACKEND: Record<string, string> = {
  Pending: "pending",
  Confirmed: "confirmed",
  Processing: "processing",
  Shipped: "shipped",
  "Out for Delivery": "out_for_delivery",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

// Valid transitions — mirrored from transition_order_status() in
// 20240413000000_schema_and_integrity_fixes.sql
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

/** Convert a backend status to a frontend display label */
export const mapStatusToFrontend = (backendStatus: string): string => {
  return BACKEND_TO_FRONTEND[backendStatus] || backendStatus;
};

/** Convert a frontend display label to a backend status */
export const mapStatusToBackend = (frontendStatus: string): string => {
  return FRONTEND_TO_BACKEND[frontendStatus] || frontendStatus.toLowerCase();
};

/**
 * Get valid next frontend status labels for a given current frontend status.
 * Returns only the statuses that the backend will accept as a transition.
 */
export const getValidNextStatuses = (currentFrontendStatus: string): string[] => {
  const backendStatus = mapStatusToBackend(currentFrontendStatus);
  const validBackend = VALID_TRANSITIONS[backendStatus] || [];
  return validBackend.map(mapStatusToFrontend);
};

/**
 * Color class for a status badge.
 */
export const getStatusColor = (frontendStatus: string): string => {
  switch (frontendStatus) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Pending":
    case "Confirmed":
      return "bg-zinc-100 text-zinc-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
    case "Out for Delivery":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};
