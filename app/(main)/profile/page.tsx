import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Package, Truck, CheckCircle2 } from "lucide-react";

export default async function ProfilePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Shopper";

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
                    <h2 className="font-bebas text-3xl tracking-wide text-black/90 mb-8">Order History</h2>

                    <p className="font-inter text-black/60">No orders placed yet.</p>
                </section>
            </div>
        </main>
    );
}
