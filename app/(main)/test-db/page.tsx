"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabaseClient";

type Product = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  product_variants: {
    id: string;
    size: string;
    color: string | null;
    stock_quantity: number;
  }[];
};

export default function TestDBPage() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("products")
          .select(
            `
            id,
            name,
            slug,
            base_price,
            product_variants (
              id, size, color, stock_quantity
            )
          `
          )
          .eq("is_active", true);

        if (error) {
          setStatus("error");
          setErrorMessage(error.message);
          return;
        }

        setProducts(data ?? []);
        setStatus("connected");
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Supabase Connection Test
      </h1>

      {status === "loading" && <p>⏳ Connecting to Supabase...</p>}

      {status === "connected" && (
        <>
          <p style={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
            ✅ Connected — Supabase is working!
          </p>

          {products.length === 0 ? (
            <p style={{ marginTop: "1rem", color: "#666" }}>
              No products found. Run the seed SQL to add test data.
            </p>
          ) : (
            <div style={{ marginTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Products in database ({products.length}):
              </h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {products.map((product) => (
                  <li
                    key={product.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: "1rem",
                      marginBottom: "0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    <strong>{product.name}</strong>
                    <span style={{ marginLeft: "0.5rem", color: "#888" }}>
                      ₹{product.base_price}
                    </span>
                    {product.product_variants?.length > 0 && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                        Variants:{" "}
                        {product.product_variants
                          .map(
                            (v) =>
                              `${v.size}${v.color ? ` / ${v.color}` : ""} (${v.stock_quantity} in stock)`
                          )
                          .join(" · ")}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {status === "error" && (
        <>
          <p style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
            ❌ Connection Failed
          </p>
          <pre
            style={{
              background: "#fee",
              padding: "1rem",
              borderRadius: "4px",
              marginTop: "0.5rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {errorMessage}
          </pre>
          <div style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
            <p>Checklist:</p>
            <ul>
              <li>Is Supabase running? (check <code>supabase status</code>)</li>
              <li>
                Are <code>.env.local</code> values filled in? (not placeholder
                text)
              </li>
              <li>Did you run the migration SQL in the Supabase dashboard?</li>
              <li>Did you restart the Next.js dev server after adding .env?</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
