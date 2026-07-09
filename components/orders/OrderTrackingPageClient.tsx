"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Package, 
  Truck, 
  MapPin, 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { OrderDetail, OrderStatus } from "@/lib/types/order";

interface OrderTrackingPageClientProps {
  order: OrderDetail;
}

const STATUS_STEPS: { status: OrderStatus; label: string; description: string; icon: any }[] = [
  { status: "confirmed", label: "ORDER CONFIRMED", description: "Your order has been received and confirmed.", icon: CheckCircle2 },
  { status: "processing", label: "PROCESSING", description: "Our team is preparing and packing your premium footwear.", icon: Package },
  { status: "shipped", label: "SHIPPED & IN TRANSIT", description: "Handed over to our courier partner. On the way.", icon: Truck },
  { status: "out_for_delivery", label: "OUT FOR DELIVERY", description: "Your package is out with the local delivery agent.", icon: MapPin },
  { status: "delivered", label: "DELIVERED", description: "Successfully delivered. Enjoy your Schlaut!", icon: Home },
];

export default function OrderTrackingPageClient({ order }: OrderTrackingPageClientProps) {
  const [copied, setCopied] = useState(false);

  // Mock tracking details since database does not hold carrier AWB directly
  const [mockTracking] = useState({
    courier: "Delhivery",
    awb: `SCH-${Math.floor(100000000 + Math.random() * 900000000)}-IN`,
    carrierUrl: "https://www.delhivery.com/",
    checkpoints: [
      { location: "New Delhi Sorting Facility", status: "Package processed and sorted", time: "Dispatched at 04:30 AM" },
      { location: "Gurugram Hub", status: "Arrived at regional hub", time: "Arrived at 11:20 PM" },
      { location: "Warehouse Origin", status: "Package ready for pickup", time: "Handed over at 02:15 PM" }
    ]
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockTracking.awb);
    setCopied(true);
    toast.success("AWB NUMBER COPIED");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
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

  // Find index of current status
  const currentStatusIndex = STATUS_STEPS.findIndex(step => step.status === order.status);

  return (
    <main className="min-h-screen bg-[#F5F5F5] pt-32 pb-20 px-6 md:px-12 font-inter">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link 
            href="/profile" 
            className="inline-flex items-center text-[10px] font-bold text-zinc-500 hover:text-black uppercase tracking-widest font-mono mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Profile
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-widest font-mono">ORDER SHIPMENT TRACKING</span>
              <h1 className="text-4xl font-light uppercase tracking-wider text-black mt-1">
                ORDER #{order.id.split("-")[0].toUpperCase()}
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                PLACED ON {new Date(order.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-[10px] font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Cancelled State Banner */}
        {order.status === "cancelled" && (
          <div className="border border-red-300 bg-red-50 p-5 flex items-center gap-4">
            <AlertCircle className="text-red-600 shrink-0" size={24} />
            <div>
              <span className="text-xs font-black text-red-700 block uppercase tracking-wider">ORDER CANCELLED</span>
              <span className="text-xs text-zinc-600 block leading-relaxed mt-0.5">
                This transaction has been cancelled. If payment was processed, refunds will credit to your account within 3-5 business days.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Progress & Courier Tracking */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stepper progress card */}
            {order.status !== "cancelled" && (
              <div className="border border-black/10 bg-white p-6 md:p-8 space-y-8 shadow-sm">
                <span className="text-[11px] font-black text-black tracking-widest block uppercase border-b border-black/10 pb-4 font-mono">
                  DELIVERY STATUS
                </span>
                
                <div className="space-y-8 relative">
                  {/* Vertical Connection bar */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-zinc-200" />
                  
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    const StepIcon = step.icon;
                    
                    // Find timeline details
                    const dbEntry = order.timeline.find(t => t.status === step.status);
                    
                    return (
                      <div key={idx} className="flex gap-5 relative">
                        <div className={`h-8 w-8 rounded-none border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                          isActive 
                            ? "bg-[#0350F0] border-[#0350F0] text-white scale-110 ring-4 ring-[#0350F0]/10" 
                            : isCompleted 
                              ? "bg-black border-black text-white" 
                              : "bg-white border-zinc-200 text-zinc-300"
                        }`}>
                          <StepIcon size={14} className={isActive ? "animate-pulse" : ""} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className={`text-[10px] font-extrabold tracking-widest block uppercase ${isCompleted ? "text-black" : "text-zinc-400"}`}>
                            {step.label}
                          </span>
                          <span className="text-[11px] text-zinc-500 block leading-relaxed">
                            {dbEntry?.note || step.description}
                          </span>
                          {dbEntry && (
                            <span className="text-[8px] font-mono text-[#0350F0] font-bold block uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
                              <Clock size={10} /> COMPLETED {new Date(dbEntry.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Carrier logistics detailed info */}
            {order.status !== "cancelled" && ["shipped", "out_for_delivery", "delivered"].includes(order.status) && (
              <div className="border border-black/10 bg-white p-6 md:p-8 space-y-6 shadow-sm">
                <span className="text-[11px] font-black text-black tracking-widest block uppercase border-b border-black/10 pb-4 font-mono">
                  CARRIER INFORMATION
                </span>
                
                <div className="grid grid-cols-2 gap-6 font-mono text-[10px] uppercase">
                  <div>
                    <span className="text-zinc-400 block tracking-wider">LOGISTICS PARTNER</span>
                    <span className="font-extrabold text-black text-xs block mt-1">{mockTracking.courier}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block tracking-wider">EXPECTED ARRIVAL</span>
                    <span className="font-extrabold text-black text-xs block mt-1">
                      {order.estimated_delivery 
                        ? new Date(order.estimated_delivery).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "Calculating..."}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#fafafa] border border-black/5 p-4 font-mono text-[11px] gap-4">
                  <div>
                    <span className="text-zinc-400 block uppercase tracking-widest text-[8px]">AWB TRACKING NUMBER</span>
                    <span className="font-bold text-black tracking-wider block mt-1">{mockTracking.awb}</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={copyToClipboard}
                      className="px-4 py-2 border border-black/15 hover:border-black text-zinc-600 hover:text-black bg-white transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                    >
                      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />} COPY AWB
                    </button>
                    <a 
                      href={mockTracking.carrierUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-black/15 hover:border-black text-zinc-600 hover:text-black bg-white transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <ExternalLink size={12} /> TRACK CARRIER
                    </a>
                  </div>
                </div>

                {/* Logistics stream checkpoints */}
                {order.status !== "delivered" && (
                  <div className="space-y-4 pt-2">
                    <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-widest font-mono">LIVE LOGISTICS STREAM</span>
                    <div className="space-y-4 border-l border-zinc-200 pl-4 font-mono text-[10px]">
                      {mockTracking.checkpoints.map((checkpoint, i) => (
                        <div key={i} className="relative space-y-1 uppercase">
                          <span className="absolute -left-[21px] top-1.5 h-2 w-2 bg-zinc-300 rounded-none border border-white" />
                          <span className="font-bold text-black block">{checkpoint.location}</span>
                          <span className="text-zinc-500 block">{checkpoint.status}</span>
                          <span className="text-zinc-400 block text-[8px]">{checkpoint.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary, Destination & Help */}
          <div className="space-y-8">
            
            {/* Items Summary */}
            <div className="border border-black/10 p-6 bg-white space-y-6 shadow-sm">
              <span className="text-[11px] font-black text-black tracking-widest block uppercase border-b border-black/10 pb-4 font-mono">
                DISPATCHED SNEAKERS
              </span>
              
              <div className="divide-y divide-black/5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center pt-4 first:pt-0">
                    <div className="h-16 w-16 bg-zinc-50 border border-black/5 shrink-0 flex items-center justify-center p-2 font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      SHOE
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <span className="text-xs font-bold text-black uppercase block tracking-wide truncate max-w-[160px]">{item.product_name}</span>
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono">
                        SIZE: {item.variant_size} {item.variant_color ? `• COL: ${item.variant_color}` : ""}
                      </span>
                      <span className="text-[10px] text-zinc-500 block font-mono">QTY: {item.quantity} • INDIV: ₹{item.unit_price.toLocaleString()}</span>
                    </div>
                    <span className="text-xs font-extrabold text-black font-mono">₹{item.line_total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-black/10 pt-4 flex justify-between items-center font-mono text-[11px] font-black uppercase text-black">
                <span>NET CHARGE PAID</span>
                <span className="text-sm font-bold">₹{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="border border-black/10 p-6 bg-white space-y-4 shadow-sm font-mono text-[10px] uppercase">
              <span className="text-zinc-400 block tracking-widest text-[8px] border-b border-black/5 pb-2">
                SHIPPING DESTINATION
              </span>
              {order.shipping_address ? (
                <div className="text-black space-y-1 font-semibold">
                  <p className="font-black text-black">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                  {order.shipping_address.phone && <p className="mt-3 text-zinc-400 text-[9px] font-mono">TEL: {order.shipping_address.phone}</p>}
                </div>
              ) : (
                <span className="text-zinc-400 italic font-medium">NO DESTINATION ADDRESS RECORDED</span>
              )}
            </div>

            {/* Support Actions */}
            <div className="border border-black/10 p-6 bg-white space-y-3 shadow-sm">
              <button 
                onClick={() => toast("ROUTING DEPLOYED: CONNECTING WITH SCHAULT BOT SUPPORT...", { icon: "💬" })}
                className="w-full border border-black hover:bg-black hover:text-white text-black font-extrabold text-[9px] py-3.5 tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle size={12} /> OBTAIN SUPPORT
              </button>
              {["pending", "confirmed"].includes(order.status) && (
                <button 
                  onClick={() => toast.error("CANCELLATION REQUEST DISPATCHED TO OPERATIONS")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] py-3.5 tracking-[0.2em] uppercase transition-all"
                >
                  REQUEST CANCEL
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
