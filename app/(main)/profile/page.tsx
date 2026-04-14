import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getMyOrders } from "@/lib/api/orders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

export default async function ProfilePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Shopper";

    let orders: Awaited<ReturnType<typeof getMyOrders>> = [];
    try {
        orders = await getMyOrders();
    } catch (e) {
        // User may not have orders or auth may be stale — silently default to empty
    }

    async function signOut() {
        "use server";
        const supabase = createClient();
        await supabase.auth.signOut();
        revalidatePath("/", "layout");
        redirect("/auth");
    }

    return (
        <main className="min-h-screen bg-[#F5F5F5] pt-32 pb-12">
            <div className="mx-auto max-w-5xl px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6 mb-12">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-wide text-black/90">Hello, {name}</h1>
                        <p className="font-inter text-sm text-black/60 mt-2">{user.email}</p>
                    </div>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="mt-6 md:mt-0 px-6 py-2 border border-black font-inter text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>

                <section>
                    <div className="mb-2 h-0.5 w-8 bg-[#CC0000]" aria-hidden />
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-bebas text-3xl tracking-wide text-black/90">Order History</h2>
                        {orders.length > 0 && (
                            <Link
                                href="/orders"
                                className="font-inter text-xs uppercase tracking-widest text-black/50 hover:text-[#CC0000] transition-colors"
                            >
                                View All →
                            </Link>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-black/10 bg-white">
                            <p className="font-inter text-black/50 mb-4">No orders placed yet.</p>
                            <Link
                                href="/shop"
                                className="font-bebas text-lg text-[#CC0000] border-b border-[#CC0000] pb-0.5 hover:text-black hover:border-black transition-colors uppercase tracking-widest"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => (
                                <Link
                                    href={`/orders/${order.id}`}
                                    key={order.id}
                                    className="block bg-white border border-black/5 p-6 hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-black/40 font-inter mb-1">
                                                Order #{order.id.split("-")[0].toUpperCase()}
                                            </p>
                                            <p className="font-inter font-semibold text-lg text-black/90">
                                                ₹{order.total.toLocaleString("en-IN")}
                                            </p>
                                            <p className="text-sm text-black/50 font-inter mt-1">
                                                {order.item_count} item{order.item_count !== 1 && "s"} • {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <OrderStatusBadge status={order.status} />
                                            <span className="text-sm font-inter text-[#CC0000] group-hover:underline hidden sm:inline">
                                                View →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
