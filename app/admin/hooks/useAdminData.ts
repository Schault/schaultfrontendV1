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
        payment_status,
        total,
        created_at,
        waybill,
        shipping_address,
        estimated_delivery,
        invoice_number,
        invoice_url,
        paid_at,
        razorpay_order_id,
        razorpay_payment_id,
        profiles ( full_name, id ),
        order_items (
          id,
          quantity,
          unit_price,
          line_total,
          product_name,
          product_image,
          product_sku,
          product_size,
          product_color,
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

    const formattedOrders = (data || []).map((order: any) => {
      const addr =
        typeof order.shipping_address === "object" && order.shipping_address !== null
          ? order.shipping_address
          : {};

      const customerName =
        order.profiles?.full_name || addr.full_name || addr.name || "Customer";
      const customerEmail = addr.email || "";
      const customerPhone = addr.phone || "";
      const fullAddressStr =
        typeof order.shipping_address === "string"
          ? order.shipping_address
          : [addr.address, addr.city, addr.state, addr.postal_code || addr.zip]
              .filter(Boolean)
              .join(", ");

      const rawPaymentStatus = order.payment_status || "paid";
      const formattedPaymentStatus =
        rawPaymentStatus.charAt(0).toUpperCase() +
        rawPaymentStatus.slice(1).toLowerCase();

      return {
        id: order.id,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: fullAddressStr || "N/A",
        },
        total: order.total,
        payment_status: formattedPaymentStatus,
        fulfillment_status: mapStatusToFrontend(order.status),
        created_at: order.created_at,
        notes: "",
        waybill: order.waybill || "",
        estimated_delivery: order.estimated_delivery || "",
        invoice_number: order.invoice_number || "",
        invoice_url: order.invoice_url || "",
        products: (order.order_items || []).map((item: any) => ({
          name:
            item.product_name ||
            item.product_variants?.products?.name ||
            "SCHAULT Modular Product",
          size: item.product_size || item.product_variants?.size || "Standard",
          color: item.product_color || item.product_variants?.color || "",
          price: item.unit_price,
          quantity: item.quantity,
        })),
        tracking: {
          courier: "Delhivery",
          awb: order.waybill || "",
          location: order.waybill
            ? `AWB ${order.waybill} assigned`
            : "Awaiting assignment",
          eta: order.estimated_delivery || "",
          attempts: 0,
          status:
            order.status === "shipped" || order.status === "out_for_delivery"
              ? "On Time"
              : "Pending",
        },
      };
    });

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
  // ORDER STATUS UPDATE (DIRECT SUPABASE DB)
  // ==========================================

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string, note?: string) => {
      const supabase = createClient();
      const backendStatus = mapStatusToBackend(newStatus);

      const { error: dbError } = await supabase
        .from("orders")
        .update({
          status: backendStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (dbError) {
        console.error("Direct updateOrderStatus error:", dbError);
        toast.error("FAILED TO UPDATE ORDER STATUS. PLEASE TRY AGAIN.");
        return false;
      }

      if (note) {
        await supabase.from("order_status_history").insert({
          order_id: orderId,
          status: backendStatus,
          note: note,
        });
      }

      toast.success("ORDER STATUS UPDATED SUCCESSFULLY");
      await fetchOrders();
      return true;
    },
    [fetchOrders]
  );

  // ==========================================
  // UPDATE EXTRA ORDER DETAILS (PAYMENT, WAYBILL)
  // ==========================================

  const updateOrderDetails = useCallback(
    async (
      orderId: string,
      updates: { payment_status?: string; waybill?: string; estimated_delivery?: string }
    ) => {
      const supabase = createClient();
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.payment_status) payload.payment_status = updates.payment_status.toLowerCase();
      if (updates.waybill !== undefined) payload.waybill = updates.waybill;
      if (updates.estimated_delivery !== undefined) payload.estimated_delivery = updates.estimated_delivery;

      const { error } = await supabase
        .from("orders")
        .update(payload)
        .eq("id", orderId);

      if (error) {
        console.error("updateOrderDetails error:", error);
        toast.error("FAILED TO PERSIST ORDER DETAILS.");
        return false;
      }

      toast.success("ORDER DETAILS PERSISTED TO BACKEND");
      await fetchOrders();
      return true;
    },
    [fetchOrders]
  );

  // ==========================================
  // WAITLIST USER STATUS UPDATE
  // ==========================================

  const updateWaitlistUserStatus = useCallback(
    async (userId: number | string, status: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("waitlist_users")
        .update({ notified_status: status })
        .eq("id", userId);

      if (error) {
        console.error("updateWaitlistUserStatus error:", error);
        toast.error("FAILED TO UPDATE WAITLIST USER STATUS.");
        return false;
      }

      toast.success(`WAITLIST STATUS UPDATED TO ${status.toUpperCase()}`);
      await fetchWaitlist();
      return true;
    },
    [fetchWaitlist]
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
    updateOrderDetails,
    updateWaitlistUserStatus,
    updateStockQuantity,

    // Computed
    dashboardStats,
    lowStockItems,
    todayWaitlistCount,
  };
}

