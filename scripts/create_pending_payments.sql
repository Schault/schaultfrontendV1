-- ============================================================================
-- PostgreSQL Migration: pending_payments table
-- Purpose: Server-side snapshot of the cart at payment start, keyed by the
--          gateway order ID. Lets the payment webhook create the order even
--          if the customer closes the tab before checkout verification runs,
--          and means verification never trusts a client-sent cart.
-- ============================================================================

CREATE TABLE IF NOT EXISTS pending_payments (
  gateway_order_id TEXT PRIMARY KEY,
  gateway TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS on with no policies: only the service role can read/write.
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;
