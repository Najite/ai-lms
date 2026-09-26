import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#010102",
          1: "#08090a",
          2: "#0f1012",
          3: "#16171a",
          4: "#1e2023",
        },
        border: {
          base: "#23252a",
          muted: "#1b1c20",
          active: "#2e3038",
          highlight: "#3b3e48",
        },
        text: {
          primary: "#f7f8f8",
          secondary: "#8a8f98",
          tertiary: "#565961",
          quaternary: "#383b42",
        },
        brand: {
          accent: "#5e6ad2",
          hover: "#6f7be8",
          muted: "#2d3154",
        },
        status: {
          green: "#4cb782",
          "green-border": "#1b4332",
          amber: "#e5993e",
          "amber-border": "#4a3000",
          red: "#eb5757",
          "red-border": "#4a1515",
          cyan: "#56b6c2",
          "cyan-border": "#103840",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "'Fira Code'", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "card-bevel": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "btn-bevel": "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "accent-subtle": "0 0 16px rgba(94, 106, 210, 0.15)",
      },
      borderRadius: {
        sharp: "4px",
        default: "6px",
        panel: "8px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
