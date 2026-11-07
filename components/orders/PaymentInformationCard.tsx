import React from "react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { CreditCard } from "lucide-react";

interface PaymentInformationCardProps {
  paymentStatus: string;
  paymentMethod?: string;
  gatewayPaymentId?: string | null;
  gatewayOrderId?: string | null;
  paidAt?: string | null;
  invoiceNumber?: string | null;
}

export const PaymentInformationCard: React.FC<PaymentInformationCardProps> = ({
  paymentStatus,
  paymentMethod = "Online Payment",
  gatewayPaymentId,
  gatewayOrderId,
  paidAt,
  invoiceNumber,
}) => {
  const formattedPaidAt = paidAt
    ? new Date(paidAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4 flex items-center gap-2">
        <CreditCard size={14} /> PAYMENT INFORMATION
      </h3>

      <div className="space-y-3 font-inter text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Payment Status</span>
          <OrderStatusBadge status={paymentStatus} type="payment" />
        </div>

        <div className="flex justify-between text-zinc-600">
          <span className="text-zinc-500">Method</span>
          <span className="font-medium text-black">{paymentMethod}</span>
        </div>

        {invoiceNumber && (
          <div className="flex justify-between text-zinc-600">
            <span className="text-zinc-500">Invoice Number</span>
            <span className="font-mono font-bold text-black">{invoiceNumber}</span>
          </div>
        )}

        {gatewayPaymentId && (
          <div className="flex justify-between text-zinc-600">
            <span className="text-zinc-500">Payment ID</span>
            <span className="font-mono text-[11px] text-black">{gatewayPaymentId}</span>
          </div>
        )}

        {gatewayOrderId && (
          <div className="flex justify-between text-zinc-600">
            <span className="text-zinc-500">Gateway Order ID</span>
            <span className="font-mono text-[11px] text-black">{gatewayOrderId}</span>
          </div>
        )}

        {formattedPaidAt && (
          <div className="flex justify-between text-zinc-600">
            <span className="text-zinc-500">Paid At</span>
            <span className="font-mono text-[11px] text-black">{formattedPaidAt}</span>
          </div>
        )}
      </div>
    </div>
  );
};
