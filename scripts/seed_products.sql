-- Seed real products + per-size stock. Slugs must match lib/productCatalog.ts
-- exactly (bluebird, redeye, daydream, daybreak, wildroot, sundaze) or the
-- shop/PDP won't find images for the row.
--
-- Only size 8 is currently stocked for every shoe (10 units, SunDaze 9).
-- Sizes 4-7 and 9-11 are inserted at 0 so they render out-of-stock/struck-through
-- rather than missing. Re-run-safe for products (ON CONFLICT DO NOTHING on slug);
-- re-running the variants insert will error on duplicates (by design — use an
-- UPDATE to restock instead, see bottom of file).

INSERT INTO products (name, slug, description, base_price, is_active) VALUES
  ('BlueBird', 'bluebird', 'SCHAULT modular sneaker.', 2999, true),
  ('RedEye',   'redeye',   'SCHAULT modular sneaker.', 2999, true),
  ('DayDream', 'daydream', 'SCHAULT modular sneaker.', 2999, true),
  ('DayBreak', 'daybreak', 'SCHAULT modular sneaker.', 2999, true),
  ('WildRoot', 'wildroot', 'SCHAULT modular sneaker.', 2999, true),
  ('SunDaze',  'sundaze',  'SCHAULT modular sneaker.', 2999, true)
ON CONFLICT (slug) DO NOTHING;

-- One color per product today (matches lib/productCatalog.ts). sku is free-form,
-- adjust the pattern if you already have real SKUs.
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity)
SELECT p.id, v.size, v.color, p.slug || '-' || v.size, v.stock_quantity
FROM products p
JOIN (VALUES
  ('bluebird', '4',  'Blue / White',  0),
  ('bluebird', '5',  'Blue / White',  0),
  ('bluebird', '6',  'Blue / White',  0),
  ('bluebird', '7',  'Blue / White',  0),
  ('bluebird', '8',  'Blue / White',  10),
  ('bluebird', '9',  'Blue / White',  0),
  ('bluebird', '10', 'Blue / White',  0),
  ('bluebird', '11', 'Blue / White',  0),

  ('redeye', '4',  'Brown / Black', 0),
  ('redeye', '5',  'Brown / Black', 0),
  ('redeye', '6',  'Brown / Black', 0),
  ('redeye', '7',  'Brown / Black', 0),
  ('redeye', '8',  'Brown / Black', 10),
  ('redeye', '9',  'Brown / Black', 0),
  ('redeye', '10', 'Brown / Black', 0),
  ('redeye', '11', 'Brown / Black', 0),

  ('daydream', '4',  'Dark Blue', 0),
  ('daydream', '5',  'Dark Blue', 0),
  ('daydream', '6',  'Dark Blue', 0),
  ('daydream', '7',  'Dark Blue', 0),
  ('daydream', '8',  'Dark Blue', 10),
  ('daydream', '9',  'Dark Blue', 0),
  ('daydream', '10', 'Dark Blue', 0),
  ('daydream', '11', 'Dark Blue', 0),

  ('daybreak', '4',  'White', 0),
  ('daybreak', '5',  'White', 0),
  ('daybreak', '6',  'White', 0),
  ('daybreak', '7',  'White', 0),
  ('daybreak', '8',  'White', 10),
  ('daybreak', '9',  'White', 0),
  ('daybreak', '10', 'White', 0),
  ('daybreak', '11', 'White', 0),

  ('wildroot', '4',  'Yellow', 0),
  ('wildroot', '5',  'Yellow', 0),
  ('wildroot', '6',  'Yellow', 0),
  ('wildroot', '7',  'Yellow', 0),
  ('wildroot', '8',  'Yellow', 10),
  ('wildroot', '9',  'Yellow', 0),
  ('wildroot', '10', 'Yellow', 0),
  ('wildroot', '11', 'Yellow', 0),

  ('sundaze', '4',  'Sun Yellow', 0),
  ('sundaze', '5',  'Sun Yellow', 0),
  ('sundaze', '6',  'Sun Yellow', 0),
  ('sundaze', '7',  'Sun Yellow', 0),
  ('sundaze', '8',  'Sun Yellow', 9),
  ('sundaze', '9',  'Sun Yellow', 0),
  ('sundaze', '10', 'Sun Yellow', 0),
  ('sundaze', '11', 'Sun Yellow', 0)
) AS v(slug, size, color, stock_quantity)
  ON p.slug = v.slug;

-- To restock an existing variant later instead of re-inserting:
-- UPDATE product_variants SET stock_quantity = <n>
-- WHERE product_id = (SELECT id FROM products WHERE slug = '<slug>') AND size = '<size>';
