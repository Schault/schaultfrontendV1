import React from "react";
import { pdf } from "@react-pdf/renderer";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { InvoiceData } from "./invoiceTypes";

/**
 * Server-side PDF Invoice Generator.
 * Receives structured invoice data and returns a binary PDF Buffer suitable for
 * server-side storage upload or HTTP streaming.
 *
 * - Does NOT query the database
 * - Does NOT upload to storage
 * - Does NOT write to local disk
 */
export async function generateInvoicePdf(invoiceData: InvoiceData): Promise<Buffer> {
  if (!invoiceData || !invoiceData.invoiceNumber) {
    throw new Error("[InvoiceEngine] Invalid invoice data provided");
  }

  const doc = React.createElement(InvoiceTemplate, { data: invoiceData });
  const instance = pdf(doc as any);

  // Use toBuffer() if available in Node.js environment, fallback to toBlob()
  if (typeof (instance as any).toBuffer === "function") {
    return await (instance as any).toBuffer();
  }

  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
