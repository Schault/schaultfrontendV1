import { getOrderById } from "@/lib/api/orders";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  try {
    const order = await getOrderById(params.id);

    return (
      <>
        <main className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6 md:px-20">
          <div className="max-w-[1000px] mx-auto">
            {/* Header */}
            <div className="mb-8 border-b border-black/10 pb-8 tracking-widest">
              <Link 
                href="/orders" 
                className="inline-flex items-center text-sm font-inter text-black/50 hover:text-black mb-6 uppercase"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="font-bebas text-4xl text-black/90 uppercase">
                    Order #{order.id.split('-')[0].toUpperCase()}
                  </h1>
                  <p className="font-inter text-black/60 mt-2">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-8 border border-black/10 mb-8 shadow-sm">
              <h2 className="font-bebas text-2xl uppercase tracking-widest mb-2 border-b border-black/10 pb-4">Order Status</h2>
              <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="md:col-span-2 bg-white p-8 border border-black/10 shadow-sm">
                <h2 className="font-bebas text-2xl uppercase tracking-widest mb-6 border-b border-black/10 pb-4">Items</h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Placeholder for item image */}
                      <div className="w-24 h-24 bg-black/5 flex-shrink-0" />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bebas text-xl uppercase tracking-wider">{item.product_name}</h3>
                            <p className="text-sm font-inter text-black/60 mt-1">
                              Variant: {item.variant_size} {item.variant_color ? `/ ${item.variant_color}` : ''}
                            </p>
                            <p className="text-sm font-inter text-black/60">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-inter font-semibold">
                            ₹{item.line_total.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center font-bebas text-2xl tracking-widest">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                {/* Shipping Details */}
                <div className="bg-white p-8 border border-black/10 shadow-sm">
                  <h2 className="font-bebas text-2xl uppercase tracking-widest mb-4 border-b border-black/10 pb-4">Shipping Info</h2>
                  {order.shipping_address ? (
                    <div className="font-inter text-sm text-black/80 space-y-1">
                      <p className="font-semibold text-black">{order.shipping_address.full_name}</p>
                      <p>{order.shipping_address.line1}</p>
                      {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                      {order.shipping_address.phone && <p className="mt-2 text-black/60">{order.shipping_address.phone}</p>}
                    </div>
                  ) : (
                    <p className="font-inter text-sm text-black/50 italic">No shipping details provided.</p>
                  )}
                </div>

                {/* Estimated Delivery */}
                <div className="bg-white p-8 border border-black/10 shadow-sm">
                  <h2 className="font-bebas text-2xl uppercase tracking-widest mb-4 border-b border-black/10 pb-4">Delivery Estimate</h2>
                  <p className="font-inter text-black/90 font-semibold">
                    {order.estimated_delivery 
                      ? new Date(order.estimated_delivery).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                      : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } catch (e) {
    console.error(e);
    notFound();
  }
}
