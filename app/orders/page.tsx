import { getMyOrders } from "@/lib/api/orders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function OrdersPage() {
  const orders = await getMyOrders();

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-20">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="font-bebas text-4xl text-black/90 uppercase tracking-[0.1em] mb-12">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-20 border border-black/10">
              <h2 className="font-bebas text-2xl mb-4">No orders yet</h2>
              <Link
                href="/shop"
                className="font-bebas text-xl text-schlaut-red border-b border-schlaut-red pb-1 hover:text-black hover:border-black transition-colors uppercase tracking-widest"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  href={`/orders/${order.id}`}
                  key={order.id}
                  className="block border border-black/10 p-6 hover:shadow-lg transition-shadow bg-white group"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <p className="text-xs text-black/50 font-inter mb-1">
                        Order #{order.id.split("-")[0].toUpperCase()}
                      </p>
                      <p className="font-inter font-semibold text-lg">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-black/60 font-inter mt-1">
                        {order.item_count} item{order.item_count !== 1 && "s"} • Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-sm font-inter text-schlaut-red group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
