"use client";

import React, { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";

// 6 Stages Step Tracker Progress Bar
function DeliveryProgressTracker({ status }: { status: string }) {
  const stages = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  let activeIndex = 0;
  if (status === "Confirmed") activeIndex = 1;
  else if (status === "Processing") activeIndex = 2;
  else if (status === "Shipped") activeIndex = 3;
  else if (status === "Out for Delivery") activeIndex = 4;
  else if (status === "Delivered") activeIndex = 5;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#e4e4e7] w-full z-0" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-green-600 transition-all duration-500 z-0" style={{ width: `${(activeIndex / 5) * 100}%` }} />
        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex;
          const isActive = idx === activeIndex;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`h-4 w-4 rounded-none border transition-all duration-300 ${isActive ? "bg-white border-green-600 scale-125 ring-2 ring-green-600/20" : isCompleted ? "bg-green-600 border-green-600" : "bg-white border-zinc-300"}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest mt-2 font-mono whitespace-nowrap ${isActive ? "text-green-600 font-extrabold" : isCompleted ? "text-black" : "text-zinc-400"}`}>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DeliveryViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedOrderId: (id: string) => void;
  updateOrderStatus?: (orderId: string, newStatus: string, note?: string) => Promise<boolean>;
  updateOrderDetails?: (orderId: string, updates: { payment_status?: string; waybill?: string; estimated_delivery?: string }) => Promise<boolean>;
}

export default function DeliveryView({ orders, setOrders, setSelectedOrderId, updateOrderStatus, updateOrderDetails }: DeliveryViewProps) {
  const [selectedCourier, setSelectedCourier] = useState<string>("ALL");
  const [selectedTransitStatus, setSelectedTransitStatus] = useState<string>("ALL");

  const shipments = useMemo(() => {
    return orders
      .filter(o => o.fulfillment_status !== "Cancelled" && o.fulfillment_status !== "Pending")
      .map(o => ({ id: o.id, customer: o.customer, fulfillment_status: o.fulfillment_status, total: o.total, tracking: o.tracking, created_at: o.created_at }));
  }, [orders]);

  const filteredShipments = useMemo(() => {
    return shipments.filter(ship => {
      const matchesCourier = selectedCourier === "ALL" || ship.tracking.courier === selectedCourier;
      let matchesStatus = true;
      if (selectedTransitStatus !== "ALL") {
        if (selectedTransitStatus === "DELAYED") matchesStatus = ship.tracking.status === "Delayed";
        else if (selectedTransitStatus === "DELIVERED") matchesStatus = ship.fulfillment_status === "Delivered";
        else if (selectedTransitStatus === "IN_TRANSIT") matchesStatus = ["Confirmed", "Processing", "Shipped", "Out for Delivery"].includes(ship.fulfillment_status);
      }
      return matchesCourier && matchesStatus;
    });
  }, [shipments, selectedCourier, selectedTransitStatus]);

  const handleBulkMarkDelivered = async () => {
    const activeIds = filteredShipments.filter(s => s.fulfillment_status !== "Delivered").map(s => s.id);
    if (activeIds.length === 0) { toast("NO SHIPMENTS AWAITING DELIVERY STATUS", { icon: "ℹ️" }); return; }

    if (updateOrderStatus) {
      for (const id of activeIds) {
        await updateOrderStatus(id, "Delivered", "Bulk status mark as delivered");
      }
    } else {
      setOrders(prev => prev.map(o => {
        if (activeIds.includes(o.id)) return { ...o, fulfillment_status: "Delivered", tracking: { ...o.tracking, status: "On Time", location: "Delivered - Confirmed via bulk override", delivered_at: new Date().toISOString() } };
        return o;
      }));
      toast.success(`MARKED ${activeIds.length} ORDERS AS DELIVERED`);
    }
  };

  const handleBulkSMSAlert = () => { toast.success("SMS METRICS TRIGGERED: DISPATCHING VIA SMS SYSTEM"); };

  const handleUpdateLocation = async (orderId: string, location: string) => {
    if (!location.trim()) return;

    if (updateOrderDetails) {
      await updateOrderDetails(orderId, { waybill: location.trim() });
    } else {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) return { ...o, tracking: { ...o.tracking, location: location.trim(), awb: location.trim() } };
        return o;
      }));
      toast.success(`AWB LOCATION RE-ROUTE SAVED FOR ${orderId}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">DELIVERY LOGISTICS</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">REAL-TIME SHIPMENT MANAGEMENT & COURIER API</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleBulkMarkDelivered} className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-[0.2em] transition-all uppercase">MARK SELECTED DELIVERED</button>
          <button onClick={handleBulkSMSAlert} className="border border-[#e4e4e7] hover:border-black px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] transition-all bg-white text-black hover:bg-zinc-50 uppercase shadow-sm">SEND SMS UPDATES</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={selectedCourier} onChange={(e) => setSelectedCourier(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL CARRIERS</option><option value="Delhivery">Delhivery</option><option value="Bluedart">Bluedart</option><option value="Xpressbees">Xpressbees</option><option value="Shiprocket">Shiprocket</option><option value="Manual">Manual</option>
          </select>
        </div>
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={selectedTransitStatus} onChange={(e) => setSelectedTransitStatus(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL SHIPMENT STATUS</option><option value="IN_TRANSIT">In Transit / Active</option><option value="DELAYED">Delayed / Critical</option><option value="DELIVERED">Delivered / Archival</option>
          </select>
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase px-4 font-mono font-bold">
          <div>DELAY CRITICALS: <span className="text-red-600 font-black">{shipments.filter(s => s.tracking.status === "Delayed" && s.fulfillment_status !== "Delivered").length} ALERT(S)</span></div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredShipments.length === 0 ? (
          <div className="border border-[#e4e4e7] bg-white p-12 text-center text-xs font-mono text-zinc-400 tracking-widest uppercase shadow-sm">NO ACTIVE CARRIER STREAMS</div>
        ) : (
          filteredShipments.map((ship) => {
            const isDelayed = ship.tracking.status === "Delayed" && ship.fulfillment_status !== "Delivered";
            return (
              <div key={ship.id} className={`border bg-white p-6 rounded-none space-y-6 transition-all shadow-sm ${isDelayed ? "border-red-300 bg-red-50/10" : "border-[#e4e4e7]"}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#e4e4e7] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedOrderId(ship.id)} className="text-xs font-black text-black hover:underline tracking-widest font-mono uppercase">{ship.id}</button>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-widest font-mono uppercase">{ship.customer.name}</span>
                      {isDelayed && <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black bg-red-100 text-red-600 uppercase tracking-widest font-mono">DELAYED ALERT</span>}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">AWB: <span className="text-black font-bold">{ship.tracking.awb || "N/A"}</span> • CARRIER: <span className="text-black font-bold uppercase">{ship.tracking.courier}</span></div>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-[10px] text-right">
                    <div>
                      <span className="text-zinc-400 block uppercase font-bold tracking-widest">ETA DATE</span>
                      <span className={`font-bold block ${isDelayed ? "text-red-600" : "text-black"}`}>{ship.tracking.eta ? new Date(ship.tracking.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block uppercase font-bold tracking-widest">DELIVERY STATUS</span>
                      <span className={`font-black uppercase block ${ship.fulfillment_status === 'Delivered' ? 'text-green-600' : 'text-amber-600'}`}>{ship.fulfillment_status}</span>
                    </div>
                  </div>
                </div>
                <div className="py-2"><DeliveryProgressTracker status={ship.fulfillment_status} /></div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#fafafa] border border-[#e4e4e7] p-4 font-mono text-[11px] shadow-inner">
                  <div className="space-y-1 md:max-w-xl w-full">
                    <span className="text-[9px] font-black text-zinc-400 block uppercase tracking-widest">LIVE LOCATION STREAM</span>
                    <span className="text-zinc-700 block truncate font-sans text-xs">{ship.tracking.location || "NO REGISTERED LOCATION STOPS"}</span>
                  </div>
                  <div className="flex gap-2 shrink-0 md:max-w-xs w-full">
                    <input type="text" placeholder="SET CURRENT STOP" defaultValue="" onKeyDown={(e) => { if (e.key === "Enter") { handleUpdateLocation(ship.id, e.currentTarget.value); e.currentTarget.value = ""; } }} className="bg-white border border-[#e4e4e7] text-[9px] px-3 py-2 text-black outline-none w-full tracking-widest placeholder-[#a1a1aa] uppercase focus:border-black" />
                    <button onClick={(e) => { const input = e.currentTarget.previousSibling as HTMLInputElement; handleUpdateLocation(ship.id, input.value); input.value = ""; }} className="bg-black hover:bg-zinc-800 text-white text-[9px] font-black tracking-widest px-4 uppercase">SAVE</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
