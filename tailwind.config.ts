// tailwind.config.ts
// The palette of a world remembering its own warmth

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth tones — not escapism, but ground
        ember:    "#C1440E",
        ochre:    "#D4884A",
        silt:     "#8B7355",
        moss:     "#4A5C3A",
        dusk:     "#1A1410",
        heartglow:"#FF6B3D",
        pulse:    "#FFB347",
        ash:      "#E8DDD0",
      },
      fontFamily: {
        // Cormorant for the ache of the real; Inconsolata for precise truth
        serif:  ["var(--font-cormorant)", "Georgia", "serif"],
        mono:   ["var(--font-inconsolata)", "monospace"],
      },
      animation: {
        "slow-breathe": "breathe 6s ease-in-out infinite",
        "field-pulse":  "fieldpulse 4s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%":      { opacity: "1",   transform: "scale(1.03)" },
        },
        fieldpulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};

export default config;