// Cashfree PG REST client. ponytail: plain fetch, no SDK — two endpoints don't need one.
export const CASHFREE_MODE =
  process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

const CASHFREE_BASE =
  CASHFREE_MODE === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export async function cashfree<T = any>(
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${CASHFREE_BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      "x-api-version": "2025-01-01",
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Cashfree ${path} failed (${res.status})`);
  }
  return data as T;
}

/** Display label for orders/invoices. Rows without a gateway predate the migration (Razorpay). */
export function paymentMethodLabel(gateway?: string | null): string {
  const name = gateway === "cashfree" ? "Cashfree" : "Razorpay";
  return `${name} (Online Payment)`;
}
