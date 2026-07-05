"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Eye, Edit2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { getStatusColor } from "../lib/status-utils";

interface OrdersViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedOrderId: (id: string) => void;
}

export default function OrdersView({ orders, setOrders, setSelectedOrderId }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.phone?.includes(searchQuery) ||
        order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || order.fulfillment_status === statusFilter;
      const matchesPayment = paymentFilter === "ALL" || order.payment_status === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const handlePrintInvoice = (orderId: string) => {
    toast.success(`INVOICE GENERATED AND PRINTING QUEUED FOR ${orderId}`);
  };

  const handleManualAction = (orderId: string, action: string) => {
    toast(`TRIGGERED ACTION "${action}" FOR ${orderId}`, { icon: "⚙️" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">ORDERS REGISTRY</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">TRANSACTION LOGS & FULFILLMENT SYSTEMS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Sanitize CSV fields to prevent formula injection (=CMD, +CMD, etc.)
              const sanitizeCsvField = (value: unknown): string => {
                const str = String(value ?? "");
                const sanitized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
                return `"${sanitized.replace(/"/g, '""')}"`;
              };

              const headers = ["Order ID", "Customer Name", "Phone", "Email", "Total (INR)", "Payment", "Fulfillment", "Date"];
              const rows = filteredOrders.map(o => [
                sanitizeCsvField(o.id),
                sanitizeCsvField(o.customer.name),
                sanitizeCsvField(o.customer.phone),
                sanitizeCsvField(o.customer.email),
                sanitizeCsvField(o.total),
                sanitizeCsvField(o.payment_status),
                sanitizeCsvField(o.fulfillment_status),
                sanitizeCsvField(o.created_at),
              ].join(","));
              const csvContent = [headers.map(h => sanitizeCsvField(h)).join(","), ...rows].join("\n");
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `schault_orders_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success("ORDERS CSV EXPORTED");
            }}
            className="flex items-center gap-2 border border-[#e4e4e7] hover:border-black px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] transition-all bg-white text-black hover:bg-zinc-50 uppercase shadow-sm"
          >
            <Download size={12} /> EXPORT CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        <div className="relative md:col-span-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="SEARCH BY ID, CUSTOMER, PHONE..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-widest pl-10 pr-4 py-2.5 text-black outline-none focus:border-black uppercase" />
        </div>
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL FULFILLMENTS</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL PAYMENTS</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">PRODUCT(S)</th>
                <th className="p-4">DATE</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4 text-center">PAYMENT</th>
                <th className="p-4 text-center">FULFILLMENT</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-400 tracking-widest uppercase">NO COMPATIBLE TRANSACTIONS LOCATED</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="p-4 font-bold text-black text-xs">{order.id}</td>
                    <td className="p-4 font-sans">
                      <div className="font-semibold text-black text-xs">{order.customer.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{order.customer.phone}</div>
                    </td>
                    <td className="p-4 font-sans text-xs">
                      {order.products.map((p: any, idx: number) => (
                        <div key={idx} className="text-zinc-700 leading-relaxed">
                          {p.name} <span className="font-mono text-[10px] text-zinc-500 font-bold">({p.size}/{p.color})</span>
                          {idx < order.products.length - 1 ? "," : ""}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-zinc-500">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4 font-bold text-black text-xs">₹{order.total.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${order.payment_status === "Paid" ? "bg-green-100 text-green-700" : order.payment_status === "Refunded" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{order.payment_status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${getStatusColor(order.fulfillment_status)}`}>{order.fulfillment_status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button onClick={() => setSelectedOrderId(order.id)} title="View Details" className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"><Eye size={12} /></button>
                        <button onClick={() => handlePrintInvoice(order.id)} title="Print Invoice" className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"><Printer size={12} /></button>
                        <button onClick={() => handleManualAction(order.id, "EDIT_METADATA")} title="Internal Edit" className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"><Edit2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
