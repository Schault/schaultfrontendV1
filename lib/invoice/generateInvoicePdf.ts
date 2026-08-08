import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { InvoiceData } from "./invoiceTypes";

/**
 * Server-side PDF Invoice Generator.
 * Receives structured invoice data and returns a binary PDF Buffer suitable for
 * server-side storage upload or HTTP streaming.
 *
 * Uses renderToBuffer (not pdf().toBuffer(), which returns a stream in v4).
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
  return await renderToBuffer(doc as any);
}
