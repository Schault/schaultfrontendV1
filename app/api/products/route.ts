import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                slug,
                description,
                base_price,
                is_active,
                created_at,
                product_variants (
                    id,
                    size,
                    color,
                    sku,
                    stock_quantity
                )
            `)
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[API /products] Supabase error:", error);
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(data || [], { status: 200 });
    } catch (error) {
        console.error("[API /products] Error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
