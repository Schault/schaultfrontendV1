import { NextResponse } from "next/server";
import { getSignedInvoiceUrl } from "@/lib/orders/downloadInvoice";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const result = await getSignedInvoiceUrl(orderId);

    return NextResponse.json({
      success: true,
      url: result.signedUrl,
      invoiceNumber: result.invoiceNumber,
    });
  } catch (err: any) {
    console.error("[API /orders/[id]/invoice] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Could not retrieve invoice download link" },
      { status: err?.message?.includes("Unauthorized") ? 401 : 404 }
    );
  }
}
