import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F0D",   // fundo principal, preto com leve nuance verde
          raised: "#121A15",    // cards, sidebar
          hover: "#1A2620",     // hover de itens
        },
        line: "#233229",        // bordas e divisores
        ink: {
          DEFAULT: "#EAF2EC",   // texto principal
          muted: "#8CA396",     // texto secundário
          faint: "#5B6E62",     // texto terciário / placeholders
        },
        pulse: {
          DEFAULT: "#6FCF97",   // verde principal (ações, destaques)
          strong: "#8FE3AC",    // hover / foco
          dim: "#2F5233",       // preenchimentos suaves, badges
        },
        signal: "#D4E09B",      // atividade "agora" / atenção
      },
      fontFamily: {
        head: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
