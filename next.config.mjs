/** @type {import('next').NextConfig} */
const nextConfig = {
  // The invoice PDF reads its bundled fonts from disk at runtime; Next cannot
  // trace an fs path, so include them in the serverless bundle explicitly.
  experimental: {
    outputFileTracingIncludes: {
      "/api/payments/verify": ["./lib/invoice/fonts/**"],
      "/api/payments/webhook": ["./lib/invoice/fonts/**"],
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
