import React from "react";
import { TimelineEntry, OrderStatus } from "@/lib/types/order";
import { CheckCircle2, Clock, PackageCheck, Truck, MapPin, CheckCircle, XCircle } from "lucide-react";

interface OrderStatusTimelineProps {
  timeline: TimelineEntry[];
  currentStatus: OrderStatus;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: any }[] = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: PackageCheck },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ timeline, currentStatus }) => {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center space-x-4 border border-rose-200 bg-rose-50 p-6 text-rose-700 rounded-sm">
        <XCircle className="h-8 w-8 flex-shrink-0" />
        <div>
          <h3 className="font-inter text-lg font-bold uppercase tracking-widest">Order Cancelled</h3>
          <p className="text-xs font-inter mt-1">This order was cancelled. Contact support if you need assistance.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((step) => step.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 1 : currentIndex; // Default to confirmed if not matched

  return (
    <div className="py-6">
      {/* Desktop Horizontal Stepper */}
      <div className="relative hidden md:block">
        <div className="absolute top-6 left-10 right-10 h-0.5 bg-zinc-200" aria-hidden />
        
        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const entry = timeline.find((t) => t.status === step.key);
            const formattedTime = entry
              ? new Date(entry.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })
              : null;

            return (
              <div key={step.key} className="flex flex-col items-center z-10 w-28 text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    isCurrent
                      ? "bg-[#0350F0] text-white shadow-lg ring-4 ring-[#0350F0]/20"
                      : isCompleted
                      ? "bg-black text-white"
                      : "border-2 border-zinc-200 bg-white text-zinc-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>

                <p
                  className={`mt-3 font-inter text-xs font-bold uppercase tracking-wider ${
                    isCompleted ? "text-black/90" : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </p>

                {formattedTime && (
                  <span className="mt-1 font-mono text-[10px] text-zinc-500">{formattedTime}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="relative block md:hidden pl-6 space-y-6 border-l-2 border-zinc-200">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const entry = timeline.find((t) => t.status === step.key);

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full ${
                  isCurrent
                    ? "bg-[#0350F0] text-white"
                    : isCompleted
                    ? "bg-black text-white"
                    : "border border-zinc-200 bg-white text-zinc-400"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>

              <div>
                <p
                  className={`font-inter text-xs font-bold uppercase tracking-wider ${
                    isCompleted ? "text-black" : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </p>
                {entry && (
                  <p className="font-mono text-[10px] text-zinc-500 mt-0.5">
                    {new Date(entry.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {entry?.note && (
                  <p className="text-xs text-zinc-600 bg-zinc-50 p-2 border border-zinc-200 mt-2 rounded">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Status Note Banner */}
      {timeline.length > 0 && timeline[timeline.length - 1]?.note && (
        <div className="mt-8 border border-zinc-200 bg-zinc-50 p-4 text-xs font-inter">
          <span className="font-bold text-black uppercase tracking-wider mr-2">Status Update:</span>
          <span className="text-zinc-700">{timeline[timeline.length - 1].note}</span>
        </div>
      )}
    </div>
  );
};
