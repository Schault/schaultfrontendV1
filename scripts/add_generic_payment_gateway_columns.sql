-- ============================================================================
-- PostgreSQL Migration: Gateway-agnostic payment columns on orders
-- Purpose: Replace razorpay_* columns with generic ones so the gateway
--          (Razorpay, Cashfree, ...) can change without schema changes.
-- Run order:
--   1. This file
--   2. create_order_pipeline_rpc.sql (adds the new RPC overload; the old
--      Razorpay one keeps working until the new code is deployed)
--   3. After deploy: re-run the backfill below, then the DROP at the bottom
-- ============================================================================

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_gateway TEXT NULL,
ADD COLUMN IF NOT EXISTS gateway_order_id TEXT NULL,
ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT NULL;

-- Backfill existing Razorpay orders (idempotent, safe to re-run)
UPDATE orders
SET payment_gateway = 'razorpay',
    gateway_order_id = razorpay_order_id,
    gateway_payment_id = razorpay_payment_id
WHERE razorpay_order_id IS NOT NULL
  AND gateway_order_id IS NULL;

-- Idempotency guard: one order per gateway order
CREATE UNIQUE INDEX IF NOT EXISTS orders_gateway_order_unique
ON orders (payment_gateway, gateway_order_id);

-- Step 3 (after the Cashfree code is live):
-- DROP FUNCTION IF EXISTS create_order_pipeline_rpc(UUID, TEXT, TEXT, NUMERIC, JSONB, JSONB);
-- razorpay_order_id / razorpay_payment_id columns are kept for history; drop later if unused.
