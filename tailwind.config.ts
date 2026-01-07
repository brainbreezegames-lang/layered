import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a472a",
          light: "#2d5a3d",
          dark: "#0f2a19",
        },
        accent: {
          DEFAULT: "#c9a227",
          light: "#d4b44a",
          dark: "#a6851f",
        },
        level: {
          a1: "#4CAF50",
          a2: "#8BC34A",
          b1: "#FFC107",
          b2: "#FF9800",
          c1: "#F44336",
        },
        cream: {
          DEFAULT: "#faf9f7",
          dark: "#f5f3f0",
        },
        correct: "#2e7d32",
        incorrect: "#c62828",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Lora", "Georgia", "serif"],
        ui: ["Inter", "Helvetica Neue", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      maxWidth: {
        article: "680px",
      },
      lineHeight: {
        relaxed: "1.75",
      },
    },
  },
  plugins: [],
};

export default config;
