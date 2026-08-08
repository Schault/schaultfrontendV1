import React from "react";
import Image from "next/image";
import { OrderItemDetail } from "@/lib/types/order";
import { Package } from "lucide-react";

interface OrderItemCardProps {
  item: OrderItemDetail;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  return (
    <div className="flex items-center gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
      <div className="relative h-20 w-20 flex-shrink-0 border border-black/10 bg-zinc-50 p-1">
        {item.product_image ? (
          <Image
            src={item.product_image}
            alt={item.product_name}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <Package size={20} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h4 className="font-inter text-sm font-bold text-black/90 uppercase tracking-wide">
          {item.product_name}
        </h4>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono">
          <span>SKU: {item.variant_sku || "N/A"}</span>
          <span>•</span>
          <span>Size: {item.variant_size}</span>
          {item.variant_color && (
            <>
              <span>•</span>
              <span>Color: {item.variant_color}</span>
            </>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-inter">
          <span className="text-zinc-500">
            Qty: {item.quantity} × ₹{item.unit_price.toLocaleString("en-IN")}
          </span>
          <span className="font-mono text-sm font-bold text-black">
            ₹{item.line_total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};
