import { NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export const revalidate = 60; // ISR – revalidate every 60 seconds

export async function GET() {
    try {
        const products = await getProducts(20);

        if (!products) {
            // Shopify not configured – return empty so the frontend uses mocks
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("[API /products] Error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
