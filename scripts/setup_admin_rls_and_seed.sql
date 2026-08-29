-- ============================================================================
-- SCHAULT ADMIN RLS POLICIES & SETUP SCRIPT
-- Purpose: Grant Admin accounts (profiles.role = 'admin') permission to read/update
--          all orders, order_items, waitlist_users, product_variants, and profiles.
-- Run this script in the Supabase SQL Editor for your project.
-- ============================================================================

-- 1. Orders RLS Policies (Allow Admins to view and edit all orders)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users select own orders" ON orders;
DROP POLICY IF EXISTS "admins select all orders" ON orders;

CREATE POLICY "admins select all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "admins update all orders" ON orders;
CREATE POLICY "admins update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 2. Order Items RLS Policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users select own order items" ON order_items;
DROP POLICY IF EXISTS "admins select all order items" ON order_items;

CREATE POLICY "admins select all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- 3. Order Status History RLS Policies
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins access order status history" ON order_status_history;
CREATE POLICY "admins access order status history" ON order_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- 4. Waitlist Users RLS Policies
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone insert waitlist" ON waitlist_users;
CREATE POLICY "anyone insert waitlist" ON waitlist_users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "admins select waitlist" ON waitlist_users;
CREATE POLICY "admins select waitlist" ON waitlist_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admins update waitlist" ON waitlist_users;
CREATE POLICY "admins update waitlist" ON waitlist_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Products & Product Variants RLS Policies (Public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone select products" ON products;
CREATE POLICY "anyone select products" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "admins write products" ON products;
CREATE POLICY "admins write products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone select product_variants" ON product_variants;
CREATE POLICY "anyone select product_variants" ON product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "admins write product_variants" ON product_variants;
CREATE POLICY "admins write product_variants" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
