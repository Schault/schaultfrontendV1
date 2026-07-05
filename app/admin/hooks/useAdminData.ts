"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { mapStatusToFrontend, mapStatusToBackend } from "../lib/status-utils";
import { INITIAL_RETURNS, INITIAL_SETTINGS } from "../lib/constants";

export function useAdminData() {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Shared Data States — initialized empty, populated from Supabase
  const [orders, setOrders] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // ==========================================
  // SUPABASE DATA-FETCHING FUNCTIONS
  // ==========================================

  const fetchOrders = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        status,
        total,
        created_at,
        profiles ( full_name, id ),
        order_items (
          quantity,
          unit_price,
          product_variants (
            size,
            color,
            sku,
            products ( name )
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchOrders error:", error);
      toast.error("FAILED TO LOAD ORDERS. PLEASE TRY AGAIN.");
      return;
    }

    const formattedOrders = (data || []).map((order: any) => ({
      id: order.id,
      customer: {
        name: order.profiles?.full_name || "Unknown",
        email: "",
        phone: "",
        address: "",
      },
      total: order.total,
      payment_status: "Paid",
      fulfillment_status: mapStatusToFrontend(order.status),
      created_at: order.created_at,
      notes: "",
      products: (order.order_items || []).map((item: any) => ({
        name: item.product_variants?.products?.name || "Unknown Product",
        size: item.product_variants?.size || "",
        color: item.product_variants?.color || "",
        price: item.unit_price,
        quantity: item.quantity,
      })),
      tracking: {
        courier: "Pending",
        awb: "",
        location: "Awaiting assignment",
        eta: "",
        attempts: 0,
        status: "Pending",
      },
    }));

    setOrders(formattedOrders);
  }, []);

  const fetchInventory = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("product_variants")
      .select(
        `
        id,
        sku,
        size,
        color,
        stock_quantity,
        products ( name )
      `
      );

    if (error) {
      console.error("fetchInventory error:", error);
      toast.error("FAILED TO LOAD INVENTORY. PLEASE TRY AGAIN.");
      return;
    }

    const formattedInventory = (data || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      product_name: v.products?.name || "Unknown",
      variant: `${v.size} / ${v.color}`,
      quantity: v.stock_quantity,
      threshold: 10,
    }));

    setInventory(formattedInventory);
  }, []);

  const fetchWaitlist = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchWaitlist error:", error);
      toast.error("FAILED TO LOAD WAITLIST. PLEASE TRY AGAIN.");
      return;
    }

    setWaitlist(data || []);
  }, []);

  // ==========================================
  // ORDER STATUS UPDATE VIA EDGE FUNCTION
  // ==========================================

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string, note?: string) => {
      const supabase = createClient();
      const backendStatus = mapStatusToBackend(newStatus);

      const { data, error } = await supabase.functions.invoke(
        "update-order-status",
        {
          body: {
            order_id: orderId,
            new_status: backendStatus,
            note: note,
          },
        }
      );

      if (error) {
        console.error("updateOrderStatus error:", error);
        toast.error("FAILED TO UPDATE ORDER STATUS. PLEASE TRY AGAIN.");
        return false;
      }

      toast.success("ORDER STATUS UPDATED SUCCESSFULLY");
      await fetchOrders();
      return true;
    },
    [fetchOrders]
  );

  // ==========================================
  // INVENTORY UPDATE VIA SUPABASE DIRECT
  // ==========================================

  const updateStockQuantity = useCallback(
    async (variantId: string, newQuantity: number) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("product_variants")
        .update({ stock_quantity: newQuantity })
        .eq("id", variantId);

      if (error) {
        console.error("updateStockQuantity error:", error);
        toast.error("FAILED TO UPDATE STOCK. PLEASE TRY AGAIN.");
        return false;
      }

      toast.success("STOCK LEVEL UPDATED");
      await fetchInventory();
      return true;
    },
    [fetchInventory]
  );

  // ==========================================
  // AUTHENTICATION CHECK (SUPABASE SESSION)
  // ==========================================

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Verify admin role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        toast.error("UNAUTHORIZED ACCESS");
        router.push("/admin/login");
        return;
      }

      setIsAdminAuthenticated(true);
      setAdminEmail(session.user.email || "");
    };

    checkAuth();
  }, [router]);

  // ==========================================
  // FETCH DATA ONCE AUTHENTICATED
  // ==========================================

  useEffect(() => {
    if (isAdminAuthenticated) {
      setIsDataLoading(true);
      Promise.all([fetchOrders(), fetchInventory(), fetchWaitlist()]).finally(
        () => setIsDataLoading(false)
      );
    }
  }, [isAdminAuthenticated, fetchOrders, fetchInventory, fetchWaitlist]);

  // ==========================================
  // SIGN OUT
  // ==========================================

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("SECURE SESSION TERMINATED");
    router.push("/admin/login");
  }, [router]);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const dashboardStats = useMemo(() => {
    const activeOrders = orders.filter(
      (o) => o.fulfillment_status !== "Cancelled"
    );
    const totalOrdersCount = activeOrders.length;
    const inTransitCount = orders.filter((o) =>
      ["Shipped", "Out for Delivery"].includes(o.fulfillment_status)
    ).length;
    const deliveredCount = orders.filter(
      (o) => o.fulfillment_status === "Delivered"
    ).length;
    const waitlistCount = waitlist.length;
    const totalRevenue = activeOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    return {
      totalOrders: totalOrdersCount,
      inTransit: inTransitCount,
      delivered: deliveredCount,
      waitlist: waitlistCount,
      revenue: totalRevenue,
    };
  }, [orders, waitlist]);

  const lowStockItems = useMemo(() => {
    return inventory.filter((sku) => sku.quantity < 5);
  }, [inventory]);

  const todayWaitlistCount = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return waitlist.filter((w) => w.created_at?.startsWith(todayStr)).length;
  }, [waitlist]);

  return {
    // Auth
    isAdminAuthenticated,
    adminEmail,
    handleSignOut,

    // Loading
    isDataLoading,

    // Data
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

    // Actions
    fetchOrders,
    fetchInventory,
    fetchWaitlist,
    updateOrderStatus,
    updateStockQuantity,

    // Computed
    dashboardStats,
    lowStockItems,
    todayWaitlistCount,
  };
}
