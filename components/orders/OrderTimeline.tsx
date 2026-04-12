import { TimelineEntry, OrderStatus } from "@/lib/types/order";
import { CheckCircle, Package, Truck, MapPin, Home, XCircle } from "lucide-react";

interface OrderTimelineProps {
  timeline: TimelineEntry[];
  currentStatus: OrderStatus;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: any }[] = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export function OrderTimeline({ timeline, currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center space-x-4 text-schlaut-red p-6 border border-black/10">
        <XCircle className="w-8 h-8" />
        <div>
          <h3 className="font-bebas text-xl uppercase tracking-widest">Order Cancelled</h3>
          <p className="text-sm font-inter">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  // Find the index of the current status in our linear progression
  const currentIndex = STATUS_STEPS.findIndex(step => step.key === currentStatus);
  
  return (
    <div className="py-8">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-black/10 md:hidden" />
        <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-black/10" />

        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 relative">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            // Find if there's a timeline entry for this step
            const entry = timeline.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex md:flex-col items-center md:items-center relative z-10 w-full md:w-auto px-4 md:px-0">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                    ${isCurrent ? 'bg-black text-white' : 
                      isCompleted ? 'bg-black/90 text-white' : 'bg-white border-2 border-black/10 text-black/30'}`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                
                <div className="ml-4 md:ml-0 md:mt-4 text-left md:text-center flex-1">
                  <p className={`font-bebas text-lg uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-black/40'}`}>
                    {step.label}
                  </p>
                  <div className="h-4">
                    {entry && (
                      <p className="text-xs font-inter text-black/60">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Show the latest note if available */}
      {timeline.length > 0 && timeline[timeline.length - 1].note && (
        <div className="mt-8 p-4 bg-black/5 border border-black/10 text-sm font-inter">
          <span className="font-semibold mr-2">Update:</span> 
          {timeline[timeline.length - 1].note}
        </div>
      )}
    </div>
  );
}
