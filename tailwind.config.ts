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
        forest: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#081C15",
        },
        mint: {
          DEFAULT: "#95D5B2",
          light: "#D8F3DC",
        },
        cream: {
          DEFAULT: "#FAF8F3",
          warm: "#EDE8E0",
          dark: "#F0EDE6",
        },
        terracotta: "#C2703A",
        gold: "#B8860B",
        // Legacy support
        primary: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#081C15",
        },
        muted: "#78716C",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "Times New Roman", "serif"],
        body: ["Source Sans 3", "-apple-system", "sans-serif"],
        ui: ["Source Sans 3", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "12px",
        "xl": "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.08)",
        float: "0 -4px 20px rgba(0,0,0,0.08)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
