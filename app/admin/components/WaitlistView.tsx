"use client";

import React, { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";

interface WaitlistViewProps {
  waitlist: any[];
  setWaitlist: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedWaitlistUser: (user: any) => void;
}

export default function WaitlistView({ waitlist, setWaitlist, setSelectedWaitlistUser }: WaitlistViewProps) {
  const [sizeFilter, setSizeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [notifyFilter, setNotifyFilter] = useState("ALL");

  const stats = useMemo(() => {
    const total = waitlist.length;
    const males = waitlist.filter(w => w.gender === "Male").length;
    const females = waitlist.filter(w => w.gender === "Female").length;
    const notified = waitlist.filter(w => w.notified_status !== "Not Notified").length;
    const converted = waitlist.filter(w => w.notified_status === "Converted to Order").length;
    const sizesMap: Record<string, number> = {};
    waitlist.forEach(w => { sizesMap[w.size] = (sizesMap[w.size] || 0) + 1; });
    return { total, males, females, notified, converted, sizesMap };
  }, [waitlist]);

  const filteredWaitlist = useMemo(() => {
    return waitlist.filter(w => {
      const matchesSize = sizeFilter === "ALL" || w.size === sizeFilter;
      const matchesGender = genderFilter === "ALL" || w.gender === genderFilter;
      const matchesNotify = notifyFilter === "ALL" || w.notified_status === notifyFilter;
      return matchesSize && matchesGender && matchesNotify;
    });
  }, [waitlist, sizeFilter, genderFilter, notifyFilter]);

  const triggerBulkEmail = () => {
    const eligibleCount = filteredWaitlist.filter(w => w.notified_status === "Not Notified").length;
    if (eligibleCount === 0) { toast("NO NEW WAITLIST MEMBERS TO NOTIFY", { icon: "ℹ️" }); return; }
    setWaitlist(prev => prev.map(w => {
      const isMatch = filteredWaitlist.some(f => f.id === w.id);
      if (isMatch && w.notified_status === "Not Notified") return { ...w, notified_status: "Email Sent" };
      return w;
    }));
    toast.success(`LAUNCH NOTIFICATIONS DEPLOYED TO ${eligibleCount} LEADS`);
  };

  const handleMarkNotified = (userId: number, status: string) => {
    setWaitlist(prev => prev.map(w => { if (w.id === userId) return { ...w, notified_status: status }; return w; }));
    toast.success(`STATUS SHIFTED TO ${status.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">WAITLIST REGISTRY</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">LEAD ENGINE & SIZE POPULARITY METRICS</p>
        </div>
        <div className="flex gap-2">
          <button onClick={triggerBulkEmail} className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-[0.2em] transition-all uppercase">SEND BULK LAUNCH EMAIL</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 border border-[#e4e4e7] bg-white p-6 font-mono text-xs shadow-sm">
        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">TOTAL SUBSCRIBERS</span>
          <span className="text-2xl font-black text-black mt-1 block">{stats.total} LEADS</span>
          <span className="text-[9px] text-zinc-500 mt-1 block uppercase">ACTIVE LAUNCH RESERVATIONS</span>
        </div>
        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">DEMOGRAPHIC SPLIT</span>
          <div className="mt-2 space-y-1 font-semibold text-black">
            <div className="flex justify-between"><span>MALE:</span><span>{stats.males} ({stats.total > 0 ? ((stats.males/stats.total)*100).toFixed(0) : 0}%)</span></div>
            <div className="flex justify-between"><span>FEMALE:</span><span>{stats.females} ({stats.total > 0 ? ((stats.females/stats.total)*100).toFixed(0) : 0}%)</span></div>
          </div>
        </div>
        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">NOTIFIED / CONVERTED</span>
          <div className="mt-2 space-y-1 font-semibold">
            <div className="flex justify-between text-amber-600"><span>ALERTS SENT:</span><span>{stats.notified} Leads</span></div>
            <div className="flex justify-between text-green-600"><span>CONVERSIONS:</span><span>{stats.converted} ({stats.total > 0 ? ((stats.converted/stats.total)*100).toFixed(1) : "0.0"}%)</span></div>
          </div>
        </div>
        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">POPULAR UK SIZES</span>
          <div className="mt-2 flex items-end gap-1.5 h-10 pb-1">
            {["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"].map((s, idx) => {
              const count = stats.sizesMap[s] || 0;
              const maxCount = Math.max(...Object.values(stats.sizesMap), 1);
              const heightPct = (count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="w-full bg-zinc-300 group-hover:bg-black transition-all rounded-none" style={{ height: `${heightPct}%` }} />
                  <span className="text-[7px] text-zinc-400 font-black mt-1 font-mono uppercase truncate">{s.split(" ")[1]}</span>
                  <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-black text-white text-[7px] font-black px-1 py-0.5 rounded-none tracking-widest uppercase transition-all z-10 font-mono whitespace-nowrap">{s}: {count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL UK SIZES</option><option value="UK 6">UK 6</option><option value="UK 7">UK 7</option><option value="UK 8">UK 8</option><option value="UK 9">UK 9</option><option value="UK 10">UK 10</option><option value="UK 11">UK 11</option>
          </select>
        </div>
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL GENDERS</option><option value="Male">Male</option><option value="Female">Female</option>
          </select>
        </div>
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select value={notifyFilter} onChange={(e) => setNotifyFilter(e.target.value)} className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase">
            <option value="ALL">ALL ALERTS STATUS</option><option value="Not Notified">Not Notified</option><option value="Email Sent">Email Sent</option><option value="SMS Sent">SMS Sent</option><option value="Converted to Order">Converted to Order</option>
          </select>
        </div>
      </div>

      <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                <th className="p-4 text-center">#</th><th className="p-4">SUBSCRIBER</th><th className="p-4">GENDER</th><th className="p-4 text-center">SIZE (UK)</th><th className="p-4">REGION</th><th className="p-4">DATE JOINED</th><th className="p-4 text-center">NOTIFIED STATE</th><th className="p-4 text-right">MANUAL ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {filteredWaitlist.map((user, idx) => (
                <tr key={user.id} className="hover:bg-[#fafafa]">
                  <td className="p-4 text-center text-zinc-500 font-bold">{idx + 1}</td>
                  <td className="p-4 font-sans">
                    <button onClick={() => setSelectedWaitlistUser(user)} className="font-bold text-black text-xs hover:underline uppercase tracking-wide text-left block">{user.name}</button>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">{user.email} {user.phone ? `• ${user.phone}` : ""}</div>
                  </td>
                  <td className="p-4 text-black font-bold">{user.gender}</td>
                  <td className="p-4 text-center font-bold text-black text-xs">{user.size?.split(" ")[1] || user.size}</td>
                  <td className="p-4 text-zinc-500 font-sans">{user.city || "UNKNOWN"}</td>
                  <td className="p-4 text-zinc-500">{new Date(user.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${user.notified_status === "Converted to Order" ? "bg-green-100 text-green-700" : user.notified_status === "Not Notified" ? "bg-zinc-100 text-zinc-600" : "bg-amber-100 text-amber-700"}`}>{user.notified_status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleMarkNotified(user.id, "Email Sent")} className="text-[8px] font-extrabold tracking-widest border border-[#e4e4e7] hover:border-black px-2 py-1 transition-all uppercase bg-white text-zinc-500 hover:text-black shadow-sm">EMAIL</button>
                      <button onClick={() => handleMarkNotified(user.id, "Converted to Order")} className="text-[8px] font-extrabold tracking-widest bg-black hover:bg-zinc-800 px-2 py-1 transition-all uppercase text-white">CONVERT</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
