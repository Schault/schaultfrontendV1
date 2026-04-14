import { createClient } from "@/utils/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone?: string;
}

export interface CheckoutResult {
  order_id: string;
  total: number;
  estimated_delivery: string;
}

export interface CheckoutError {
  type: "VALIDATION" | "RATE_LIMITED" | "STOCK_CONFLICT" | "AUTH" | "GENERIC";
  message: string;
  retryAfterSeconds?: number;
  outOfStockVariants?: string[];
}

// ─── Idempotency ────────────────────────────────────────────────────────────

/**
 * Get or create an idempotency key for the current checkout session.
 * Persisted in sessionStorage so it survives page reloads but not tab changes.
 */
export function getOrCreateCheckoutKey(): string {
  if (typeof window === "undefined") return crypto.randomUUID();

  let key = sessionStorage.getItem("checkout_idempotency_key");
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem("checkout_idempotency_key", key);
  }
  return key;
}

/**
 * Clear the idempotency key (call after successful checkout).
 */
export function clearCheckoutKey(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("checkout_idempotency_key");
  }
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateShippingAddress(
  addr: ShippingAddress
): string | null {
  if (
    !addr.full_name ||
    typeof addr.full_name !== "string" ||
    addr.full_name.length < 1 ||
    addr.full_name.length > 200
  )
    return "Full name is required (max 200 characters)";

  if (
    !addr.line1 ||
    typeof addr.line1 !== "string" ||
    addr.line1.length < 1 ||
    addr.line1.length > 500
  )
    return "Address line 1 is required (max 500 characters)";

  if (addr.line2 && (typeof addr.line2 !== "string" || addr.line2.length > 500))
    return "Address line 2 must be under 500 characters";

  if (
    !addr.city ||
    typeof addr.city !== "string" ||
    addr.city.length < 1 ||
    addr.city.length > 100
  )
    return "City is required (max 100 characters)";

  if (
    !addr.state ||
    typeof addr.state !== "string" ||
    addr.state.length < 1 ||
    addr.state.length > 100
  )
    return "State is required (max 100 characters)";

  if (!addr.postal_code || !/^\d{5,6}$/.test(addr.postal_code))
    return "Postal code must be 5-6 digits";

  if (addr.phone && (typeof addr.phone !== "string" || addr.phone.length > 20))
    return "Phone must be under 20 characters";

  return null; // Valid
}

// ─── Checkout ───────────────────────────────────────────────────────────────

/**
 * Call the Supabase checkout Edge Function.
 * Returns `CheckoutResult` on success, throws `CheckoutError` on failure.
 */
export async function performCheckout(
  shippingAddress: ShippingAddress
): Promise<CheckoutResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw {
      type: "AUTH",
      message: "Not authenticated. Please log in.",
    } as CheckoutError;
  }

  // Validate locally first
  const validationError = validateShippingAddress(shippingAddress);
  if (validationError) {
    throw {
      type: "VALIDATION",
      message: validationError,
    } as CheckoutError;
  }

  const idempotencyKey = getOrCreateCheckoutKey();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/checkout`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ shipping_address: shippingAddress }),
    }
  );

  const result = await response.json();

  if (response.ok) {
    // Success — clear idempotency key
    clearCheckoutKey();
    return result as CheckoutResult;
  }

  // Handle specific error codes
  switch (response.status) {
    case 400:
      if (result.error?.includes("Idempotency-Key")) {
        // Clear stale key so next attempt gets a fresh one
        clearCheckoutKey();
      }
      throw {
        type: "VALIDATION",
        message: result.error || "Invalid request",
      } as CheckoutError;

    case 401:
      throw {
        type: "AUTH",
        message: "Session expired. Please log in again.",
      } as CheckoutError;

    case 409:
      throw {
        type: "STOCK_CONFLICT",
        message:
          "Some items are out of stock. Please update your cart and try again.",
        outOfStockVariants: result.variants || [],
      } as CheckoutError;

    case 429: {
      const retryAfter =
        result.retry_after_seconds ||
        parseInt(response.headers.get("Retry-After") || "60", 10);
      throw {
        type: "RATE_LIMITED",
        message: `Too many checkout attempts. Please try again in ${retryAfter} seconds.`,
        retryAfterSeconds: retryAfter,
      } as CheckoutError;
    }

    default:
      throw {
        type: "GENERIC",
        message: result.error || "Checkout failed. Please try again.",
      } as CheckoutError;
  }
}
