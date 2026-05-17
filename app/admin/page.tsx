"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Package,
  RotateCcw,
  BarChart3,
  Settings,
  Search,
  Filter,
  RefreshCcw,
  Download,
  Calendar,
  Mail,
  Phone,
  ArrowUpDown,
  Plus,
  Eye,
  Edit2,
  Printer,
  ChevronRight,
  User,
  AlertTriangle,
  Send,
  X,
  CheckCircle,
  Clock,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

// ==========================================
// MOCK DATA GENERATOR & INITIAL STATE
// ==========================================

const INITIAL_ORDERS = [
  {
    id: "SCH-4028",
    customer: { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98765 43210", address: "Flat 402, Shanti Vihar, HSR Layout Sector 3, Bengaluru, Karnataka, 560102" },
    products: [
      { name: "Arctic Dawn Upper", size: "UK 9", color: "Cobalt Blue", price: 4999, quantity: 1 },
      { name: "White Outsole v1", size: "UK 9", color: "Snow White", price: 4000, quantity: 1 }
    ],
    total: 8999,
    payment_status: "Paid",
    fulfillment_status: "In Transit",
    created_at: "2026-05-17T02:15:00Z",
    notes: "Customer requested urgent dispatch. Prefers afternoon delivery.",
    tracking: { courier: "Bluedart", awb: "BD982710382", location: "Bengaluru Hub - Dispatched for delivery", eta: "2026-05-18", attempts: 1, status: "On Time" }
  },
  {
    id: "SCH-4027",
    customer: { name: "Ananya Iyer", email: "ananya.iyer@yahoo.com", phone: "+91 99887 76655", address: "Apartment 12B, Ocean Crest, Marine Drive, Mumbai, Maharashtra, 400020" },
    products: [
      { name: "Midnight Stealth Upper", size: "UK 7", color: "Matte Black", price: 5499, quantity: 1 },
      { name: "Black Outsole v1", size: "UK 7", color: "Charcoal Black", price: 4000, quantity: 1 }
    ],
    total: 9499,
    payment_status: "Paid",
    fulfillment_status: "Dispatched",
    created_at: "2026-05-16T18:45:00Z",
    notes: "",
    tracking: { courier: "Delhivery", awb: "DEL827192039", location: "Pune Transit Center - Sorted", eta: "2026-05-16", attempts: 0, status: "Delayed" } // Passed ETA -> Delayed Alert!
  },
  {
    id: "SCH-4026",
    customer: { name: "Kabir Malhotra", email: "kabir.malhotra@gmail.com", phone: "+91 97765 88990", address: "House 87, Sector 15A, Noida, Uttar Pradesh, 201301" },
    products: [
      { name: "Neon Surge Upper", size: "UK 8", color: "Hyper Green", price: 4999, quantity: 1 },
      { name: "White Outsole v1", size: "UK 8", color: "Snow White", price: 4000, quantity: 1 },
      { name: "Adaptive Buckle Straps", size: "OS", color: "Neon Green", price: 1500, quantity: 2 }
    ],
    total: 11999,
    payment_status: "Paid",
    fulfillment_status: "Delivered",
    created_at: "2026-05-15T11:20:00Z",
    notes: "Leave package at security gate.",
    tracking: { courier: "Shiprocket", awb: "SR88726190", location: "Delivered - Handed over to security", eta: "2026-05-15", delivered_at: "2026-05-15T16:30:00Z", attempts: 1, status: "On Time" }
  },
  {
    id: "SCH-4025",
    customer: { name: "Diya Nair", email: "diya.nair@hotmail.com", phone: "+91 91122 33445", address: "G-103, Sobha Heights, Kakkanad, Kochi, Kerala, 682030" },
    products: [
      { name: "Arctic Dawn Upper", size: "UK 6", color: "Cobalt Blue", price: 4999, quantity: 1 },
      { name: "Black Outsole v1", size: "UK 6", color: "Charcoal Black", price: 4000, quantity: 1 }
    ],
    total: 8999,
    payment_status: "Paid",
    fulfillment_status: "Packed",
    created_at: "2026-05-15T09:10:00Z",
    notes: "Requires double boxing.",
    tracking: { courier: "Xpressbees", awb: "XB773829019", location: "Schault Warehouse - Packed & Invoiced", eta: "2026-05-19", attempts: 0, status: "On Time" }
  },
  {
    id: "SCH-4024",
    customer: { name: "Rohan Varma", email: "rohan.varma@outlook.com", phone: "+91 95566 77889", address: "Flat 1004, Tower B, Prestige Palms, Jubilee Hills, Hyderabad, Telangana, 500033" },
    products: [
      { name: "Crimson Forge Upper", size: "UK 10", color: "Rogue Red", price: 5499, quantity: 1 },
      { name: "White Outsole v1", size: "UK 10", color: "Snow White", price: 4000, quantity: 1 }
    ],
    total: 9499,
    payment_status: "Paid",
    fulfillment_status: "Processing",
    created_at: "2026-05-14T15:30:00Z",
    notes: "Gift wrap and include a birthday tag: 'Happy Custom Walking!'",
    tracking: { courier: "Manual", awb: "M-4024", location: "Awaiting pickup from warehouse", eta: "2026-05-20", attempts: 0, status: "On Time" }
  },
  {
    id: "SCH-4023",
    customer: { name: "Sneha Patel", email: "sneha.patel@gmail.com", phone: "+91 98223 44556", address: "32, Nilgiri Park, Satellite, Ahmedabad, Gujarat, 380015" },
    products: [
      { name: "Midnight Stealth Upper", size: "UK 8", color: "Matte Black", price: 5499, quantity: 1 },
      { name: "Black Outsole v1", size: "UK 8", color: "Charcoal Black", price: 4000, quantity: 1 }
    ],
    total: 9499,
    payment_status: "Refunded",
    fulfillment_status: "Cancelled",
    created_at: "2026-05-13T10:00:00Z",
    notes: "Order cancelled by customer due to wrong size input. Re-registering.",
    tracking: { courier: "Manual", awb: "", location: "Cancelled - Refund Processed", eta: "", attempts: 0, status: "Returned" }
  },
  {
    id: "SCH-4022",
    customer: { name: "Vikram Sengupta", email: "vikram.s@outlook.com", phone: "+91 94455 66778", address: "Flat 2D, Block A, Regent Estate, Kolkata, West Bengal, 700092" },
    products: [
      { name: "Crimson Forge Upper", size: "UK 11", color: "Rogue Red", price: 5499, quantity: 1 },
      { name: "White Outsole v1", size: "UK 11", color: "Snow White", price: 4000, quantity: 1 }
    ],
    total: 9499,
    payment_status: "Paid",
    fulfillment_status: "Delivered",
    created_at: "2026-05-12T16:40:00Z",
    notes: "",
    tracking: { courier: "Delhivery", awb: "DEL662518290", location: "Delivered - Signed by customer", eta: "2026-05-15", delivered_at: "2026-05-15T11:00:00Z", attempts: 1, status: "On Time" }
  }
];

const INITIAL_WAITLIST = [
  { id: 1, name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98765 43210", gender: "Male", size: "UK 9", created_at: "2026-05-17T02:10:00Z", notified_status: "Converted to Order", city: "Bengaluru, KA" },
  { id: 2, name: "Ishaan Mehta", email: "ishaan.m@gmail.com", phone: "+91 96655 44332", gender: "Male", size: "UK 8", created_at: "2026-05-17T06:30:00Z", notified_status: "Not Notified", city: "Mumbai, MH" },
  { id: 3, name: "Meera Deshmukh", email: "meera.d@gmail.com", phone: "+91 93322 11009", gender: "Female", size: "UK 6", created_at: "2026-05-17T08:12:00Z", notified_status: "Not Notified", city: "Pune, MH" },
  { id: 4, name: "Rahul Kapoor", email: "rahul.kapoor@outlook.com", phone: "+91 98822 77334", gender: "Male", size: "UK 10", created_at: "2026-05-16T15:20:00Z", notified_status: "Email Sent", city: "New Delhi, DL" },
  { id: 5, name: "Pooja Hegde", email: "pooja.h@yahoo.com", phone: "+91 97722 88334", gender: "Female", size: "UK 7", created_at: "2026-05-16T11:05:00Z", notified_status: "SMS Sent", city: "Hyderabad, TS" },
  { id: 6, name: "Varun Dhawan", email: "varun.d@gmail.com", phone: "+91 92211 44556", gender: "Male", size: "UK 9", created_at: "2026-05-15T22:40:00Z", notified_status: "Not Notified", city: "Mumbai, MH" },
  { id: 7, name: "Shruti Haasan", email: "shruti.h@gmail.com", phone: null, gender: "Female", size: "UK 8", created_at: "2026-05-15T18:15:00Z", notified_status: "Not Notified", city: "Chennai, TN" },
  { id: 8, name: "Rohan Preet", email: "rohanpreet@outlook.com", phone: "+91 98789 01234", gender: "Male", size: "UK 9", created_at: "2026-05-14T12:30:00Z", notified_status: "Converted to Order", city: "Chandigarh, PB" },
  { id: 9, name: "Aditi Rao", email: "aditi.rao@hotmail.com", phone: null, gender: "Female", size: "UK 6", created_at: "2026-05-14T09:12:00Z", notified_status: "Email Sent", city: "Hyderabad, TS" },
  { id: 10, name: "Rajkummar Rao", email: "raj.rao@gmail.com", phone: "+91 98887 77766", gender: "Male", size: "UK 8", created_at: "2026-05-13T14:50:00Z", notified_status: "Not Notified", city: "Gurugram, HR" },
  { id: 11, name: "Kriti Sanon", email: "kriti@yahoo.com", phone: "+91 99988 88877", gender: "Female", size: "UK 7", created_at: "2026-05-13T11:20:00Z", notified_status: "SMS Sent", city: "Noida, UP" },
  { id: 12, name: "Ayushmann K", email: "ayushmann.k@gmail.com", phone: "+91 92233 44556", gender: "Male", size: "UK 9", created_at: "2026-05-12T16:10:00Z", notified_status: "Email Sent", city: "Chandigarh, PB" }
];

const INITIAL_SKUS = [
  { id: "1", sku: "CD-01-BW", product_name: "Midnight Stealth Upper", variant: "Knit Upper / Matte Black", quantity: 18, threshold: 10, restocked_at: "2026-05-10" },
  { id: "2", sku: "CD-02-WO", product_name: "White Outsole v1", variant: "Outsole / Snow White", quantity: 3, threshold: 10, restocked_at: "2026-05-12" }, // Low Stock Alert! (<5)
  { id: "3", sku: "CD-03-MB", product_name: "Adaptive Buckle Straps", variant: "Straps / Neon Green", quantity: 24, threshold: 10, restocked_at: "2026-05-15" },
  { id: "4", sku: "CD-04-AR", product_name: "Arctic Dawn Upper", variant: "Knit Upper / Cobalt Blue", quantity: 2, threshold: 10, restocked_at: "2026-05-08" }, // Low Stock Alert! (<5)
  { id: "5", sku: "CD-05-BO", product_name: "Black Outsole v1", variant: "Outsole / Charcoal Black", quantity: 14, threshold: 10, restocked_at: "2026-05-14" },
  { id: "6", sku: "CD-06-CF", product_name: "Crimson Forge Upper", variant: "Knit Upper / Rogue Red", quantity: 0, threshold: 5, restocked_at: "2026-05-01" }, // Out of Stock!
  { id: "7", sku: "CD-07-ML", product_name: "Metal Lock Adapters", variant: "Adapters / Silver Chrome", quantity: 45, threshold: 10, restocked_at: "2026-05-15" }
];

const INITIAL_RETURNS = [
  { id: "RET-101", order_id: "SCH-4023", customer: "Sneha Patel", contact: "+91 98223 44556", reason: "Wrong size", initiated_date: "2026-05-14", received: "Yes", received_date: "2026-05-16", status: "Processed", refund_amount: 9499, method: "Original", notes: "Size was UK 8, customer needed UK 9. Cancelled order, refund processed via PG." },
  { id: "RET-102", order_id: "SCH-4022", customer: "Vikram Sengupta", contact: "+91 94455 66778", reason: "Defective", initiated_date: "2026-05-16", received: "No", received_date: "", status: "Pending", refund_amount: 9499, method: "Store credit", notes: "Subtle tear in left mesh fabric. Store credit approved upon return receipt." }
];

const INITIAL_SETTINGS = {
  admin_emails: ["admin@schault.com", "superadmin@schault.com", "mohit@schault.com", "design@schault.com"],
  couriers: { default: "Delhivery", delhivery_key: "••••••••••••••••", bluedart_key: "••••••••••••••••", shiprocket_key: "••••••••••••••••" },
  email_templates: {
    waitlist: "HI {{name}},\n\nYOU ARE IN. WE ARE THRILLED TO INVITE YOU TO EXCLUSIVELY ACCESS THE FIRST DROP OF SCHAULT MODULAR FOOTWEAR. CHOOSE YOUR OUTSOLE, SWAP YOUR UPPER, AND DEFINE YOUR STRIDE.\n\nCLAIM YOUR PAIR NOW: https://www.schault.com/shop?code={{code}}\n\nSTAY PROGRESSIVE,\nSCHAULT TEAM",
    dispatch: "ORDER {{order_id}} HAS BEEN DISPATCHED VIA {{courier}}.\nTRACKING AWB: {{awb}}.\n\nESTIMATED DELIVERY: {{eta}}."
  },
  sms_config: { MSG91_key: "••••••••••••••••", twilio_sid: "••••••••••••••••" },
  webhook_url: "https://api.schault.com/v1/shipments/webhook",
  store: { name: "SCHAULT FOOTWEAR PVT LTD", address: "Gate No. 3, Industrial Area Phase 2, Okhla, New Delhi, 110020", gst: "07AAHCS3829M1ZP" }
};

// ==========================================
// CENTRAL CONTROLLER
// ==========================================

export default function AdminHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Shared Data States
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [waitlist, setWaitlist] = useState(INITIAL_WAITLIST);
  const [inventory, setInventory] = useState(INITIAL_SKUS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // Active drawers/modals state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedWaitlistUser, setSelectedWaitlistUser] = useState<any | null>(null);
  const [editInventorySku, setEditInventorySku] = useState<any | null>(null);
  const [editReturnId, setEditReturnId] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const authSession = localStorage.getItem("schault_admin_session");
    if (!authSession) {
      router.push("/admin/login");
      return;
    }
    try {
      const { email, expiry } = JSON.parse(authSession);
      if (new Date().getTime() > expiry) {
        localStorage.removeItem("schault_admin_session");
        toast.error("SESSION EXPIRED. PLEASE AUTHENTICATE AGAIN.");
        router.push("/admin/login");
      } else {
        setIsAdminAuthenticated(true);
        setAdminEmail(email);
      }
    } catch (e) {
      localStorage.removeItem("schault_admin_session");
      router.push("/admin/login");
    }
  }, [router]);

  // Sync active page tab from query parameters if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("page");
      if (tab && ["dashboard", "orders", "delivery", "waitlist", "inventory", "returns", "analytics", "settings"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?page=${tab}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("schault_admin_session");
    localStorage.removeItem("admin_auth");
    toast.success("SECURE SESSION TERMINATED");
    router.push("/admin/login");
  };

  // Calculations for dashboard counters (reactive)
  const dashboardStats = useMemo(() => {
    const activeOrders = orders.filter(o => o.fulfillment_status !== "Cancelled");
    const totalOrdersCount = activeOrders.length;
    const inTransitCount = orders.filter(o => ["Dispatched", "In Transit"].includes(o.fulfillment_status)).length;
    const deliveredCount = orders.filter(o => o.fulfillment_status === "Delivered").length;
    const waitlistCount = waitlist.length;
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      totalOrders: totalOrdersCount,
      inTransit: inTransitCount,
      delivered: deliveredCount,
      waitlist: waitlistCount,
      revenue: totalRevenue
    };
  }, [orders, waitlist]);

  // Low stock counter (SKUs with stock < 5)
  const lowStockItems = useMemo(() => {
    return inventory.filter(sku => sku.quantity < 5);
  }, [inventory]);

  // Today's waitlist registration count (mocking registration dates matching current day)
  const todayWaitlistCount = useMemo(() => {
    return waitlist.filter(w => w.created_at.startsWith("2026-05-17")).length;
  }, [waitlist]);

  if (!isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-white" size={32} />
          <p className="font-mono text-xs tracking-[0.2em] text-[#666] uppercase">VERIFYING SECURE CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] text-[#0a0a0a] font-inter antialiased overflow-hidden">
      {/* ==========================================
          PERSISTENT SIDEBAR NAVIGATION
          ========================================== */}
      <aside className="w-64 border-r border-[#e4e4e7] bg-white flex flex-col justify-between shrink-0 h-screen overflow-y-auto">
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-[#e4e4e7] flex items-center gap-3">
            <Image
              src="/assets/logo.webp"
              alt="Schault Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <div>
              <span className="font-black text-sm tracking-[0.3em] block text-black">SCHAULT</span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">ADMIN ENGINE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
              { id: "orders", label: "ORDERS", icon: ShoppingBag, badge: orders.filter(o => o.fulfillment_status === "Processing").length },
              { id: "delivery", label: "DELIVERY TRACKING", icon: Truck, badge: orders.filter(o => o.tracking.status === "Delayed").length },
              { id: "waitlist", label: "WAITLIST MANAGER", icon: Users },
              { id: "inventory", label: "INVENTORY", icon: Package, badge: lowStockItems.length },
              { id: "returns", label: "RETURNS & REFUNDS", icon: RotateCcw, badge: returns.filter(r => r.status === "Pending").length },
              { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
              { id: "settings", label: "SETTINGS", icon: Settings }
            ].map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => changeTab(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold tracking-[0.2em] transition-all uppercase rounded-none border border-transparent ${
                    isActive
                      ? "bg-[#f4f4f5] text-black font-extrabold border-l-2 border-black pl-[14px]"
                      : "text-zinc-500 hover:text-black hover:bg-zinc-50 pl-4"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={isActive ? "text-black" : "text-zinc-400"} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 ? (
                    <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-none ${
                      isActive ? "bg-black text-white" : "bg-zinc-100 text-red-600"
                    }`}>
                      {link.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#e4e4e7] bg-[#fafafa]">
          <div className="mb-3 px-2">
            <span className="text-[8px] font-semibold text-zinc-400 block uppercase tracking-widest">LOGGED IN AS</span>
            <span className="text-[10px] font-bold text-zinc-600 block truncate font-mono">{adminEmail}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-white hover:bg-red-600 hover:text-white text-zinc-600 border border-[#e4e4e7] hover:border-transparent py-2.5 text-[9px] font-extrabold tracking-[0.2em] transition-all uppercase"
          >
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT VIEW WRAPPER
          ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f1f1]">
        {/* Top Header Controls */}
        <header className="h-16 border-b border-[#e4e4e7] bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#71717a] uppercase">SYS PROTOCOL: ONLINE</span>
            <span className="h-2 w-2 bg-green-600 animate-pulse rounded-full" />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-[#71717a]">
            <div className="font-mono text-black/50">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div className="h-4 w-[1px] bg-[#e4e4e7]" />
            <div className="uppercase">₹ INR CONTEXT</div>
          </div>
        </header>

        {/* View Layout Switcher */}
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              {activeTab === "dashboard" && (
                <DashboardView
                  stats={dashboardStats}
                  orders={orders}
                  waitlist={waitlist}
                  lowStock={lowStockItems}
                  todayWaitlist={todayWaitlistCount}
                  setSelectedOrderId={setSelectedOrderId}
                  changeTab={changeTab}
                />
              )}
              {activeTab === "orders" && (
                <OrdersView
                  orders={orders}
                  setOrders={setOrders}
                  setSelectedOrderId={setSelectedOrderId}
                />
              )}
              {activeTab === "delivery" && (
                <DeliveryView
                  orders={orders}
                  setOrders={setOrders}
                  setSelectedOrderId={setSelectedOrderId}
                />
              )}
              {activeTab === "waitlist" && (
                <WaitlistView
                  waitlist={waitlist}
                  setWaitlist={setWaitlist}
                  setSelectedWaitlistUser={setSelectedWaitlistUser}
                />
              )}
              {activeTab === "inventory" && (
                <InventoryView
                  inventory={inventory}
                  setInventory={setInventory}
                  setEditSku={setEditInventorySku}
                />
              )}
              {activeTab === "returns" && (
                <ReturnsView
                  returns={returns}
                  setReturns={setReturns}
                  setEditReturnId={setEditReturnId}
                  orders={orders}
                />
              )}
              {activeTab === "analytics" && (
                <AnalyticsView
                  orders={orders}
                  waitlist={waitlist}
                  inventory={inventory}
                />
              )}
              {activeTab === "settings" && (
                <SettingsView
                  settings={settings}
                  setSettings={setSettings}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ==========================================
          MODALS & DRAWERS DEFINITIONS (PORTAL MOCK)
          ========================================== */}

      {/* 1. Order Detail Slideover Drawer */}
      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailDrawer
            orderId={selectedOrderId}
            orders={orders}
            setOrders={setOrders}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </AnimatePresence>

      {/* 2. Waitlist User Slideover Drawer */}
      <AnimatePresence>
        {selectedWaitlistUser && (
          <WaitlistUserDrawer
            user={selectedWaitlistUser}
            waitlist={waitlist}
            setWaitlist={setWaitlist}
            onClose={() => setSelectedWaitlistUser(null)}
          />
        )}
      </AnimatePresence>

      {/* 3. Inventory Stock Edit Modal */}
      <AnimatePresence>
        {editInventorySku && (
          <InventoryEditModal
            skuItem={editInventorySku}
            inventory={inventory}
            setInventory={setInventory}
            onClose={() => setEditInventorySku(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 1. DASHBOARD VIEW SUB-COMPONENT
// ==========================================
interface DashboardViewProps {
  stats: any;
  orders: any[];
  waitlist: any[];
  lowStock: any[];
  todayWaitlist: number;
  setSelectedOrderId: (id: string) => void;
  changeTab: (tab: string) => void;
}

function DashboardView({ stats, orders, waitlist, lowStock, todayWaitlist, setSelectedOrderId, changeTab }: DashboardViewProps) {
  const lastFiveOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM COMMAND CENTER</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">REAL-TIME OVERVIEW & METRICS</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "TOTAL ORDERS", value: stats.totalOrders, color: "border-[#e4e4e7]" },
          { label: "IN TRANSIT", value: stats.inTransit, color: "border-[#e4e4e7]", highlight: stats.inTransit > 0 ? "text-amber-600" : "text-black" },
          { label: "DELIVERED", value: stats.delivered, color: "border-[#e4e4e7]", highlight: "text-green-600" },
          { label: "WAITLIST SIZE", value: stats.waitlist, color: "border-[#e4e4e7]" },
          { label: "GROSS REVENUE", value: `₹${stats.revenue.toLocaleString()}`, color: "border-[#e4e4e7] col-span-1 sm:col-span-2 lg:col-span-1" }
        ].map((card, i) => (
          <div key={i} className={`border ${card.color} bg-white p-6 rounded-none flex flex-col justify-between shadow-sm`}>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">{card.label}</span>
            <span className={`text-2xl font-black tracking-tight mt-4 block ${card.highlight || "text-black"}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Two-Column Bento Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Last 5 Orders Table */}
        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none lg:col-span-2 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
            <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase">LATEST TRANSACTIONS</span>
            <button
              onClick={() => changeTab("orders")}
              className="text-[9px] font-bold tracking-[0.15em] text-zinc-500 hover:text-black uppercase flex items-center gap-1.5"
            >
              VIEW ALL <ChevronRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#e4e4e7] text-zinc-500 font-semibold uppercase tracking-[0.1em] text-[10px]">
                  <th className="pb-3 pr-4">ORDER ID</th>
                  <th className="pb-3 pr-4">CUSTOMER</th>
                  <th className="pb-3 pr-4">STATUS</th>
                  <th className="pb-3 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {lastFiveOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-[#fafafa]">
                    <td className="py-3 pr-4 font-bold text-black">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="hover:underline text-left text-xs text-black uppercase font-black"
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-zinc-600 font-sans font-medium text-xs">{order.customer.name}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex px-2 py-0.5 text-[8px] font-black uppercase ${
                        order.fulfillment_status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.fulfillment_status === "Cancelled" ? "bg-red-100 text-red-700" :
                        order.fulfillment_status === "Processing" ? "bg-zinc-100 text-zinc-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-black font-bold">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operations Alerts */}
        <div className="space-y-6 lg:col-span-1">
          {/* Low Stock Alerts */}
          <div className="border border-[#e4e4e7] bg-white p-6 rounded-none space-y-4 h-full shadow-sm">
            <div className="border-b border-[#e4e4e7] pb-4 flex items-center justify-between">
              <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" /> INVENTORY ALERTS
              </span>
              {lowStock.length > 0 && (
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 text-[8px] font-black font-mono">
                  {lowStock.length} CRITICAL
                </span>
              )}
            </div>

            {lowStock.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400 tracking-widest uppercase font-mono">
                ALL SKUs ABOVE MINIMUM THRESHOLDS
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {lowStock.map((sku) => (
                  <div key={sku.id} className="flex items-center justify-between border border-[#e4e4e7] p-3 bg-[#fafafa] font-mono">
                    <div>
                      <span className="text-[10px] font-black text-black block">{sku.sku}</span>
                      <span className="text-[9px] text-[#71717a] block truncate max-w-[160px] font-sans">{sku.product_name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black block ${sku.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                        STOCK: {sku.quantity}
                      </span>
                      <span className="text-[8px] text-zinc-400 block">LIMIT: {sku.threshold}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => changeTab("inventory")}
              className="w-full mt-4 bg-black hover:bg-zinc-800 text-white text-[9px] font-extrabold tracking-[0.2em] py-3 transition-all uppercase text-center block"
            >
              MANAGE STOCK
            </button>
          </div>
        </div>
      </div>

      {/* Bottom quick stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">TODAY&apos;S WAITLIST LEADS</span>
            <span className="text-xl font-black text-black mt-1 block">{todayWaitlist} SIGN-UPS</span>
          </div>
          <button
            onClick={() => changeTab("waitlist")}
            className="text-[9px] font-extrabold tracking-[0.15em] border border-[#e4e4e7] hover:border-black px-3 py-2 transition-all uppercase font-sans text-zinc-500 hover:text-black"
          >
            MANAGE
          </button>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">WAITLIST CONVERSION RATE</span>
            <span className="text-xl font-black text-green-600 mt-1 block">16.6%</span>
          </div>
          <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 uppercase tracking-widest font-mono">HEALTHY</span>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 rounded-none flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">ACTIVE SHIPMENT CARRIERS</span>
            <span className="text-xl font-black text-black mt-1 block">DELHIVERY, BLUEDART</span>
          </div>
          <span className="text-[8px] font-black bg-zinc-100 text-zinc-600 px-1.5 py-0.5 uppercase tracking-widest font-mono">DOMESTIC</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ORDERS VIEW SUB-COMPONENT
// ==========================================
interface OrdersViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedOrderId: (id: string) => void;
}

function OrdersView({ orders, setOrders, setSelectedOrderId }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || order.fulfillment_status === statusFilter;
      const matchesPayment = paymentFilter === "ALL" || order.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Handle manual deletions or status prints
  const handlePrintInvoice = (orderId: string) => {
    toast.success(`INVOICE GENERATED AND PRINTING QUEUED FOR ${orderId}`);
  };

  const handleManualAction = (orderId: string, action: string) => {
    toast(`TRIGGERED ACTION "${action}" FOR ${orderId}`, { icon: "⚙️" });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">ORDERS REGISTRY</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">TRANSACTION LOGS & FULFILLMENT SYSTEMS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Export orders as basic mock CSV download
              const headers = ["Order ID", "Customer Name", "Phone", "Email", "Total (INR)", "Payment", "Fulfillment", "Date"];
              const rows = filteredOrders.map(o => [
                o.id,
                o.customer.name,
                o.customer.phone,
                o.customer.email,
                o.total,
                o.payment_status,
                o.fulfillment_status,
                o.created_at
              ].join(","));
              const csvContent = [headers.join(","), ...rows].join("\n");
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

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="SEARCH BY ID, CUSTOMER, PHONE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-widest pl-10 pr-4 py-2.5 text-black outline-none focus:border-black uppercase"
          />
        </div>

        {/* Fulfillment Status */}
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL FULFILLMENTS</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL PAYMENTS</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400 tracking-widest uppercase">
                    NO COMPATIBLE TRANSACTIONS LOCATED
                  </td>
                </tr>
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
                    <td className="p-4 text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 font-bold text-black text-xs">₹{order.total.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${
                        order.payment_status === "Paid" ? "bg-green-100 text-green-700" :
                        order.payment_status === "Refunded" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${
                        order.fulfillment_status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.fulfillment_status === "Cancelled" ? "bg-red-100 text-red-700" :
                        order.fulfillment_status === "Processing" ? "bg-zinc-100 text-zinc-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          title="View Details"
                          className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(order.id)}
                          title="Print Invoice"
                          className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"
                        >
                          <Printer size={12} />
                        </button>
                        <button
                          onClick={() => handleManualAction(order.id, "EDIT_METADATA")}
                          title="Internal Edit"
                          className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white"
                        >
                          <Edit2 size={12} />
                        </button>
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

// ==========================================
// 3. DELIVERY TRACKING VIEW SUB-COMPONENT
// ==========================================
interface DeliveryViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedOrderId: (id: string) => void;
}

function DeliveryView({ orders, setOrders, setSelectedOrderId }: DeliveryViewProps) {
  const [selectedCourier, setSelectedCourier] = useState<string>("ALL");
  const [selectedTransitStatus, setSelectedTransitStatus] = useState<string>("ALL");

  // Keep in transit orders (active shipments)
  const shipments = useMemo(() => {
    return orders
      .filter(o => o.fulfillment_status !== "Cancelled" && o.fulfillment_status !== "Processing")
      .map(o => ({
        id: o.id,
        customer: o.customer,
        fulfillment_status: o.fulfillment_status,
        total: o.total,
        tracking: o.tracking,
        created_at: o.created_at
      }));
  }, [orders]);

  // Filters logic
  const filteredShipments = useMemo(() => {
    return shipments.filter(ship => {
      const matchesCourier = selectedCourier === "ALL" || ship.tracking.courier === selectedCourier;
      
      let matchesStatus = true;
      if (selectedTransitStatus !== "ALL") {
        if (selectedTransitStatus === "DELAYED") {
          matchesStatus = ship.tracking.status === "Delayed";
        } else if (selectedTransitStatus === "DELIVERED") {
          matchesStatus = ship.fulfillment_status === "Delivered";
        } else if (selectedTransitStatus === "IN_TRANSIT") {
          matchesStatus = ["Dispatched", "In Transit", "Packed"].includes(ship.fulfillment_status);
        }
      }

      return matchesCourier && matchesStatus;
    });
  }, [shipments, selectedCourier, selectedTransitStatus]);

  // Bulk Actions
  const handleBulkMarkDelivered = () => {
    const activeIds = filteredShipments.filter(s => s.fulfillment_status !== "Delivered").map(s => s.id);
    if (activeIds.length === 0) {
      toast("NO SHIPMENTS AWAITING DELIVERY STATUS", { icon: "ℹ️" });
      return;
    }

    setOrders(prev => prev.map(o => {
      if (activeIds.includes(o.id)) {
        return {
          ...o,
          fulfillment_status: "Delivered",
          tracking: {
            ...o.tracking,
            status: "On Time",
            location: "Delivered - Confirmed via bulk override",
            delivered_at: new Date().toISOString()
          }
        };
      }
      return o;
    }));

    toast.success(`MARKED ${activeIds.length} ORDERS AS DELIVERED`);
  };

  const handleBulkSMSAlert = () => {
    toast.success("SMS METRICS TRIGGERED: DISPATCHING VIA SMS SYSTEM");
  };

  // Edit current location manually
  const handleUpdateLocation = (orderId: string, location: string) => {
    if (!location.trim()) return;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          tracking: { ...o.tracking, location: location.trim() }
        };
      }
      return o;
    }));
    toast.success(`AWB LOCATION RE-ROUTE SAVED FOR ${orderId}`);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">DELIVERY LOGISTICS</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">REAL-TIME SHIPMENT MANAGEMENT & COURIER API</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBulkMarkDelivered}
            className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-[0.2em] transition-all uppercase"
          >
            MARK SELECTED DELIVERED
          </button>
          <button
            onClick={handleBulkSMSAlert}
            className="border border-[#e4e4e7] hover:border-black px-4 py-2.5 text-[9px] font-bold tracking-[0.2em] transition-all bg-white text-black hover:bg-zinc-50 uppercase shadow-sm"
          >
            SEND SMS UPDATES
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL CARRIERS</option>
            <option value="Delhivery">Delhivery</option>
            <option value="Bluedart">Bluedart</option>
            <option value="Xpressbees">Xpressbees</option>
            <option value="Shiprocket">Shiprocket</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={selectedTransitStatus}
            onChange={(e) => setSelectedTransitStatus(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL SHIPMENT STATUS</option>
            <option value="IN_TRANSIT">In Transit / Active</option>
            <option value="DELAYED">Delayed / Critical</option>
            <option value="DELIVERED">Delivered / Archival</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase px-4 font-mono font-bold">
          <div>DELAY CRITICALS: <span className="text-red-600 font-black">{shipments.filter(s => s.tracking.status === "Delayed" && s.fulfillment_status !== "Delivered").length} ALERT(S)</span></div>
        </div>
      </div>

      {/* Shipment Tracker List */}
      <div className="space-y-6">
        {filteredShipments.length === 0 ? (
          <div className="border border-[#e4e4e7] bg-white p-12 text-center text-xs font-mono text-zinc-400 tracking-widest uppercase shadow-sm">
            NO ACTIVE CARRIER STREAMS
          </div>
        ) : (
          filteredShipments.map((ship) => {
            const isDelayed = ship.tracking.status === "Delayed" && ship.fulfillment_status !== "Delivered";
            return (
              <div
                key={ship.id}
                className={`border bg-white p-6 rounded-none space-y-6 transition-all shadow-sm ${
                  isDelayed ? "border-red-300 bg-red-50/10" : "border-[#e4e4e7]"
                }`}
              >
                {/* Header Information */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#e4e4e7] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrderId(ship.id)}
                        className="text-xs font-black text-black hover:underline tracking-widest font-mono uppercase"
                      >
                        {ship.id}
                      </button>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-widest font-mono uppercase">
                        {ship.customer.name}
                      </span>
                      {isDelayed && (
                        <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black bg-red-100 text-red-600 uppercase tracking-widest font-mono">
                          DELAYED ALERT
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      AWB: <span className="text-black font-bold">{ship.tracking.awb || "N/A"}</span> • CARRIER: <span className="text-black font-bold uppercase">{ship.tracking.courier}</span>
                    </div>
                  </div>

                  {/* Shipment ETA Details */}
                  <div className="flex items-center gap-6 font-mono text-[10px] text-right">
                    <div>
                      <span className="text-zinc-400 block uppercase font-bold tracking-widest">ETA DATE</span>
                      <span className={`font-bold block ${isDelayed ? "text-red-600" : "text-black"}`}>
                        {ship.tracking.eta ? new Date(ship.tracking.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block uppercase font-bold tracking-widest">DELIVERY STATUS</span>
                      <span className={`font-black uppercase block ${
                        ship.fulfillment_status === 'Delivered' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {ship.fulfillment_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Step Tracker Bar */}
                <div className="py-2">
                  <DeliveryProgressTracker status={ship.fulfillment_status} />
                </div>

                {/* Tracking Updates Manual Controls */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#fafafa] border border-[#e4e4e7] p-4 font-mono text-[11px] shadow-inner">
                  <div className="space-y-1 md:max-w-xl w-full">
                    <span className="text-[9px] font-black text-zinc-400 block uppercase tracking-widest">LIVE LOCATION STREAM</span>
                    <span className="text-zinc-700 block truncate font-sans text-xs">{ship.tracking.location || "NO REGISTERED LOCATION STOPS"}</span>
                  </div>

                  {/* Manual Location Update input */}
                  <div className="flex gap-2 shrink-0 md:max-w-xs w-full">
                    <input
                      type="text"
                      placeholder="SET CURRENT STOP"
                      defaultValue=""
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateLocation(ship.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="bg-white border border-[#e4e4e7] text-[9px] px-3 py-2 text-black outline-none w-full tracking-widest placeholder-[#a1a1aa] uppercase focus:border-black"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        handleUpdateLocation(ship.id, input.value);
                        input.value = "";
                      }}
                      className="bg-black hover:bg-zinc-800 text-white text-[9px] font-black tracking-widest px-4 uppercase"
                    >
                      SAVE
                    </button>
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

// 6 Stages Step Tracker Progress Bar
function DeliveryProgressTracker({ status }: { status: string }) {
  const stages = ["Order Placed", "Confirmed", "Packed", "Dispatched", "In Transit", "Delivered"];
  
  // Calculate active index
  let activeIndex = 0;
  if (status === "Processing") activeIndex = 1;
  else if (status === "Packed") activeIndex = 2;
  else if (status === "Dispatched") activeIndex = 3;
  else if (status === "In Transit") activeIndex = 4;
  else if (status === "Delivered") activeIndex = 5;

  return (
    <div className="w-full py-4">
      {/* Tracker Bar Lines */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#e4e4e7] w-full z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-green-600 transition-all duration-500 z-0"
          style={{ width: `${(activeIndex / 5) * 100}%` }}
        />

        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              {/* Dot indicator */}
              <div
                className={`h-4 w-4 rounded-none border transition-all duration-300 ${
                  isActive ? "bg-white border-green-600 scale-125 ring-2 ring-green-600/20" :
                  isCompleted ? "bg-green-600 border-green-600" : "bg-white border-zinc-300"
                }`}
              />
              <span className={`text-[8px] font-black uppercase tracking-widest mt-2 font-mono whitespace-nowrap ${
                isActive ? "text-green-600 font-extrabold" :
                isCompleted ? "text-black" : "text-zinc-400"
              }`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. WAITLIST MANAGER SUB-COMPONENT
// ==========================================
interface WaitlistViewProps {
  waitlist: any[];
  setWaitlist: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedWaitlistUser: (user: any) => void;
}

function WaitlistView({ waitlist, setWaitlist, setSelectedWaitlistUser }: WaitlistViewProps) {
  const [sizeFilter, setSizeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [notifyFilter, setNotifyFilter] = useState("ALL");

  // Calculations for Stats Bar
  const stats = useMemo(() => {
    const total = waitlist.length;
    const males = waitlist.filter(w => w.gender === "Male").length;
    const females = waitlist.filter(w => w.gender === "Female").length;
    const notified = waitlist.filter(w => w.notified_status !== "Not Notified").length;
    const converted = waitlist.filter(w => w.notified_status === "Converted to Order").length;

    // Size Popularity distribution map
    const sizesMap: Record<string, number> = {};
    waitlist.forEach(w => {
      sizesMap[w.size] = (sizesMap[w.size] || 0) + 1;
    });

    return { total, males, females, notified, converted, sizesMap };
  }, [waitlist]);

  // Filtering
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
    if (eligibleCount === 0) {
      toast("NO NEW WAITLIST MEMBERS TO NOTIFY", { icon: "ℹ️" });
      return;
    }

    setWaitlist(prev => prev.map(w => {
      const isMatch = filteredWaitlist.some(f => f.id === w.id);
      if (isMatch && w.notified_status === "Not Notified") {
        return { ...w, notified_status: "Email Sent" };
      }
      return w;
    }));

    toast.success(`LAUNCH NOTIFICATIONS DEPLOYED TO ${eligibleCount} LEADS`);
  };

  const handleMarkNotified = (userId: number, status: string) => {
    setWaitlist(prev => prev.map(w => {
      if (w.id === userId) {
        return { ...w, notified_status: status };
      }
      return w;
    }));
    toast.success(`STATUS SHIFTED TO ${status.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">WAITLIST REGISTRY</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">LEAD ENGINE & SIZE POPULARITY METRICS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerBulkEmail}
            className="bg-black hover:bg-zinc-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-[0.2em] transition-all uppercase"
          >
            SEND BULK LAUNCH EMAIL
          </button>
        </div>
      </div>

      {/* Waitlist Analytics Bar */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 border border-[#e4e4e7] bg-white p-6 font-mono text-xs shadow-sm">
        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">TOTAL SUBSCRIBERS</span>
          <span className="text-2xl font-black text-black mt-1 block">{stats.total} LEADS</span>
          <span className="text-[9px] text-zinc-500 mt-1 block uppercase">ACTIVE LAUNCH RESERVATIONS</span>
        </div>

        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">DEMOGRAPHIC SPLIT</span>
          <div className="mt-2 space-y-1 font-semibold text-black">
            <div className="flex justify-between">
              <span>MALE:</span>
              <span>{stats.males} ({((stats.males/stats.total)*100).toFixed(0)}%)</span>
            </div>
            <div className="flex justify-between">
              <span>FEMALE:</span>
              <span>{stats.females} ({((stats.females/stats.total)*100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-zinc-400 block uppercase font-bold tracking-widest">NOTIFIED / CONVERTED</span>
          <div className="mt-2 space-y-1 font-semibold">
            <div className="flex justify-between text-amber-600">
              <span>ALERTS SENT:</span>
              <span>{stats.notified} Leads</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>CONVERSIONS:</span>
              <span>{stats.converted} ({((stats.converted/stats.total)*100).toFixed(1)}%)</span>
            </div>
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
                  <div
                    className="w-full bg-zinc-300 group-hover:bg-black transition-all rounded-none"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[7px] text-zinc-400 font-black mt-1 font-mono uppercase truncate">{s.split(" ")[1]}</span>
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-black text-white text-[7px] font-black px-1 py-0.5 rounded-none tracking-widest uppercase transition-all z-10 font-mono whitespace-nowrap">
                    {s}: {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border border-[#e4e4e7] bg-white p-5 font-mono shadow-sm">
        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL UK SIZES</option>
            <option value="UK 6">UK 6</option>
            <option value="UK 7">UK 7</option>
            <option value="UK 8">UK 8</option>
            <option value="UK 9">UK 9</option>
            <option value="UK 10">UK 10</option>
            <option value="UK 11">UK 11</option>
          </select>
        </div>

        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL GENDERS</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="flex items-center bg-white border border-[#e4e4e7] px-3 py-1">
          <Filter size={12} className="text-zinc-400 mr-2" />
          <select
            value={notifyFilter}
            onChange={(e) => setNotifyFilter(e.target.value)}
            className="bg-transparent border-none text-[10px] tracking-widest text-black outline-none w-full uppercase"
          >
            <option value="ALL">ALL ALERTS STATUS</option>
            <option value="Not Notified">Not Notified</option>
            <option value="Email Sent">Email Sent</option>
            <option value="SMS Sent">SMS Sent</option>
            <option value="Converted to Order">Converted to Order</option>
          </select>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                <th className="p-4 text-center">#</th>
                <th className="p-4">SUBSCRIBER</th>
                <th className="p-4">GENDER</th>
                <th className="p-4 text-center">SIZE (UK)</th>
                <th className="p-4">REGION</th>
                <th className="p-4">DATE JOINED</th>
                <th className="p-4 text-center">NOTIFIED STATE</th>
                <th className="p-4 text-right">MANUAL ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {filteredWaitlist.map((user, idx) => (
                <tr key={user.id} className="hover:bg-[#fafafa]">
                  <td className="p-4 text-center text-zinc-500 font-bold">{idx + 1}</td>
                  <td className="p-4 font-sans">
                    <button
                      onClick={() => setSelectedWaitlistUser(user)}
                      className="font-bold text-black text-xs hover:underline uppercase tracking-wide text-left block"
                    >
                      {user.name}
                    </button>
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">{user.email} {user.phone ? `• ${user.phone}` : ""}</div>
                  </td>
                  <td className="p-4 text-black font-bold">{user.gender}</td>
                  <td className="p-4 text-center font-bold text-black text-xs">{user.size.split(" ")[1] || user.size}</td>
                  <td className="p-4 text-zinc-500 font-sans">{user.city || "UNKNOWN"}</td>
                  <td className="p-4 text-zinc-500">
                    {new Date(user.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${
                      user.notified_status === "Converted to Order" ? "bg-green-100 text-green-700" :
                      user.notified_status === "Not Notified" ? "bg-zinc-100 text-zinc-600" : "bg-amber-100 text-amber-700"
                    }`}>
                      {user.notified_status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleMarkNotified(user.id, "Email Sent")}
                        className="text-[8px] font-extrabold tracking-widest border border-[#e4e4e7] hover:border-black px-2 py-1 transition-all uppercase bg-white text-zinc-500 hover:text-black shadow-sm"
                      >
                        EMAIL
                      </button>
                      <button
                        onClick={() => handleMarkNotified(user.id, "Converted to Order")}
                        className="text-[8px] font-extrabold tracking-widest bg-black hover:bg-zinc-800 px-2 py-1 transition-all uppercase text-white"
                      >
                        CONVERT
                      </button>
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

// ==========================================
// 5. INVENTORY & SKUs VIEW SUB-COMPONENT
// ==========================================
interface InventoryViewProps {
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  setEditSku: (sku: any) => void;
}

function InventoryView({ inventory, setInventory, setEditSku }: InventoryViewProps) {
  const [restockSku, setRestockSku] = useState("");
  const [restockQty, setRestockQty] = useState(0);

  const handleBulkRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockSku) {
      toast.error("PLEASE SELECT AN ACTIVE SKU");
      return;
    }
    if (restockQty <= 0) {
      toast.error("INVALID QUANTITY VALUE");
      return;
    }

    setInventory(prev => prev.map(sku => {
      if (sku.sku === restockSku) {
        return {
          ...sku,
          quantity: sku.quantity + restockQty,
          restocked_at: new Date().toISOString().split('T')[0]
        };
      }
      return sku;
    }));

    toast.success(`INVENTORY RESTOCKED FOR SKU ${restockSku}: +${restockQty} UNITS`);
    setRestockSku("");
    setRestockQty(0);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: SKUs table */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">INVENTORY LOGISTICS</h1>
          <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">PRODUCT STOCK LEVELS & REORDER SYSTEMS</p>
        </div>

        <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                  <th className="p-4">SKU CODE</th>
                  <th className="p-4">ITEM NAME</th>
                  <th className="p-4">VARIANT SPEC</th>
                  <th className="p-4 text-center">QUANTITY</th>
                  <th className="p-4 text-center">THRESHOLD</th>
                  <th className="p-4 text-center">STATUS</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {inventory.map((sku) => {
                  const isCritical = sku.quantity === 0;
                  const isLow = sku.quantity <= 5 && sku.quantity > 0;

                  return (
                    <tr key={sku.id} className={`hover:bg-[#fafafa] ${isCritical ? "bg-red-50/20" : ""}`}>
                      <td className="p-4 font-bold text-black text-xs">{sku.sku}</td>
                      <td className="p-4 font-sans font-semibold text-black text-xs">{sku.product_name}</td>
                      <td className="p-4 text-zinc-500 font-sans">{sku.variant}</td>
                      <td className="p-4 text-center font-bold text-black text-xs">{sku.quantity}</td>
                      <td className="p-4 text-center text-zinc-500 font-bold">{sku.threshold}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${
                          isCritical ? "bg-red-100 text-red-700" :
                          isLow ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        }`}>
                          {isCritical ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "OK"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditSku(sku)}
                          className="p-1.5 border border-[#e4e4e7] hover:border-black text-zinc-500 hover:text-black transition-all bg-white shadow-sm"
                        >
                          <Edit2 size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: Restock Action Panel */}
      <div className="space-y-6 lg:col-span-1">
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-6 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            INVENTORY RESTOCK PANEL
          </span>

          <form onSubmit={handleBulkRestock} className="space-y-5 font-mono text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">SELECT ACTIVE SKU</label>
              <select
                value={restockSku}
                onChange={(e) => setRestockSku(e.target.value)}
                className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-wider px-3 py-2.5 text-black outline-none w-full uppercase focus:border-black"
              >
                <option value="">CHOOSE SKU CODE</option>
                {inventory.map(sku => (
                  <option key={sku.id} value={sku.sku}>{sku.sku} ({sku.product_name.split(" ")[0]})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">RESTOCK QUANTITY (UNITS)</label>
              <input
                type="number"
                min="1"
                placeholder="UNITS COUNT"
                value={restockQty || ""}
                onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#e4e4e7] text-[10px] tracking-wider px-4 py-2.5 text-black outline-none placeholder-[#a1a1aa] font-mono focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.25em] py-3.5 transition-all uppercase"
            >
              SAVE INVENTORY LEVEL
            </button>
          </form>
        </div>

        {/* System Threshold Log */}
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            THRESHOLD LOG PROTOCOL
          </span>
          <p className="text-[10px] leading-relaxed text-zinc-500 uppercase tracking-[0.05em]">
            SYSTEM AUTOMATICALLY DISPATCHES ALERT CORRESPONDENCE TO WHITELISTED ADMINS WHEN SKU VALUES LOWER BEYOND THEIR SET CONFIGURATIONS.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. RETURNS & REFUNDS VIEW SUB-COMPONENT
// ==========================================
interface ReturnsViewProps {
  returns: any[];
  setReturns: React.Dispatch<React.SetStateAction<any[]>>;
  setEditReturnId: (id: string) => void;
  orders: any[];
}

function ReturnsView({ returns, setReturns, setEditReturnId, orders }: ReturnsViewProps) {
  const handleApproveReturn = (returnId: string) => {
    setReturns(prev => prev.map(ret => {
      if (ret.id === returnId) {
        return { ...ret, status: "Processed" };
      }
      return ret;
    }));
    toast.success(`RETURN SYSTEM APPROVED FOR ${returnId}`);
  };

  const handleRejectReturn = (returnId: string) => {
    setReturns(prev => prev.map(ret => {
      if (ret.id === returnId) {
        return { ...ret, status: "Rejected" };
      }
      return ret;
    }));
    toast.error(`RETURN PROTOCOL REJECTED FOR ${returnId}`);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">RETURNS & REFUNDS LOGGER</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">LOGISTICS OF COMPLAINTS & ORIGINAL CHARGEBACKS</p>
      </div>

      {/* Return request list */}
      <div className="border border-[#e4e4e7] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fafafa] text-zinc-500 font-extrabold uppercase tracking-[0.2em] text-[9px]">
                <th className="p-4">RETURN ID</th>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">REASON TYPE</th>
                <th className="p-4">INITIATED</th>
                <th className="p-4 text-center">RECEIVED BACK</th>
                <th className="p-4 text-center">REFUND AMOUNT</th>
                <th className="p-4 text-center">METHOD</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-right">SYSTEM ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {returns.map((ret) => (
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
                    <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black uppercase ${
                      ret.received === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {ret.received === "Yes" ? `YES ${ret.received_date ? `(${ret.received_date})` : ""}` : "NO"}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-black text-xs">₹{ret.refund_amount.toLocaleString()}</td>
                  <td className="p-4 text-center text-zinc-500 uppercase">{ret.method}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase ${
                      ret.status === "Processed" ? "bg-green-100 text-green-700" :
                      ret.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ret.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleApproveReturn(ret.id)}
                            className="text-[8px] font-extrabold tracking-widest bg-black hover:bg-zinc-800 px-2 py-1 transition-all uppercase text-white"
                          >
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleRejectReturn(ret.id)}
                            className="text-[8px] font-extrabold tracking-widest border border-red-200 hover:border-red-600 text-red-600 px-2 py-1 transition-all uppercase bg-white hover:bg-red-50/50 shadow-sm"
                          >
                            REJECT
                          </button>
                        </>
                      ) : (
                        <span className="text-[8px] text-zinc-400 tracking-widest uppercase">CLOSED</span>
                      )}
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

// ==========================================
// 7. ANALYTICS VIEW SUB-COMPONENT (CUSTOM SVG CHARTS)
// ==========================================
interface AnalyticsViewProps {
  orders: any[];
  waitlist: any[];
  inventory: any[];
}

function AnalyticsView({ orders, waitlist, inventory }: AnalyticsViewProps) {
  // Precision SVG line coordinates generator
  const mockOrdersTrend = [
    { label: "05/11", value: 3 },
    { label: "05/12", value: 6 },
    { label: "05/13", value: 4 },
    { label: "05/14", value: 8 },
    { label: "05/15", value: 12 },
    { label: "05/16", value: 14 },
    { label: "05/17", value: 9 }
  ];

  const mockRevenueTrend = [
    { label: "05/11", value: 26997 },
    { label: "05/12", value: 53994 },
    { label: "05/13", value: 35996 },
    { label: "05/14", value: 71992 },
    { label: "05/15", value: 107988 },
    { label: "05/16", value: 125986 },
    { label: "05/17", value: 80991 }
  ];

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = 20;

  // Max calculations
  const maxOrderVal = Math.max(...mockOrdersTrend.map(t => t.value), 1);
  const maxRevenueVal = Math.max(...mockRevenueTrend.map(t => t.value), 1);

  // Line coordinates helper
  const orderPoints = mockOrdersTrend.map((t, idx) => {
    const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
    const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM ANALYTICS</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">OPERATIONAL PERFORMANCE & MONOCHROME DATA STREAMS</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Orders Line Chart */}
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            ORDERS STREAM (LAST 7 DAYS)
          </span>

          <div className="relative pt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grids */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = padding + p * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#e4e4e7"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Line */}
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                points={orderPoints}
              />
              {/* Dots */}
              {mockOrdersTrend.map((t, idx) => {
                const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
                const y = height - padding - (t.value / maxOrderVal) * (height - padding * 2);
                return (
                  <g key={idx} className="group">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      stroke="black"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      fill="black"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      {t.value}
                    </text>
                  </g>
                );
              })}
              {/* X Axis Labels */}
              {mockOrdersTrend.map((t, idx) => {
                const x = padding + (idx / (mockOrdersTrend.length - 1)) * (width - padding * 2);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={height - 2}
                    fill="#a1a1aa"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="font-bold"
                  >
                    {t.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-4">
            REVENUE LOGS (LAST 7 DAYS)
          </span>

          <div className="relative pt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grids */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = padding + p * (height - padding * 2);
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#e4e4e7"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Bars */}
              {mockRevenueTrend.map((t, idx) => {
                const barWidth = 30;
                const x = padding + (idx / (mockRevenueTrend.length - 1)) * (width - padding * 2) - barWidth / 2;
                const barHeight = (t.value / maxRevenueVal) * (height - padding * 2);
                const y = height - padding - barHeight;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="#f4f4f5"
                      stroke="#a1a1aa"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="black"
                      fontSize="7"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      ₹{(t.value / 1000).toFixed(0)}K
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={height - 2}
                      fill="#a1a1aa"
                      fontSize="7"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Demographics & Demands Bento Split */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            TOP METRO CITIES BY VOLUME
          </span>
          <div className="space-y-2 font-semibold">
            {[
              { city: "BENGALURU, KA", share: "34%", orders: 48 },
              { city: "MUMBAI, MH", share: "28%", orders: 40 },
              { city: "NEW DELHI, DL", share: "18%", orders: 25 },
              { city: "HYDERABAD, TS", share: "12%", orders: 17 },
              { city: "CHENNAI, TN", share: "8%", orders: 11 }
            ].map((c, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-[#f4f4f5]">
                <span className="text-zinc-700">{c.city}</span>
                <span className="text-black">{c.orders} Orders ({c.share})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            DELIVERY PERFORMANCE CODES
          </span>
          <div className="space-y-3 pt-2">
            {[
              { label: "ON-TIME SHIPMENTS", value: "85.7%", color: "text-green-600" },
              { label: "DELAYED SHIPMENTS", value: "14.3%", color: "text-amber-600" },
              { label: "FAILED ATTEMPTS", value: "0.0%", color: "text-zinc-500" }
            ].map((perf, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold text-[10px]">{perf.label}</span>
                <span className={`font-black text-sm ${perf.color}`}>{perf.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase block border-b border-[#e4e4e7] pb-3">
            TOP-SELLING SKUs
          </span>
          <div className="space-y-2">
            {[
              { sku: "CD-01-BW", share: 44, label: "Midnight stealth Upper" },
              { sku: "CD-02-WO", share: 36, label: "White Outsole v1" },
              { sku: "CD-05-BO", share: 20, label: "Black Outsole v1" }
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-zinc-700">{s.sku} ({s.label.split(" ")[0]})</span>
                  <span className="text-black font-bold">{s.share}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1">
                  <div className="bg-black h-full" style={{ width: `${s.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. SETTINGS VIEW SUB-COMPONENT
// ==========================================
interface SettingsViewProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
}

function SettingsView({ settings, setSettings }: SettingsViewProps) {
  const [emailsText, setEmailsText] = useState(settings.admin_emails.join(", "));
  const [gstNum, setGstNum] = useState(settings.store.gst);
  const [storeAddress, setStoreAddress] = useState(settings.store.address);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emailsText.split(",").map((em: string) => em.trim().toLowerCase()).filter(Boolean);
    
    setSettings((prev: any) => ({
      ...prev,
      admin_emails: emailList,
      store: {
        ...prev.store,
        gst: gstNum.trim().toUpperCase(),
        address: storeAddress.trim()
      }
    }));

    toast.success("SYSTEM PARAMETERS REGISTERED SUCCESSFUL");
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-black">SYSTEM CONFIGURATION</h1>
        <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-semibold mt-1">WHITELIST MANAGEMENT & API CONNECTIONS</p>
      </div>

      <form onSubmit={handleSaveSettings} className="border border-[#e4e4e7] bg-white p-8 space-y-8 font-mono text-[11px] shadow-sm">
        {/* Whitelist section */}
        <div className="space-y-3">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-3">
            ADMIN EMAILS WHITELIST
          </span>
          <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">
            ONLY ADDRESSES LISTED IN THE INPUT FIELD BELOW ARE GRANTED SECURITY ACCESS CHANNELS TO OPERATE THE ADMIN PORTAL CONSOLE. SEPARATE CONTEXTS WITH COMMAS.
          </p>
          <input
            type="text"
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            className="w-full bg-white border border-[#e4e4e7] px-4 py-3 text-xs text-black outline-none focus:border-black uppercase"
          />
        </div>

        {/* GST & Invoicing detail section */}
        <div className="space-y-4">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-3">
            GST & REGISTRATION PARAMETERS
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">GSTIN / TAX IDENTIFIER</label>
              <input
                type="text"
                value={gstNum}
                onChange={(e) => setGstNum(e.target.value)}
                className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">REGISTERED TRADE NAME</label>
              <input
                type="text"
                disabled
                value={settings.store.name}
                className="w-full bg-zinc-50 border border-[#e4e4e7] px-4 py-2.5 text-xs text-zinc-400 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">CORRESPONDENCE PHYSICAL ADDRESS</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-3 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>
        </div>

        {/* Carrier keys configuration */}
        <div className="space-y-3">
          <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase block border-b border-[#e4e4e7] pb-3">
            LOGISTICS API ENCRYPTION KEYS (MOCK)
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["Delhivery Key", "Bluedart Token", "Shiprocket Webhook"].map((carrier, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{carrier}</label>
                <input
                  type="password"
                  value="••••••••••••••••••••••••"
                  disabled
                  className="w-full bg-zinc-50 border border-[#e4e4e7] px-4 py-2.5 text-xs text-zinc-400 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.25em] py-3.5 transition-all uppercase"
        >
          COMMIT SYSTEM MODIFICATIONS
        </button>
      </form>
    </div>
  );
}

// ==========================================
// SYSTEM DETAIL DRAWERS SUB-COMPONENTS
// ==========================================

// 1. Order Detail Drawer
interface OrderDetailDrawerProps {
  orderId: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
}

function OrderDetailDrawer({ orderId, orders, setOrders, onClose }: OrderDetailDrawerProps) {
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const [internalNotes, setInternalNotes] = useState(order?.notes || "");
  const [fulfillmentState, setFulfillmentState] = useState(order?.fulfillment_status || "Processing");
  const [paymentState, setPaymentState] = useState(order?.payment_status || "Pending");

  // Save detailed manual override changes
  const handleSaveDetails = () => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let updatedTracking = { ...o.tracking };
        
        // Auto stage updates for delivery if fulfillment status is changed
        if (fulfillmentState === "Delivered") {
          updatedTracking = {
            ...updatedTracking,
            status: "On Time",
            location: "Delivered - Signed and finalized via admin portal manual override",
            delivered_at: new Date().toISOString()
          };
        } else if (fulfillmentState === "In Transit") {
          updatedTracking = {
            ...updatedTracking,
            status: "On Time",
            location: "Dispatched from warehouse - In transit hub sorted"
          };
        }

        return {
          ...o,
          fulfillment_status: fulfillmentState,
          payment_status: paymentState,
          notes: internalNotes.trim(),
          tracking: updatedTracking
        };
      }
      return o;
    }));
    toast.success(`ORDER OVERRIDES COMMITTED FOR ${orderId}`);
    onClose();
  };

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex justify-end font-inter"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="w-full max-w-xl bg-white border-l border-[#e4e4e7] h-full z-10 flex flex-col justify-between overflow-y-auto shadow-xl"
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">TRANSACTION METADATA</span>
              <span className="text-lg font-black tracking-widest text-black font-mono uppercase block mt-1">{order.id}</span>
            </div>
            <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="space-y-2 border border-[#e4e4e7] p-4 bg-zinc-50">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">CUSTOMER DOSSIER</span>
              <div className="space-y-1 text-xs">
                <div className="text-black font-bold text-sm">{order.customer.name}</div>
                <div className="text-zinc-500 font-mono">{order.customer.phone}</div>
                <div className="text-zinc-500 font-mono">{order.customer.email}</div>
                <div className="text-zinc-700 leading-relaxed mt-2 pt-2 border-t border-[#e4e4e7]">{order.customer.address}</div>
              </div>
            </div>

            {/* Modular Items Breakdown */}
            <div className="space-y-3">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">ORDERED MODULAR ITEMS</span>
              <div className="space-y-2.5">
                {order.products.map((p: any, idx: number) => (
                  <div key={idx} className="border border-[#e4e4e7] p-3 bg-white flex items-center justify-between font-mono text-[11px] shadow-sm">
                    <div>
                      <span className="text-black font-bold text-xs block font-sans">{p.name}</span>
                      <span className="text-zinc-500 block font-semibold uppercase mt-0.5">SIZE: {p.size} • COLOR: {p.color}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-black font-bold block">₹{p.price.toLocaleString()}</span>
                      <span className="text-zinc-500 block">QTY: {p.quantity}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e4e4e7] pt-3 text-xs font-mono">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest">NET PAYABLE AMOUNT:</span>
                  <span className="text-black font-black text-sm">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipment details */}
            <div className="space-y-2 border border-[#e4e4e7] p-4 bg-zinc-50 font-mono text-xs">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">COURIER DISPATCH METRICS</span>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px]">PARTNER CARRIER:</span>
                  <span className="text-black font-bold block mt-0.5">{order.tracking.courier || "AWAITING"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase text-[9px]">AWB BILLING NO:</span>
                  <span className="text-black font-bold block mt-0.5">{order.tracking.awb || "UNASSIGNED"}</span>
                </div>
              </div>
            </div>

            {/* Status Overrides */}
            <div className="space-y-4 border border-[#e4e4e7] p-4 bg-zinc-50">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest">MANUAL STATUS OVERRIDES</span>
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold block uppercase tracking-widest">PAYMENT STATE</label>
                  <select
                    value={paymentState}
                    onChange={(e) => setPaymentState(e.target.value)}
                    className="w-full bg-white border border-[#e4e4e7] px-3 py-2 text-black outline-none w-full uppercase focus:border-black shadow-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold block uppercase tracking-widest">FULFILLMENT STAGE</label>
                  <select
                    value={fulfillmentState}
                    onChange={(e) => setFulfillmentState(e.target.value)}
                    className="w-full bg-white border border-[#e4e4e7] px-3 py-2 text-black outline-none w-full uppercase focus:border-black shadow-sm"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Internal Team Notes */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase block font-mono">INTERNAL DISPATCH NOTES</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="WRITE SECURE INTERNAL NOTE FOR WAREHOUSE PACKERS..."
                rows={3}
                className="w-full bg-white border border-[#e4e4e7] text-xs p-3 text-black outline-none focus:border-black placeholder-[#a1a1aa] uppercase font-sans shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-6 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            onClick={handleSaveDetails}
            className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-[0.25em] py-3.5 transition-all uppercase shadow-md"
          >
            COMMIT DETAILS CHANGES
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 2. Waitlist User Drawer
interface WaitlistUserDrawerProps {
  user: any;
  waitlist: any[];
  setWaitlist: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
}

function WaitlistUserDrawer({ user, waitlist, setWaitlist, onClose }: WaitlistUserDrawerProps) {
  const [notifyState, setNotifyState] = useState(user.notified_status);

  const handleSaveUser = () => {
    setWaitlist(prev => prev.map(w => {
      if (w.id === user.id) {
        return { ...w, notified_status: notifyState };
      }
      return w;
    }));
    toast.success(`WAITLIST LOG MODIFIED FOR ${user.name.toUpperCase()}`);
    onClose();
  };

  const simulateResendMail = () => {
    toast.success(`LAUNCH NOTIFICATION TRIGGERED TO ${user.email.toUpperCase()}`);
    setNotifyState("Email Sent");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex justify-end font-inter"
    >
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="w-full max-w-md bg-white border-l border-[#e4e4e7] h-full z-10 flex flex-col justify-between shadow-xl"
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">SUBSCRIBER CARD</span>
              <span className="text-base font-black tracking-widest text-black uppercase block mt-1">{user.name}</span>
            </div>
            <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Lead metrics */}
            <div className="border border-[#e4e4e7] p-4 bg-zinc-50 space-y-3 font-mono text-xs">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono">META DATA FIELDS</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">EMAIL:</span>
                  <span className="text-black select-all">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">PHONE NO:</span>
                  <span className="text-black select-all">{user.phone || "UNSPECIFIED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">JOIN REGION:</span>
                  <span className="text-black font-sans font-bold">{user.city || "UNKNOWN"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">SHOE SIZE:</span>
                  <span className="text-black font-sans font-bold">{user.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">GENDER BIAS:</span>
                  <span className="text-black font-sans font-bold">{user.gender}</span>
                </div>
              </div>
            </div>

            {/* Custom shoe configuration mock */}
            <div className="border border-[#e4e4e7] p-4 bg-zinc-50 shadow-sm">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono mb-3">CUSTOMIZER CANON BUILD</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-zinc-100 border border-[#e4e4e7] flex items-center justify-center font-mono font-bold text-xs text-zinc-500">
                  SH-X
                </div>
                <div className="font-mono text-[10px]">
                  <span className="text-black block font-sans font-bold text-xs">Arctic Outsole x Cobalt Stealth Upper</span>
                  <span className="text-zinc-500 block uppercase mt-0.5">SIZE: {user.size} • SYSTEM: MODULAR v1.0</span>
                </div>
              </div>
            </div>

            {/* Notification settings */}
            <div className="space-y-4">
              <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-widest font-mono">NOTIFICATION STATUS</span>
              <div className="flex gap-2">
                <select
                  value={notifyState}
                  onChange={(e) => setNotifyState(e.target.value)}
                  className="bg-white border border-[#e4e4e7] text-[10px] px-3 py-2 text-black outline-none w-full uppercase font-mono tracking-widest focus:border-black shadow-sm"
                >
                  <option value="Not Notified">Not Notified</option>
                  <option value="Email Sent">Email Sent</option>
                  <option value="SMS Sent">SMS Sent</option>
                  <option value="Converted to Order">Converted to Order</option>
                </select>
                <button
                  onClick={simulateResendMail}
                  className="border border-[#e4e4e7] hover:bg-zinc-50 px-3 py-2 text-[9px] font-extrabold tracking-widest bg-white text-black uppercase shrink-0 font-mono shadow-sm"
                >
                  SEND EMAIL NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e4e4e7] bg-[#fafafa]">
          <button
            onClick={handleSaveUser}
            className="w-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-[0.25em] py-3.5 transition-all uppercase shadow-md"
          >
            COMMIT SUBSCRIBER CARD
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 3. Inventory Edit Modal
interface InventoryEditModalProps {
  skuItem: any;
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
}

function InventoryEditModal({ skuItem, inventory, setInventory, onClose }: InventoryEditModalProps) {
  const [qty, setQty] = useState(skuItem.quantity);
  const [threshold, setThreshold] = useState(skuItem.threshold);

  const handleSaveChanges = () => {
    if (qty < 0 || threshold < 0) {
      toast.error("VALUES CANNOT BE NEGATIVE");
      return;
    }

    setInventory(prev => prev.map(sku => {
      if (sku.id === skuItem.id) {
        return {
          ...sku,
          quantity: qty,
          threshold: threshold,
          restocked_at: qty > skuItem.quantity ? new Date().toISOString().split('T')[0] : sku.restocked_at
        };
      }
      return sku;
    }));

    toast.success(`INVENTORY PROTOCOLS APPLIED FOR SKU ${skuItem.sku}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 font-inter"
    >
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm bg-white border border-[#e4e4e7] p-6 z-10 space-y-6 shadow-xl rounded-none"
      >
        {/* Header */}
        <div className="border-b border-[#e4e4e7] pb-4 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 block uppercase">INVENTORY ADJUSTMENT</span>
            <span className="text-sm font-black text-black font-mono tracking-widest block mt-0.5">{skuItem.sku}</span>
          </div>
          <button onClick={onClose} className="p-1 border border-[#e4e4e7] text-zinc-500 hover:text-black bg-white hover:bg-zinc-50 shadow-sm">
            <X size={14} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 font-mono text-[11px]">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">CURRENT QUANTITY IN WAREHOUSE</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">WARNING THRESHOLD LIMIT</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-[#e4e4e7] px-4 py-2.5 text-xs text-black outline-none focus:border-black uppercase"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 border border-[#e4e4e7] hover:bg-zinc-50 text-zinc-500 hover:text-black font-extrabold text-[9px] tracking-[0.2em] py-3.5 transition-all uppercase bg-white shadow-sm"
          >
            CANCEL
          </button>
          <button
            onClick={handleSaveChanges}
            className="w-1/2 bg-black hover:bg-zinc-800 text-white font-extrabold text-[9px] tracking-[0.2em] py-3.5 transition-all uppercase shadow-md"
          >
            SAVE QUANTITY
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
