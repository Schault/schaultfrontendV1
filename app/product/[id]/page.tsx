"use client";

import { SHOES } from "@/lib/data";
import { useCart } from "@/components/providers";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ShopifyProduct } from "@/lib/shopify";

// ── Types ───────────────────────────────────────────────────────────────────

type ResolvedProduct = {
    id: string;
    name: string;
    tagline: string;
    description: string;
    specs: string[];
    price: string;
    priceValue: number;
    image: string;
    availableSizes: number[];
    allSizes: number[];
    variantId?: string; // real Shopify GID
};

const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

function shopifyToResolved(p: ShopifyProduct): ResolvedProduct {
    const firstImage = p.images.edges[0]?.node;
    const price = p.priceRange.minVariantPrice;

    // Map variants to available sizes
    const availableSizes: number[] = [];
    p.variants.edges.forEach(({ node: v }) => {
        if (v.availableForSale) {
            const sizeNum = parseFloat(v.title);
            if (!isNaN(sizeNum) && SIZES.includes(sizeNum)) {
                availableSizes.push(sizeNum);
            }
        }
    });

    // If no parseable sizes, default to all sizes available
    const finalAvailableSizes = availableSizes.length > 0 ? availableSizes : SIZES;

    return {
        id: p.handle,
        name: p.title,
        tagline: p.tags.join(" · ") || p.title,
        description: p.description,
        specs: [],
        price: `$${parseFloat(price.amount).toFixed(2)}`,
        priceValue: parseFloat(price.amount),
        image: firstImage?.url ?? "/images/shoes/bluewhite.jpg",
        availableSizes: finalAvailableSizes,
        allSizes: SIZES,
        variantId: p.variants.edges[0]?.node.id,
    };
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: { id: string } }) {
    const mockShoe = SHOES.find((s) => s.id === params.id);
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<number | null>(9);
    const [shoe, setShoe] = useState<ResolvedProduct | null>(
        mockShoe
            ? {
                ...mockShoe,
                variantId: undefined,
            }
            : null,
    );
    const [loading, setLoading] = useState(true);

    // Try to fetch the Shopify version of the product
    useEffect(() => {
        async function fetchShopify() {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (res.ok) {
                    const data: ShopifyProduct | null = await res.json();
                    if (data) {
                        setShoe(shopifyToResolved(data));
                    }
                }
            } catch {
                // Shopify not configured – keep mock
            } finally {
                setLoading(false);
            }
        }
        fetchShopify();
    }, [params.id]);

    if (!shoe && !loading) {
        return notFound();
    }

    if (!shoe) {
        return (
            <main className="min-h-screen bg-[#F5F5F5] pt-24 pb-12 flex items-center justify-center">
                <div className="animate-pulse text-black/40 font-inter text-sm">Loading product…</div>
            </main>
        );
    }

    const otherShoes = SHOES.filter((s) => s.id !== shoe.id);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        // Find variant matching size for Shopify checkout
        let variantId = shoe.variantId || `${shoe.id}-${selectedSize}`;

        addItem({
            id: `${shoe.id}-${selectedSize}`,
            shoeId: shoe.id,
            name: shoe.name,
            image: shoe.image,
            price: shoe.priceValue,
            size: selectedSize,
            quantity: 1,
            variantId,
        });
    };

    return (
        <main className="min-h-screen bg-[#F5F5F5] pt-24 pb-12">
            {/* Product Detail Section */}
            <section className="mx-auto max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                {/* Left Column: Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-[4/3] w-full bg-black/5 flex items-center justify-center overflow-hidden sticky top-24">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={shoe.image}
                            alt={shoe.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="flex flex-col pt-8">
                    <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-black/95">
                        {shoe.name}
                    </h1>
                    <p className="mt-2 font-inter text-lg text-black/60">
                        {shoe.tagline}
                    </p>
                    <p className="mt-4 font-semibold font-inter text-2xl text-black">
                        {shoe.price}
                    </p>

                    <div className="mt-8 mb-4">
                        <h3 className="font-inter font-medium text-sm text-black/80">Select Size</h3>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {shoe.allSizes.map((size) => {
                            const isAvailable = shoe.availableSizes.includes(size);
                            const isSelected = selectedSize === size;
                            return (
                                <button
                                    key={size}
                                    disabled={!isAvailable}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                    py-3 font-inter text-sm border transition-all duration-200 ease-out
                    ${isAvailable
                                            ? isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-black/20 bg-white text-black hover:border-black/60"
                                            : "border-black/10 bg-black/5 text-black/30 cursor-not-allowed"}`}
                                >
                                    US M {size}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                        className={`mt-10 py-5 w-full font-inter text-sm uppercase tracking-widest font-semibold transition-all duration-200
              ${selectedSize
                                ? "bg-black text-white hover:bg-[#CC0000]"
                                : "bg-black/20 text-black/50 cursor-not-allowed"
                            }`}
                    >
                        {selectedSize ? "Add to Bag" : "Select a Size"}
                    </button>

                    <div className="mt-16 space-y-6 border-t border-black/10 pt-8">
                        <h3 className="font-bebas text-2xl tracking-wide text-black/90">Description</h3>
                        <p className="font-inter leading-relaxed text-black/70">
                            {shoe.description}
                        </p>

                        {shoe.specs.length > 0 && (
                            <>
                                <h4 className="font-bebas text-xl tracking-wide text-black/90 pt-4">Technical Specs</h4>
                                <ul className="list-disc pl-5 mt-2 space-y-2 font-inter text-black/70 marker:text-black/30">
                                    {shoe.specs.map((spec, i) => (
                                        <li key={i}>{spec}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Recommended Section */}
            <section className="mx-auto max-w-7xl px-6 md:px-12 mt-32">
                <h2 className="font-bebas text-3xl md:text-4xl tracking-wide text-black/90 mb-10">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {otherShoes.map((s, idx) => (
                        <motion.article
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group cursor-pointer flex flex-col bg-white overflow-hidden transition-shadow hover:shadow-md"
                        >
                            <Link href={`/product/${s.id}`} className="block w-full h-full flex flex-col">
                                <div className="aspect-[4/3] bg-black/5 p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={s.image} alt={s.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bebas text-xl tracking-wide text-black/90">{s.name}</h3>
                                    <p className="font-inter text-sm text-black/50 mt-1 flex-1">{s.price}</p>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </section>
        </main>
    );
}
