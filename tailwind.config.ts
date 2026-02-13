import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        softPink: "#ffe4ec",
        softBlue: "#e6f1ff",
        softPurple: "#f2ebff"
      }
    }
  },
  plugins: []
};

export default config;
