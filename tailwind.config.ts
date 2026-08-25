import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        smoke: {
          black: "var(--bg-black)",
          dark: "var(--bg-dark)",
          DEFAULT: "var(--bg-smoke)",
          light: "var(--bg-smoke-light)",
          lighter: "var(--bg-smoke-lighter)",
        },
        brand: {
          orange: "#FF6A00",
          orangeHover: "#FF7A1A",
          orangeMuted: "rgba(255, 106, 0, 0.15)",
          green: "#10B981",
          greenHover: "#059669",
          greenLight: "rgba(16, 185, 129, 0.12)",
          emerald: "#00DC82",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Sukhumvit Set",
          "Sukhumvit",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "Inter",
          "Sukhumvit Set",
          "Sukhumvit",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient": "radial-gradient(at 50% 0%, rgba(255, 106, 0, 0.08) 0px, transparent 60%)",
        "green-mesh": "radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 106, 0, 0.3)",
        "glow-green": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glow-lg": "0 0 50px -10px rgba(255, 106, 0, 0.25)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        "card-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
