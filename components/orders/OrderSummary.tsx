import React from "react";

interface OrderSummaryProps {
  total: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  taxAmount?: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  total,
  subtotal,
  shippingFee = 0,
  discountAmount = 0,
  taxAmount = 0,
}) => {
  const calculatedSubtotal = subtotal !== undefined ? subtotal : total;

  return (
    <div className="border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4">
        PRICE SUMMARY
      </h3>

      <div className="space-y-3 font-inter text-xs">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span className="font-mono text-black font-semibold">
            ₹{calculatedSubtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-zinc-600">
          <span>Shipping</span>
          <span className="font-mono text-black font-semibold">
            {shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString("en-IN")}`}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-mono font-semibold">
              -₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between text-zinc-600">
          <span>Taxes (GST)</span>
          <span className="font-mono text-black font-semibold">
            {taxAmount === 0 ? "Included" : `₹${taxAmount.toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="flex justify-between border-t border-black/10 pt-4 font-inter text-base font-black tracking-wide">
          <span className="text-black">Grand Total</span>
          <span className="font-mono text-[#0350F0]">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};
