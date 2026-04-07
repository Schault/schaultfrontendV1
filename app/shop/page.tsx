import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAFooter from "@/components/CTAFooter";
import { getCollections, getProducts } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // ISR - revalidate every 60s

export default async function ShopPage() {
    const collections = await getCollections(10);
    const allProducts = await getProducts(50);

    const hasShopifyCollections = collections && collections.length > 0;

    // Track products already included in collections
    const collectionProductIds = new Set<string>();
    if (hasShopifyCollections) {
        collections.forEach((col) => {
            col.products.edges.forEach((edge) => collectionProductIds.add(edge.node.id));
        });
    }

    // Separate products not part of any collection
    const standaloneProducts = allProducts
        ? allProducts.filter((p) => !collectionProductIds.has(p.id))
        : [];

    const hasStandaloneProducts = standaloneProducts.length > 0;
    const hasShopifyData = hasShopifyCollections || hasStandaloneProducts;

    return (
        <main className="min-h-screen bg-[#F5F5F5]">
            <Navbar />

            {/* Header Padding since Navbar is fixed */}
            <div className="pt-32 pb-12 px-6 md:px-12 lg:px-24 mx-auto max-w-6xl">
                <div className="mb-2 h-0.5 w-12 bg-[#CC0000]" aria-hidden />
                <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-black/95">
                    SHOP ALL
                </h1>
                <p className="mt-3 font-inter text-lg text-black/60">
                    The intersection of performance and extreme modularity.
                </p>
            </div>

            <section className="px-6 md:px-12 lg:px-24 pb-24 mx-auto max-w-6xl">
                {!hasShopifyData ? (
                    /* Empty State */
                    <div className="mt-12 flex items-center justify-center p-12 border border-dashed border-black/20 bg-black/5">
                        <p className="font-inter text-sm text-black/50 uppercase tracking-wide">
                            No products available at the moment.
                        </p>
                    </div>
                ) : (
                    /* Render Live Shopify Collections */
                    <div className="mt-12 space-y-24">
                        {hasShopifyCollections && collections.map((collection) => {
                            const products = collection.products.edges.map((edge) => edge.node);
                            if (products.length === 0) return null;

                            return (
                                <div key={collection.id}>
                                    <h2 className="mb-8 font-bebas text-3xl tracking-wide text-black/90 uppercase border-b border-black/10 pb-4">
                                        {collection.title}
                                    </h2>
                                    {collection.description && (
                                        <p className="mb-6 font-inter text-black/60 -mt-4">
                                            {collection.description}
                                        </p>
                                    )}
                                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                        {products.map((shopifyProduct) => {
                                            const firstImage = shopifyProduct.images.edges[0]?.node;
                                            const price = shopifyProduct.priceRange.minVariantPrice;

                                            const formattedProduct = {
                                                id: shopifyProduct.handle,
                                                name: shopifyProduct.title,
                                                description: shopifyProduct.description || "",
                                                price: `$${parseFloat(price.amount).toFixed(2)}`,
                                                image: firstImage?.url ?? "/images/shoes/bluewhite.jpg",
                                            };

                                            return (
                                                <ProductCard key={shopifyProduct.id} product={formattedProduct} />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {hasStandaloneProducts && (
                            <div>
                                <h2 className="mb-8 font-bebas text-3xl tracking-wide text-black/90 uppercase border-b border-black/10 pb-4">
                                    {hasShopifyCollections ? "ALL PRODUCTS" : "LATEST ARRIVALS"}
                                </h2>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {standaloneProducts.map((shopifyProduct) => {
                                        const firstImage = shopifyProduct.images.edges[0]?.node;
                                        const price = shopifyProduct.priceRange.minVariantPrice;

                                        const formattedProduct = {
                                            id: shopifyProduct.handle,
                                            name: shopifyProduct.title,
                                            description: shopifyProduct.description || "",
                                            price: `$${parseFloat(price.amount).toFixed(2)}`,
                                            image: firstImage?.url ?? "/images/shoes/bluewhite.jpg",
                                        };

                                        return (
                                            <ProductCard key={shopifyProduct.id} product={formattedProduct} />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <CTAFooter />
            <Footer />
        </main>
    );
}

// ── Shared Product Card ─────────────────────────────────────────────────────

function ProductCard({
    product,
}: {
    product: { id: string; name: string; description: string; price: string; image: string };
}) {
    return (
        <article className="group flex flex-col bg-white transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-sm">
            <Link href={`/product/${product.id}`} className="flex flex-col flex-1 h-full w-full outline-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-[250ms] group-hover:scale-[1.02]"
                    />
                </div>
                <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bebas text-xl tracking-wide text-black/90">
                        {product.name}
                    </h3>
                    <p className="mt-1 font-inter text-xs text-black/50 line-clamp-2">
                        {product.description}
                    </p>
                    <p className="mt-3 font-inter text-sm font-semibold text-black">
                        {product.price}
                    </p>
                    <span className="mt-auto block w-full border border-black py-2.5 text-center font-inter text-xs uppercase tracking-wide transition-all duration-250 ease-out hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white">
                        View Details
                    </span>
                </div>
            </Link>
        </article >
    );
}
