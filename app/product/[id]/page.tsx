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
    images: string[];
    availableSizes: string[];
    allSizes: string[];
    variantId?: string; // real Shopify GID
};

function shopifyToResolved(p: ShopifyProduct): ResolvedProduct {
    const price = p.priceRange.minVariantPrice;

    // Map variants to available sizes strings (support shoes, soles, apparel)
    const allSizes: string[] = [];
    const availableSizes: string[] = [];

    p.variants.edges.forEach(({ node: v }) => {
        if (v.title && v.title.toLowerCase() !== "default title") {
            allSizes.push(v.title);
            if (v.availableForSale) {
                availableSizes.push(v.title);
            }
        }
    });

    // If Shopify returns no variants, default to none
    const finalAllSizes = allSizes.length > 0 ? allSizes : [];
    const finalAvailableSizes = availableSizes.length > 0 ? availableSizes : finalAllSizes;

    const images = p.images.edges.map(e => e.node.url);
    if (images.length === 0) images.push("/images/shoes/bluewhite.jpg");

    return {
        id: p.handle,
        name: p.title,
        tagline: p.tags.join(" · ") || p.title,
        description: p.description,
        specs: [],
        price: `$${parseFloat(price.amount).toFixed(2)}`,
        priceValue: parseFloat(price.amount),
        image: images[0],
        images: images,
        availableSizes: finalAvailableSizes,
        allSizes: finalAllSizes,
        variantId: p.variants.edges[0]?.node.id,
    };
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: { id: string } }) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [shoe, setShoe] = useState<ResolvedProduct | null>(null);
    const [loading, setLoading] = useState(true);

    const [recommended, setRecommended] = useState<ResolvedProduct[] | null>(null);

    // Try to fetch the Shopify version of the product and recommendations
    useEffect(() => {
        async function fetchShopify() {
            try {
                // Fetch current product
                const res = await fetch(`/api/products/${params.id}`);
                if (res.ok) {
                    const data: ShopifyProduct | null = await res.json();
                    if (data) {
                        setShoe(shopifyToResolved(data));
                    }
                }

                // Fetch recommended products
                const recRes = await fetch(`/api/products`);
                if (recRes.ok) {
                    const allData: ShopifyProduct[] | null = await recRes.json();
                    if (allData) {
                        setRecommended(allData.map(shopifyToResolved));
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

    const otherShoes = recommended
        ? recommended.filter((s) => s.id !== shoe.id).slice(0, 4)
        : [];

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
            <section className="mx-auto max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative items-start">

                {/* Left Column: Image Carousel */}
                <div className="relative sticky top-24">
                    <div className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {shoe.images.map((img, idx) => (
                            <div key={idx} className="w-full shrink-0 snap-center bg-[#F1F1F1] aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center p-8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`${shoe.name} - View ${idx + 1}`}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            </div>
                        ))}
                    </div>
                    {shoe.images.length > 1 && (
                        <div className="flex justify-center gap-3 mt-6">
                            {shoe.images.map((_, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-black/20" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details & Actions */}
                <div className="flex flex-col pt-8">
                    <Link href="/shop" className="mb-6 inline-flex items-center gap-2 font-inter text-sm text-black/50 hover:text-[#CC0000] transition-colors w-fit">
                        <span>&larr;</span> Back to Shop
                    </Link>
                    <h1 className="font-bebas text-4xl md:text-5xl tracking-wide text-black/95">
                        {shoe.name}
                    </h1>
                    <p className="mt-2 font-inter text-lg text-black/60">
                        {shoe.tagline}
                    </p>
                    <p className="mt-4 font-semibold font-inter text-2xl text-black">
                        {shoe.price}
                    </p>

                    {shoe.allSizes.length > 0 && (
                        <>
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
                            py-3 px-2 font-inter text-sm border transition-all duration-200 ease-out truncate
                            ${isAvailable
                                                    ? isSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-black/20 bg-white text-black hover:border-black/60"
                                                    : "border-black/10 bg-black/5 text-black/30 cursor-not-allowed"}`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={shoe.allSizes.length > 0 && !selectedSize}
                        className={`mt-10 py-5 w-full font-inter text-sm uppercase tracking-widest font-semibold transition-all duration-200
              ${(shoe.allSizes.length === 0 || selectedSize)
                                ? "bg-black text-white hover:bg-[#CC0000]"
                                : "bg-black/20 text-black/50 cursor-not-allowed"
                            }`}
                    >
                        {shoe.allSizes.length === 0 || selectedSize ? "Add to Bag" : "Select a Size"}
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
