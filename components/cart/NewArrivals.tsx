"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, getProductImage, type SupabaseProduct } from "@/lib/api/products";

interface ArrivalItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

export default function NewArrivals() {
  const [arrivals, setArrivals] = useState<ArrivalItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          // Take the latest 3 products
          setArrivals(
            data.slice(0, 3).map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name.toUpperCase(),
              price: p.base_price,
              image: getProductImage(p.slug),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (arrivals.length === 0) return null;

  return (
    <section className="py-20 border-t border-black/10">
      <div className="flex justify-between items-baseline mb-12">
        <h2 className="font-bebas text-[40px] md:text-[60px] text-black/90 tracking-tight leading-none uppercase">
          NEW ARRIVALS
        </h2>
        <Link 
          href="/shop" 
          className="font-inter text-[10px] tracking-widest text-black/50 uppercase hover:text-[#CC0000] transition-colors flex items-center gap-2"
        >
          SEE ALL <span className="text-sm">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {arrivals.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer">
            <div className="aspect-[3/4] bg-[#F5F5F5] mb-4 overflow-hidden relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-1">
              <p className="font-inter text-xs text-black/70 italic leading-none">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <h3 className="font-inter text-[10px] tracking-widest text-black/90 uppercase leading-snug">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
