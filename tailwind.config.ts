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
        cream: {
          DEFAULT: "#faf9f7",
          dark: "#f5f3f0",
        },
        muted: "#666666",
        correct: "#2e7d32",
        incorrect: "#c62828",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Lora", "Georgia", "serif"],
        ui: ["Syne", "sans-serif"],
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
      letterSpacing: {
        editorial: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
