import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderDetails } from "@/lib/orders/getOrderDetails";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";
import { OrderItemCard } from "@/components/orders/OrderItemCard";
import { ShippingAddressCard } from "@/components/orders/ShippingAddressCard";
import { PaymentInformationCard } from "@/components/orders/PaymentInformationCard";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { DownloadInvoiceButton } from "@/components/orders/DownloadInvoiceButton";
import { ArrowLeft, Calendar, FileText, ShoppingBag } from "lucide-react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const shortId = params.id ? params.id.split("-")[0].toUpperCase() : "";
  return {
    title: `Order ORD-${shortId} | SCHAULT`,
    description: `Details and tracking for order ORD-${shortId}`,
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;
  const order = await getOrderDetails(orderId);

  // Security: Return 404 if order does not exist or user does not own it
  if (!order) {
    notFound();
  }

  const shortOrderId = order.id.split("-")[0].toUpperCase();
  const formattedOrderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedPaidAt = order.paid_at
    ? new Date(order.paid_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>
        </div>

        {/* Page Header */}
        <div className="border border-black/10 bg-white p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-xl md:text-2xl font-black text-black">
                  ORD-{shortOrderId}
                </h1>
                {order.invoice_number && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded">
                    <FileText size={12} /> {order.invoice_number}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <OrderStatusBadge status={order.status} type="status" />
                <OrderStatusBadge status={order.payment_status} type="payment" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-inter">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-zinc-400" />
                  Placed: {formattedOrderDate}
                </span>
                {formattedPaidAt && (
                  <>
                    <span>•</span>
                    <span>Paid: {formattedPaidAt}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <DownloadInvoiceButton
                orderId={order.id}
                hasInvoiceUrl={Boolean(order.invoice_url)}
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Column: Timeline & Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4">
                ORDER STATUS TIMELINE
              </h2>
              <OrderStatusTimeline
                timeline={order.timeline}
                currentStatus={order.status}
              />
            </div>

            {/* Snapshot Product Items */}
            <div className="border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-6 flex items-center gap-2">
                <ShoppingBag size={14} /> ORDERED ITEMS ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <OrderItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Tracking */}
            {order.waybill && (
              <div className="border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4">
                  TRACKING
                </h2>
                <p className="font-inter text-xs text-black/50 uppercase tracking-widest mb-1">Waybill</p>
                <p className="font-inter font-semibold text-black/90 mb-4">{order.waybill}</p>
                <a
                  href={`https://www.delhivery.com/track/package/${order.waybill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#0350F0] text-white font-inter text-xs uppercase tracking-widest px-6 py-3 hover:bg-black/90 transition-colors"
                >
                  Track on Delhivery →
                </a>
              </div>
            )}
          </div>

          {/* Right Side Column: Address, Payment & Price Summary */}
          <div className="space-y-8">
            <ShippingAddressCard address={order.shipping_address} />

            <PaymentInformationCard
              paymentStatus={order.payment_status}
              paymentMethod={order.payment_method}
              razorpayPaymentId={order.razorpay_payment_id}
              razorpayOrderId={order.razorpay_order_id}
              paidAt={order.paid_at}
              invoiceNumber={order.invoice_number}
            />

            <OrderSummary total={order.total} />
          </div>
        </div>
      </div>
    </div>
  );
}
