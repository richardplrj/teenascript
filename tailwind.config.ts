import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:    "#FAFAF8",
        charcoal: "#1a1a1a",
        terracotta: "#C45D3E",
        "dark-bg":     "#0f0f0d",
        "dark-card":   "#1a1916",
        "dark-border": "#2a2926",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "page-in": "pageIn 0.35s ease forwards",
      },
      keyframes: {
        pageIn: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
      },
    },
  },
  plugins: [],
};
export default config;
