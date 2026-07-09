import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getMyOrders } from "@/lib/api/orders";
import ProfileClient from "@/components/profile/ProfileClient";
import { OrderListItem } from "@/lib/types/order";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Shopper";
    
    let orders: OrderListItem[] = [];
    try {
        orders = await getMyOrders();
    } catch (err) {
        console.error("Failed to load user orders on profile:", err);
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
                <ProfileClient 
                    user={{ email: user.email, fullName: name }} 
                    orders={orders} 
                    signOut={signOut} 
                />
            </div>
        </main>
    );
}
