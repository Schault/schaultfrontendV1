"use client";

import React, { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadInvoiceButtonProps {
  orderId: string;
  hasInvoiceUrl?: boolean;
}

export const DownloadInvoiceButton: React.FC<DownloadInvoiceButtonProps> = ({
  orderId,
  hasInvoiceUrl = true,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!hasInvoiceUrl) {
      toast.error("Invoice PDF is not available for this order yet.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`);
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Invoice download link is unavailable");
      }

      // Open signed download URL in new tab / trigger download
      window.open(data.url, "_blank", "noopener,noreferrer");
      toast.success("Opening invoice PDF...");
    } catch (err: any) {
      console.error("[DownloadInvoiceButton] Download error:", err);
      toast.error(err?.message || "Could not download invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !hasInvoiceUrl}
      className="inline-flex items-center justify-center gap-2 border border-black/20 bg-white px-5 py-2.5 font-inter text-xs font-bold uppercase tracking-widest text-black/90 shadow-sm transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      <span>{loading ? "Generating..." : "Download Invoice"}</span>
    </button>
  );
};
