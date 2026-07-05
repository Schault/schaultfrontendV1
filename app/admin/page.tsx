"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCcw,
} from "lucide-react";

// Custom hook for all Supabase data + auth
import { useAdminData } from "./hooks/useAdminData";

// View components
import DashboardView from "./components/DashboardView";
import OrdersView from "./components/OrdersView";
import DeliveryView from "./components/DeliveryView";
import WaitlistView from "./components/WaitlistView";
import InventoryView from "./components/InventoryView";
import ReturnsView from "./components/ReturnsView";
import AnalyticsView from "./components/AnalyticsView";
import SettingsView from "./components/SettingsView";

// Drawers & Modals
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import WaitlistUserDrawer from "./components/WaitlistUserDrawer";
import InventoryEditModal from "./components/InventoryEditModal";

// ==========================================
// CENTRAL CONTROLLER
// ==========================================

export default function AdminHubPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Active drawers/modals state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedWaitlistUser, setSelectedWaitlistUser] = useState<any | null>(null);
  const [editInventorySku, setEditInventorySku] = useState<any | null>(null);
  const [editReturnId, setEditReturnId] = useState<string | null>(null);

  // All data, auth, and actions from Supabase
  const {
    isAdminAuthenticated,
    adminEmail,
    handleSignOut,
    isDataLoading,
    orders,
    setOrders,
    waitlist,
    setWaitlist,
    inventory,
    setInventory,
    returns,
    setReturns,
    settings,
    setSettings,
    updateOrderStatus,
    updateStockQuantity,
    dashboardStats,
    lowStockItems,
    todayWaitlistCount,
  } = useAdminData();

  // Sync active page tab from query parameters if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("page");
      if (
        tab &&
        [
          "dashboard",
          "orders",
          "delivery",
          "waitlist",
          "inventory",
          "returns",
          "analytics",
          "settings",
        ].includes(tab)
      ) {
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

  if (!isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-white" size={32} />
          <p className="font-mono text-xs tracking-[0.2em] text-[#666] uppercase">
            VERIFYING SECURE CREDENTIALS...
          </p>
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
              <span className="font-black text-sm tracking-[0.3em] block text-black">
                SCHAULT
              </span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#71717a] block uppercase">
                ADMIN ENGINE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
              {
                id: "orders",
                label: "ORDERS",
                icon: ShoppingBag,
                badge: orders.filter(
                  (o) => o.fulfillment_status === "Pending"
                ).length,
              },
              {
                id: "delivery",
                label: "DELIVERY TRACKING",
                icon: Truck,
                badge: orders.filter(
                  (o) => o.tracking?.status === "Delayed"
                ).length,
              },
              { id: "waitlist", label: "WAITLIST MANAGER", icon: Users },
              {
                id: "inventory",
                label: "INVENTORY",
                icon: Package,
                badge: lowStockItems.length,
              },
              {
                id: "returns",
                label: "RETURNS & REFUNDS",
                icon: RotateCcw,
                badge: returns.filter((r) => r.status === "Pending").length,
              },
              { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
              { id: "settings", label: "SETTINGS", icon: Settings },
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
                    <Icon
                      size={14}
                      className={isActive ? "text-black" : "text-zinc-400"}
                    />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 ? (
                    <span
                      className={`px-1.5 py-0.5 text-[8px] font-black rounded-none ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-zinc-100 text-red-600"
                      }`}
                    >
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
            <span className="text-[8px] font-semibold text-zinc-400 block uppercase tracking-widest">
              LOGGED IN AS
            </span>
            <span className="text-[10px] font-bold text-zinc-600 block truncate font-mono">
              {adminEmail}
            </span>
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
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#71717a] uppercase">
              SYS PROTOCOL: ONLINE
            </span>
            <span className="h-2 w-2 bg-green-600 animate-pulse rounded-full" />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-[#71717a]">
            <div className="font-mono text-black/50">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
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
                  updateStockQuantity={updateStockQuantity}
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
          MODALS & DRAWERS
          ========================================== */}

      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailDrawer
            orderId={selectedOrderId}
            orders={orders}
            setOrders={setOrders}
            onClose={() => setSelectedOrderId(null)}
            updateOrderStatus={updateOrderStatus}
          />
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {editInventorySku && (
          <InventoryEditModal
            skuItem={editInventorySku}
            inventory={inventory}
            setInventory={setInventory}
            onClose={() => setEditInventorySku(null)}
            updateStockQuantity={updateStockQuantity}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
