-- ============================================================================
-- RLS SELECT policies: orders, order_items, order_status_history
-- Purpose: Order creation/invoice/shipment all run via SECURITY DEFINER RPC
--          or the service-role client, so they bypass RLS. But order history
--          and tracking pages (getOrders, getOrderDetails) read through the
--          user's own session, which is RLS-gated. With no SELECT policy,
--          RLS silently returns zero rows (no error) instead of the user's
--          own orders — orders "disappear" from history even though they
--          were created successfully.
-- ============================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users select own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users select own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users select own order status history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
        AND orders.user_id = auth.uid()
    )
  );
