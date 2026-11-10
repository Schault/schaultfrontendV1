// Money-path self-check. Run: npx tsx scripts/check_pricing.ts
import assert from "assert";
import { computeOrderPricing } from "../lib/orders/pricing";
// Fake Supabase: DayDream 2999, plus a 1499 item, to exercise rounding with mixed carts.
const variants: Record<string, any> = {
  a: { id: "a", size: "8", color: "Dark Blue", sku: "daydream-8", products: { name: "DayDream", base_price: 2999 } },
  b: { id: "b", size: "9", color: "Red", sku: "x-9", products: { name: "X", base_price: 1499 } },
};
const sb: any = { from: () => ({ select: () => ({ in: (_: string, ids: string[]) => Promise.resolve({ data: ids.map((i) => variants[i]), error: null }) }) }) };
const sumLines = (r: any) => Math.round(r.items.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0) * 100) / 100;
(async () => {
  for (const [coupon, cart, expected] of [
    ["SCHAULT20", [{ variant_id: "a", quantity: 1 }], 2399],
    ["SCHAULT20", [{ variant_id: "a", quantity: 2 }, { variant_id: "b", quantity: 3 }], 2 * 2399 + 3 * 1199],
    ["LOVE30", [{ variant_id: "a", quantity: 1 }], 2099],
    [null, [{ variant_id: "a", quantity: 1 }], 2999],
    ["DEVTEST99", [{ variant_id: "a", quantity: 1 }], 2999], // CASHFREE_ENV unset => backdoor ignored
  ] as const) {
    const r = await computeOrderPricing(sb, cart as any, coupon);
    assert.equal(r.total, expected, `${coupon} total`);
    assert.equal(r.total, sumLines(r), `${coupon}: total must equal SUM(unit_price*qty) for the DB trigger`);
    assert.equal(r.discount, r.subtotal - r.total);
  }
  process.env.CASHFREE_ENV = "sandbox";
  const t = await computeOrderPricing(sb, [{ variant_id: "a", quantity: 1 }] as any, "DEVTEST99");
  assert.equal(t.total, 1); assert.equal(sumLines(t), 1);
  console.log("pricing checks pass");
})();
