-- ============================================================================
-- PostgreSQL RPC Function: create_order_pipeline_rpc
-- Purpose: Complete, atomic transactional order creation pipeline after
--          successful Razorpay payment verification.
-- ============================================================================

CREATE OR REPLACE FUNCTION create_order_pipeline_rpc(
  p_user_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_total NUMERIC,
  p_shipping_address JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_order RECORD;
  v_new_order_id UUID;
  v_invoice_number TEXT;
  v_item JSONB;
  v_item_count INT;
  v_rows_affected INT;
  v_now TIMESTAMPTZ;
BEGIN
  -- 1. Idempotency Check: return existing order if razorpay_order_id already exists
  SELECT id, invoice_number, payment_status, status, created_at, total
  INTO v_existing_order
  FROM orders
  WHERE razorpay_order_id = p_razorpay_order_id;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'order_id', v_existing_order.id,
      'invoice_number', v_existing_order.invoice_number,
      'payment_status', v_existing_order.payment_status,
      'status', v_existing_order.status,
      'created_at', v_existing_order.created_at,
      'total', v_existing_order.total,
      'is_duplicate', true
    );
  END IF;

  -- 2. Validate Items Array
  v_item_count := jsonb_array_length(p_items);
  IF v_item_count IS NULL OR v_item_count = 0 THEN
    RAISE EXCEPTION 'Cannot create order: items array is empty';
  END IF;

  -- 3. Atomic Inventory Check and Reduction
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE product_variants
    SET stock_quantity = stock_quantity - (v_item->>'quantity')::INT
    WHERE id = (v_item->>'variant_id')::UUID
      AND stock_quantity >= (v_item->>'quantity')::INT;

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

    IF v_rows_affected = 0 THEN
      RAISE EXCEPTION 'Insufficient stock or invalid product variant ID: %', (v_item->>'variant_id');
    END IF;
  END LOOP;

  -- 4. Generate Invoice Number & Timestamp
  v_invoice_number := generate_invoice_number();
  v_now := NOW();

  -- 5. Insert into orders table
  INSERT INTO orders (
    user_id,
    total,
    shipping_address,
    item_count,
    razorpay_order_id,
    razorpay_payment_id,
    payment_status,
    status,
    paid_at,
    created_at,
    updated_at,
    invoice_number
  ) VALUES (
    p_user_id,
    p_total,
    p_shipping_address,
    v_item_count,
    p_razorpay_order_id,
    p_razorpay_payment_id,
    'paid',
    'confirmed',
    v_now,
    v_now,
    v_now,
    v_invoice_number
  )
  RETURNING id INTO v_new_order_id;

  -- 6. Insert into order_items with product snapshots
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      variant_id,
      quantity,
      unit_price,
      user_id,
      product_name,
      product_image,
      product_sku,
      product_size,
      product_color
    ) VALUES (
      v_new_order_id,
      (v_item->>'variant_id')::UUID,
      (v_item->>'quantity')::INT,
      (v_item->>'unit_price')::NUMERIC,
      p_user_id,
      v_item->>'product_name',
      v_item->>'product_image',
      v_item->>'product_sku',
      v_item->>'product_size',
      v_item->>'product_color'
    );
  END LOOP;

  -- 7. Insert into order_status_history
  INSERT INTO order_status_history (
    order_id,
    status,
    user_id,
    note,
    created_at
  ) VALUES (
    v_new_order_id,
    'confirmed',
    p_user_id,
    'Order confirmed via Razorpay payment verification',
    v_now
  );

  -- 8. Return created order details
  RETURN jsonb_build_object(
    'order_id', v_new_order_id,
    'invoice_number', v_invoice_number,
    'payment_status', 'paid',
    'status', 'confirmed',
    'created_at', v_now,
    'total', p_total,
    'is_duplicate', false
  );
END;
$$;
