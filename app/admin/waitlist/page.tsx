"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  RefreshCcw, 
  Search, 
  User, 
  Lock, 
  ChevronRight, 
  Filter,
  Calendar,
  Mail,
  Phone,
  ArrowUpDown
} from "lucide-react";
import toast from "react-hot-toast";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string;
  size: string;
  created_at: string;
}

export default function AdminWaitlistPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<WaitlistUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      toast.success("Welcome, Admin");
    } else {
      toast.error("Invalid credentials");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Data fetching logic
  const fetchData = async () => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    const supabase = createClient();
    try {
      const { data: users, error } = await supabase
        .from("waitlist_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(users || []);
    } catch (error: any) {
      toast.error("Failed to fetch waitlist: " + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Filtering
  const filteredData = data.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  // CSV Export logic
  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    const headers = ["Name", "Email", "Phone", "Gender", "Size", "Joined At"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        `"${user.phone || ''}"`,
        `"${user.gender}"`,
        `"${user.size}"`,
        `"${new Date(user.created_at).toLocaleString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `schault_waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl shadow-black/5"
        >
          <div className="bg-[#0350F0] p-8 text-center text-white">
            <h1 className="font-bebas text-4xl tracking-widest">ADMIN PORTAL</h1>
            <p className="mt-2 text-sm text-white/70 font-inter font-medium tracking-wide">WAITLIST MANAGEMENT</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-12 pr-4 font-inter text-sm outline-none transition-all focus:border-[#0350F0] focus:ring-4 focus:ring-[#0350F0]/5"
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white py-3.5 pl-12 pr-4 font-inter text-sm outline-none transition-all focus:border-[#0350F0] focus:ring-4 focus:ring-[#0350F0]/5"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="group relative w-full overflow-hidden rounded-xl bg-black py-4 font-bebas text-xl tracking-widest text-white transition-all hover:bg-[#0350F0]"
            >
              <span className="relative z-10">AUTHENTICATE</span>
              <div className="absolute inset-0 -translate-x-full bg-[#0350F0] transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-bebas text-5xl tracking-tight text-black/90">WAITLIST DATA</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-black/40 font-medium">
              <span>Admin Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-[#0350F0]">Sign-ups</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-2.5 font-inter text-sm font-semibold transition-all hover:border-black/30 hover:bg-gray-50 active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "REFRESHING..." : "REFRESH"}
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 rounded-xl bg-[#0350F0] px-5 py-2.5 font-inter text-sm font-semibold text-white transition-all hover:bg-[#0240C0] hover:shadow-lg hover:shadow-[#0350F0]/20 active:scale-95"
            >
              <Download size={16} />
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-black/40">Total Registrations</p>
            <p className="mt-2 font-bebas text-4xl text-[#0350F0]">{data.length}</p>
          </div>
          {/* Add more stats if needed */}
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30" />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-black/5 bg-white py-4 pl-14 pr-6 font-inter text-sm outline-none transition-all focus:border-[#0350F0] focus:ring-4 focus:ring-[#0350F0]/5 shadow-sm"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-inter">
              <thead>
                <tr className="border-b border-black/5 bg-gray-50 text-[11px] font-bold uppercase tracking-widest text-black/40">
                  <th className="px-8 py-5">#</th>
                  <th className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <User size={12} />
                       User Information
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center">Gender</th>
                  <th className="px-8 py-5 text-center">Size (UK)</th>
                  <th className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      Joined Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <AnimatePresence>
                  {filteredData.map((user, index) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-8 py-6 text-sm text-black/30 font-medium">{index + 1}</td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-bold text-black/90 group-hover:text-[#0350F0] transition-colors">{user.name}</p>
                          <div className="mt-1.5 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-black/50">
                              <Mail size={12} />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-xs text-black/50">
                                <Phone size={12} />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          user.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 
                          user.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.gender}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="font-bebas text-lg text-black/70">{user.size}</span>
                      </td>
                      <td className="px-8 py-6 text-sm text-black/50">
                        {new Date(user.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={40} className="text-black/10" />
                        <p className="text-sm text-black/40 font-medium">No users found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between px-4">
          <button 
            onClick={() => {
              localStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
              toast.success("Logged out");
            }}
            className="text-xs font-bold text-black/30 transition-colors hover:text-red-500 uppercase tracking-widest"
          >
            Sign out
          </button>
          <p className="text-[10px] text-black/20 font-bold uppercase tracking-[0.2em]">Schault Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  );
}
