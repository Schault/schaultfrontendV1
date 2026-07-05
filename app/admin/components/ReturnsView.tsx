"use client";

import React from "react";
import toast from "react-hot-toast";

interface ReturnsViewProps {
  returns: any[];
  setReturns: React.Dispatch<React.SetStateAction<any[]>>;
  setEditReturnId: (id: string) => void;
  orders: any[];
}

export default function ReturnsView({ returns, setReturns, setEditReturnId, orders }: ReturnsViewProps) {
  const handleApproveReturn = (returnId: string) => {
    setReturns(prev => prev.map(ret => { if (ret.id === returnId) return { ...ret, status: "Processed" }; return ret; }));
    toast.success(`RETURN SYSTEM APPROVED FOR ${returnId}`);
  };

  const handleRejectReturn = (returnId: string) => {
    setReturns(prev => prev.map(ret => { if (ret.id === returnId) return { ...ret, status: "Rejected" }; return ret; }));
    toast.error(`RETURN PROTOCOL REJECTED FOR ${returnId}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">RETURNS & REFUNDS LOGGER</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">LOGISTICS OF COMPLAINTS & ORIGINAL CHARGEBACKS</p>
      </div>
      <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                <th className="p-4">RETURN ID</th><th className="p-4">ORDER ID</th><th className="p-4">CUSTOMER</th><th className="p-4">REASON TYPE</th><th className="p-4">INITIATED</th><th className="p-4 text-center">RECEIVED BACK</th><th className="p-4 text-center">REFUND AMOUNT</th><th className="p-4 text-center">METHOD</th><th className="p-4 text-center">STATUS</th><th className="p-4 text-right">SYSTEM ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {returns.length === 0 ? (
                <tr><td colSpan={10} className="p-8 text-center text-zinc-400 tracking-widest uppercase font-mono text-xs">NO RETURN REQUESTS LOGGED</td></tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-[#fafafa]">
                    <td className="p-4 font-bold text-black text-xs">{ret.id}</td>
                    <td className="p-4 font-bold text-zinc-500">{ret.order_id}</td>
                    <td className="p-4 font-sans">
                      <div className="font-semibold text-black text-xs">{ret.customer}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{ret.contact}</div>
                    </td>
                    <td className="p-4 text-zinc-700">{ret.reason}</td>
                    <td className="p-4 text-zinc-500">{ret.initiated_date}</td>
                    <td className="p-4 text-center text-black">
                      <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black uppercase ${ret.received === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {ret.received === "Yes" ? `YES ${ret.received_date ? `(${ret.received_date})` : ""}` : "NO"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-black text-xs">₹{ret.refund_amount.toLocaleString()}</td>
                    <td className="p-4 text-center text-zinc-500 uppercase">{ret.method}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${ret.status === "Processed" ? "bg-green-100 text-green-700" : ret.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{ret.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ret.status === "Pending" ? (
                          <>
                            <button onClick={() => handleApproveReturn(ret.id)} className="text-[8px] font-extrabold tracking-widest bg-black hover:bg-zinc-800 px-2 py-1 transition-all uppercase text-white">APPROVE</button>
                            <button onClick={() => handleRejectReturn(ret.id)} className="text-[8px] font-extrabold tracking-widest border border-red-200 hover:border-red-600 text-red-600 px-2 py-1 transition-all uppercase bg-white hover:bg-red-50/50 shadow-sm">REJECT</button>
                          </>
                        ) : (
                          <span className="text-[8px] text-zinc-400 tracking-widest uppercase">CLOSED</span>
                        )}
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
