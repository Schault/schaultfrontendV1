import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#0a0a0a] antialiased">
      {children}
    </div>
  );
}

