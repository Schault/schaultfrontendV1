import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Service-role client for signing storage objects. Ownership is verified with the
// user's session first; this only bypasses storage RLS to mint the signed URL.
const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DownloadInvoiceResult {
  success: boolean;
  signedUrl: string;
  invoiceNumber: string;
}

/**
 * Server Helper / Action: Generates a 24-hour signed download URL for an order's invoice PDF.
 * SECURITY: Enforces strict user ownership before generating signed URL.
 * Does NOT regenerate invoices — uses existing orders.invoice_url.
 */
export async function getSignedInvoiceUrl(orderId: string): Promise<DownloadInvoiceResult> {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const supabase = createClient();
  if (!supabase) {
    throw new Error("Database configuration error");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized access");
  }

  // 1. Verify ownership and fetch invoice_url
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, invoice_number, invoice_url, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found or unauthorized");
  }

  if (!order.invoice_url) {
    throw new Error("Invoice PDF has not been generated for this order yet");
  }

  // Extract relative storage path (e.g., '2026/INV-2026-0001.pdf' from 'invoices/2026/INV-2026-0001.pdf')
  const cleanPath = order.invoice_url.replace(/^invoices\//, "");

  // 2. Generate 24-hour signed URL from Supabase Storage (service-role: ownership
  //    already verified above; the private bucket has no user-facing read policy)
  const { data: signedData, error: signedError } = await adminSupabase.storage
    .from("invoices")
    .createSignedUrl(cleanPath, 86400); // 24 hours

  if (signedError || !signedData?.signedUrl) {
    console.error("[getSignedInvoiceUrl] Error creating signed URL:", signedError);
    throw new Error("Failed to generate secure download link for invoice");
  }

  return {
    success: true,
    signedUrl: signedData.signedUrl,
    invoiceNumber: order.invoice_number || "Invoice",
  };
}
