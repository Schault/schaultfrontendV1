import React from "react";

export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-zinc-200 animate-pulse rounded" />
        <div className="mt-2 h-4 w-72 bg-zinc-100 animate-pulse rounded" />
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-zinc-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 bg-zinc-200 rounded" />
                <div className="space-y-2">
                  <div className="h-5 w-36 bg-zinc-200 rounded" />
                  <div className="h-4 w-48 bg-zinc-100 rounded" />
                  <div className="h-3 w-32 bg-zinc-100 rounded" />
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="h-6 w-24 bg-zinc-200 rounded-full" />
                <div className="h-6 w-28 bg-zinc-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
