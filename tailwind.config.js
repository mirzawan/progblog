/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f131c",
        surface: "#111827",
        "surface-container": "#1c2028",
        "surface-container-low": "#181c24",
        "surface-container-highest": "#31353e",
        "surface-raised": "#161f30",
        "primary-container": "#38bdf8",
        primary: "#8ed5ff",
        "on-primary": "#00354a",
        "text-primary": "#e2e8f0",
        "text-muted": "#94a3b8",
        secondary: "#4edea3",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}