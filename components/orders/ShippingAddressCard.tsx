import React from "react";
import { ShippingAddress } from "@/lib/types/order";
import { MapPin, Phone } from "lucide-react";

interface ShippingAddressCardProps {
  address: ShippingAddress | null;
}

export const ShippingAddressCard: React.FC<ShippingAddressCardProps> = ({ address }) => {
  if (!address) {
    return (
      <div className="border border-black/10 bg-white p-6 shadow-sm">
        <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4 flex items-center gap-2">
          <MapPin size={14} /> SHIPPING ADDRESS
        </h3>
        <p className="font-inter text-xs text-zinc-400 italic">No shipping details recorded.</p>
      </div>
    );
  }

  return (
    <div className="border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-black/10 pb-3 mb-4 flex items-center gap-2">
        <MapPin size={14} /> SHIPPING ADDRESS
      </h3>

      <div className="font-inter text-xs text-zinc-800 space-y-1.5 leading-relaxed">
        <p className="font-bold text-sm text-black uppercase tracking-wider">{address.full_name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}{address.state ? `, ${address.state}` : ""} - {address.postal_code}
        </p>
        {address.country && <p>{address.country}</p>}
        {address.phone && (
          <div className="pt-2 mt-2 border-t border-black/5 flex items-center gap-2 text-zinc-600 font-mono text-[11px]">
            <Phone size={12} className="text-zinc-400" />
            <span>{address.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};
