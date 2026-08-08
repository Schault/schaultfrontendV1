import React from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getInvoiceData } from "../invoice/getInvoiceData";
import { OrderConfirmationEmail } from "./emailTemplates/OrderConfirmation";
import { SendOrderConfirmationResult, OrderConfirmationEmailProps } from "./emailTypes";

/**
 * Server-side Order Confirmation Email Service using Resend.
 *
 * Responsibilities:
 * - Database Idempotency: Checks `orders.email_sent` to prevent duplicate emails
 * - Generates 24-hour signed URL for invoice PDF download from Supabase Storage
 * - Fallback: Attaches PDF buffer if signed URL is unavailable
 * - Renders React Email template and sends via Resend SDK
 * - Updates `orders.email_sent`, `orders.email_sent_at`, and `orders.email_message_id` on success
 * - Failure handling: Logs failure without throwing error (order creation is prioritized)
 */
export async function sendOrderConfirmation(
  supabase: SupabaseClient,
  orderId: string
): Promise<SendOrderConfirmationResult> {
  if (!orderId) {
    return {
      success: false,
      orderId: "",
      error: "[sendOrderConfirmation] Order ID is required",
      isDuplicate: false,
    };
  }

  try {
    // 1. Idempotency Check: verify if email was already sent for this order
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id, email_sent, email_message_id, invoice_url")
      .eq("id", orderId)
      .single();

    if (checkError) {
      console.error(`[sendOrderConfirmation] Could not fetch order ${orderId} email status:`, checkError);
    }

    if (existingOrder?.email_sent) {
      console.log(`[sendOrderConfirmation] Email already sent for order ${orderId} (Message ID: ${existingOrder.email_message_id})`);
      return {
        success: true,
        orderId,
        messageId: existingOrder.email_message_id,
        isDuplicate: true,
      };
    }

    // 2. Fetch Structured Invoice Data
    const invoiceData = await getInvoiceData(supabase, orderId);

    // 3. Generate 24-Hour Signed URL for Invoice PDF
    let signedInvoiceUrl: string | null = null;
    let attachments: { filename: string; content: Buffer }[] | undefined = undefined;

    const rawInvoicePath = existingOrder?.invoice_url || `invoices/${new Date().getFullYear()}/${invoiceData.invoiceNumber}.pdf`;
    const cleanStoragePath = rawInvoicePath.replace(/^invoices\//, "");

    try {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("invoices")
        .createSignedUrl(cleanStoragePath, 86400); // 24 hours = 86400 seconds

      if (signedError || !signedData?.signedUrl) {
        console.warn(`[sendOrderConfirmation] Could not create signed URL for ${cleanStoragePath}:`, signedError?.message);
      } else {
        signedInvoiceUrl = signedData.signedUrl;
      }
    } catch (signedErr) {
      console.warn("[sendOrderConfirmation] Signed URL exception:", signedErr);
    }

    // Fallback: If signed URL creation failed, download PDF buffer to send as attachment
    if (!signedInvoiceUrl) {
      try {
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from("invoices")
          .download(cleanStoragePath);

        if (!downloadError && fileBlob) {
          const arrayBuf = await fileBlob.arrayBuffer();
          attachments = [
            {
              filename: `${invoiceData.invoiceNumber}.pdf`,
              content: Buffer.from(arrayBuf),
            },
          ];
          console.log(`[sendOrderConfirmation] Prepared PDF attachment fallback for Order ${orderId}`);
        }
      } catch (attachErr) {
        console.warn("[sendOrderConfirmation] Could not prepare PDF attachment fallback:", attachErr);
      }
    }

    // 4. Render Email Component Props
    const emailProps: OrderConfirmationEmailProps = {
      customerName: invoiceData.customer.name,
      orderId: invoiceData.orderId,
      invoiceNumber: invoiceData.invoiceNumber,
      orderDate: invoiceData.invoiceDate,
      paymentDate: invoiceData.paymentDate,
      paymentStatus: invoiceData.paymentStatus,
      paymentMethod: invoiceData.paymentMethod,
      items: invoiceData.items,
      customer: invoiceData.customer,
      subtotal: invoiceData.subtotal,
      shippingFee: invoiceData.shippingFee,
      discountAmount: invoiceData.discountAmount,
      taxAmount: invoiceData.taxAmount,
      grandTotal: invoiceData.grandTotal,
      signedInvoiceUrl,
    };

    // 5. Initialize Resend SDK and send email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("[sendOrderConfirmation] RESEND_API_KEY is not configured in environment.");
    }

    const resend = new Resend(resendApiKey || "re_placeholder");
    const senderEmail = process.env.RESEND_FROM_EMAIL || "orders@schault.com";
    const recipientEmail = invoiceData.customer.email;

    const resendResponse = await resend.emails.send({
      from: `SCHAULT Footwear <${senderEmail}>`,
      to: [recipientEmail],
      subject: `Order Confirmed: #${invoiceData.orderId} - SCHAULT`,
      react: React.createElement(OrderConfirmationEmail, emailProps) as React.ReactElement,
      attachments,
    });

    if (resendResponse.error) {
      console.error(`[sendOrderConfirmation] Resend API error for order ${orderId}:`, resendResponse.error);
      return {
        success: false,
        orderId,
        error: resendResponse.error.message,
        isDuplicate: false,
      };
    }

    const messageId = resendResponse.data?.id || `msg_${Date.now()}`;
    console.log(`[sendOrderConfirmation] Successfully sent order confirmation email to ${recipientEmail} for Order ${orderId} (Resend ID: ${messageId})`);

    // 6. Update orders table email tracking metadata
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
        email_message_id: messageId,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error(`[sendOrderConfirmation] Could not update email tracking state for Order ${orderId}:`, updateError);
    }

    return {
      success: true,
      orderId,
      messageId,
      isDuplicate: false,
    };
  } catch (err: any) {
    // Non-blocking failure handling: Log failure without throwing
    console.error(`[sendOrderConfirmation] Unhandled error for order ${orderId}:`, err);
    return {
      success: false,
      orderId,
      error: err?.message || "Unknown email delivery error",
      isDuplicate: false,
    };
  }
}
