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
          DEFAULT: "#FFFEF9",
          warm: "#F5F1EB",
        },
        coral: "#E07A5F",
        gold: "#D4A574",
        // Legacy support
        primary: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#081C15",
        },
        muted: "#52524E",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["DM Sans", "sans-serif"],
        ui: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "xl": "12px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.12)",
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
