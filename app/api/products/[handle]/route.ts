import { NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/shopify";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ handle: string }> },
) {
    const { handle } = await params;
    try {
        const product = await getProductByHandle(handle);

        if (!product) {
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error(`[API /products/${handle}] Error:`, error);
        return NextResponse.json(null, { status: 200 });
    }
}
