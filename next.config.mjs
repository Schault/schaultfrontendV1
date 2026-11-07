/** @type {import('next').NextConfig} */
const nextConfig = {
  // The invoice PDF reads its bundled fonts from disk at runtime; Next cannot
  // trace an fs path, so include them in the serverless bundle explicitly.
  experimental: {
    outputFileTracingIncludes: {
      "/api/orders/[id]/invoice": ["./lib/invoice/fonts/**"],
    },
  },
  images: {
    // Enable Next.js image optimization (Vercel handles this automatically)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
