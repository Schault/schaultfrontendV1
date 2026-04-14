import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    _request: Request,
    { params }: { params: { handle: string } },
) {
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
            .eq("slug", params.handle)
            .eq("is_active", true)
            .single();

        if (error || !data) {
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(`[API /products/${params.handle}] Error:`, error);
        return NextResponse.json(null, { status: 200 });
    }
}
