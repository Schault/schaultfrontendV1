// ────────────────────────────────────────────────────────────────────────────
// Shopify Storefront API – Client Utilities
// ────────────────────────────────────────────────────────────────────────────

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ytujym-ys.myshopify.com";
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// ── Types ───────────────────────────────────────────────────────────────────

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  tags: string[];
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: { edges: { node: ShopifyProduct }[] };
};

// ── Core Fetch ──────────────────────────────────────────────────────────────

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const url = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // ISR – revalidate every 60 seconds
  });

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify API Error:", JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors[0]?.message ?? "Unknown Shopify API error");
  }

  return json.data as T;
}

// ── Queries ─────────────────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
query Products($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        handle
        title
        description
        descriptionHtml
        tags
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 25) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

const PRODUCT_BY_HANDLE_QUERY = `
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    description
    descriptionHtml
    tags
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 25) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
}
`;

const CHECKOUT_CREATE_MUTATION = `
mutation checkoutCreate($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      id
      webUrl
    }
    checkoutUserErrors {
      code
      field
      message
    }
  }
}
`;

const COLLECTIONS_QUERY = `
query Collections($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        handle
        title
        description
        products(first: 20) {
          edges {
            node {
              id
              handle
              title
              description
              descriptionHtml
              tags
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch all products from the Shopify store.
 * Returns null if credentials are missing or the request errors out.
 */
export async function getProducts(count = 20): Promise<ShopifyProduct[] | null> {
  if (!storefrontAccessToken) {
    console.warn("[Shopify] No Storefront Access Token set – falling back to mock data.");
    return null;
  }

  try {
    const data = await shopifyFetch<{
      products: { edges: { node: ShopifyProduct }[] };
    }>(PRODUCTS_QUERY, { first: count });

    return data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("[Shopify] Failed to fetch products:", error);
    return null;
  }
}

/**
 * Fetch a single product by its handle (URL slug).
 * Returns null if credentials are missing or the request errors out.
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!storefrontAccessToken) {
    console.warn("[Shopify] No Storefront Access Token set – falling back to mock data.");
    return null;
  }

  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    return data.product;
  } catch (error) {
    console.error("[Shopify] Failed to fetch product by handle:", error);
    return null;
  }
}

/**
 * Create a Shopify checkout and return the checkout object with `webUrl`.
 */
export async function createCheckout(
  lineItems: { variantId: string; quantity: number }[],
): Promise<{ id: string; webUrl: string } | null> {
  if (!storefrontAccessToken) {
    console.warn("[Shopify] No Storefront Access Token – cannot create checkout.");
    return null;
  }

  try {
    const data = await shopifyFetch<{
      checkoutCreate: {
        checkout: { id: string; webUrl: string } | null;
        checkoutUserErrors: { code: string; field: string[]; message: string }[];
      };
    }>(CHECKOUT_CREATE_MUTATION, { input: { lineItems } });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      console.error("[Shopify] Checkout errors:", data.checkoutCreate.checkoutUserErrors);
      return null;
    }

    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error("[Shopify] Failed to create checkout:", error);
    return null;
  }
}

/**
 * Check whether the Shopify integration is configured.
 */
export function isShopifyConfigured(): boolean {
  return Boolean(storefrontAccessToken && domain);
}

/**
 * Fetch all collections and their products from the Shopify store.
 */
export async function getCollections(count = 10): Promise<ShopifyCollection[] | null> {
  if (!storefrontAccessToken) {
    console.warn("[Shopify] No Storefront Access Token set – falling back to mock data.");
    return null;
  }

  try {
    const data = await shopifyFetch<{
      collections: { edges: { node: ShopifyCollection }[] };
    }>(COLLECTIONS_QUERY, { first: count });

    return data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error("[Shopify] Failed to fetch collections:", error);
    return null;
  }
}
