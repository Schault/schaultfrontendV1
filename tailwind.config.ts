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
          red: "#0350F0",
          black: {
            DEFAULT: "rgba(0,0,0,0.9)",
            muted: "rgba(0,0,0,0.6)",
          },
        },
      },
      keyframes: {
        "star-movement-bottom": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
      },
      animation: {
        "star-movement-bottom": "star-movement-bottom 6s linear infinite",
        "star-movement-top": "star-movement-top 6s linear infinite",
        "border-beam": "border-beam 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
