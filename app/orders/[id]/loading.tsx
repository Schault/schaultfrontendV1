import React from "react";

export default function OrderDetailsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-zinc-200 pb-6 animate-pulse">
        <div className="h-4 w-32 bg-zinc-200 rounded mb-4" />
        <div className="h-8 w-64 bg-zinc-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-36 bg-zinc-200 rounded animate-pulse" />
          <div className="h-64 bg-zinc-200 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-zinc-200 rounded animate-pulse" />
          <div className="h-48 bg-zinc-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
