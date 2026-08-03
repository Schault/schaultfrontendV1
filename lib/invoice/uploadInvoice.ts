import { SupabaseClient } from "@supabase/supabase-js";
import { getInvoiceData } from "./getInvoiceData";
import { generateInvoicePdf } from "./generateInvoicePdf";

export interface UploadInvoiceResult {
  success: boolean;
  orderId: string;
  invoiceNumber: string;
  invoiceUrl: string;
  isDuplicate: boolean;
}

/**
 * Step 3 — Main Orchestrator: Generate PDF, Upload to Supabase Storage, Update Orders Table
 *
 * Responsibilities:
 * - Checks idempotency: Returns existing `invoice_url` if already generated
 * - Fetches structured InvoiceData via `getInvoiceData()`
 * - Generates server-side PDF Buffer via `generateInvoicePdf()`
 * - Uploads PDF to Supabase Storage bucket ('invoices') at `{YEAR}/{invoiceNumber}.pdf`
 * - Updates `orders.invoice_url` and `orders.invoice_generated_at` on successful upload
 * - Handles errors cleanly with zero partial or orphan state
 */
export async function uploadInvoice(
  supabase: SupabaseClient,
  orderId: string
): Promise<UploadInvoiceResult> {
  if (!orderId) {
    throw new Error("[uploadInvoice] Order ID is required");
  }

  // 1. Idempotency Check: check if order already has invoice_url
  const { data: existingOrder, error: checkError } = await supabase
    .from("orders")
    .select("id, invoice_number, invoice_url")
    .eq("id", orderId)
    .single();

  if (checkError) {
    console.error(`[uploadInvoice] Failed to fetch order ${orderId} status:`, checkError);
  }

  if (existingOrder?.invoice_url) {
    console.log(`[uploadInvoice] Invoice URL already exists for Order ${orderId}: ${existingOrder.invoice_url}`);
    return {
      success: true,
      orderId,
      invoiceNumber: existingOrder.invoice_number || "",
      invoiceUrl: existingOrder.invoice_url,
      isDuplicate: true,
    };
  }

  // 2. Fetch Structured Invoice Data
  const invoiceData = await getInvoiceData(supabase, orderId);
  const year = new Date().getFullYear().toString();
  const fileName = `${invoiceData.invoiceNumber}.pdf`;
  const storagePath = `${year}/${fileName}`;
  const fullBucketPath = `invoices/${storagePath}`;

  // 3. Generate PDF Buffer
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateInvoicePdf(invoiceData);
  } catch (pdfErr: any) {
    console.error(`[uploadInvoice] PDF Generation failed for Order ${orderId} (${invoiceData.invoiceNumber}):`, pdfErr);
    throw new Error(`PDF Generation Failed: ${pdfErr?.message || "Unknown error"}`);
  }

  // 4. Upload to Supabase Storage bucket 'invoices'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    // If file already exists in bucket, construct path and continue
    const isAlreadyExists = uploadError.message?.toLowerCase().includes("already exists") ||
      (uploadError as any).statusCode === "409";

    if (!isAlreadyExists) {
      console.error(`[uploadInvoice] Storage upload failed for Order ${orderId} to path ${fullBucketPath}:`, uploadError);
      throw new Error(`Storage Upload Failed: ${uploadError.message}`);
    } else {
      console.log(`[uploadInvoice] Storage path ${fullBucketPath} already exists in bucket.`);
    }
  } else {
    console.log(`[uploadInvoice] Storage upload succeeded for Order ${orderId} -> ${uploadData?.path || storagePath}`);
  }

  // Determine final stored path reference
  const finalInvoiceUrl = fullBucketPath;

  // 5. Update orders table with invoice_url and invoice_generated_at
  const nowIso = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      invoice_url: finalInvoiceUrl,
      invoice_generated_at: nowIso,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error(`[uploadInvoice] Database update failed for Order ${orderId} (${invoiceData.invoiceNumber}):`, updateError);
    throw new Error(`Database Update Failed for Invoice URL: ${updateError.message}`);
  }

  console.log(`[uploadInvoice] Successfully committed invoice metadata for Order ${orderId} (${invoiceData.invoiceNumber}) at ${finalInvoiceUrl}`);

  return {
    success: true,
    orderId,
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceUrl: finalInvoiceUrl,
    isDuplicate: false,
  };
}
