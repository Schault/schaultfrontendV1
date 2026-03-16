import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["var(--font-bebas-neue)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        schlaut: {
          white: "#FFFFFF",
          red: "#CC0000",
          black: {
            DEFAULT: "rgba(0,0,0,0.9)",
            muted: "rgba(0,0,0,0.6)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
