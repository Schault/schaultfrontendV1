import { getOrderById } from "@/lib/api/orders";
import OrderTrackingPageClient from "@/components/orders/OrderTrackingPageClient";
import { notFound } from "next/navigation";
import { OrderDetail } from "@/lib/types/order";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  let order: OrderDetail;

  if (params.id === "demo-track-991") {
    order = {
      id: "demo-track-991",
      status: "shipped",
      total: 18999,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      estimated_delivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      shipping_address: {
        full_name: "MOHIT",
        line1: "Premium Sneaker Labs, Block-C",
        city: "Bangalore",
        state: "Karnataka",
        postal_code: "560001",
        phone: "+91 9876543210"
      },
      updated_at: new Date().toISOString(),
      items: [
        {
          id: "demo-item-1",
          quantity: 1,
          unit_price: 18999,
          line_total: 18999,
          product_name: "Schault Apex-X1",
          product_slug: "apex-x1",
          variant_size: "UK 9",
          variant_color: "Carbon Black",
          variant_sku: "SH-APX-X1"
        }
      ],
      timeline: [
        { id: "tl-1", status: "confirmed", note: "Order placed successfully. Payment verified via Razorpay.", created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: "tl-2", status: "processing", note: "Footwear has been assembled and passed dynamic stress tests.", created_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
        { id: "tl-3", status: "shipped", note: "Dispatched from New Delhi sorting facility via Delhivery.", created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
      ]
    };
  } else {
    try {
      order = await getOrderById(params.id);
    } catch (e) {
      console.error(e);
      notFound();
    }
  }

  return <OrderTrackingPageClient order={order} />;
}
