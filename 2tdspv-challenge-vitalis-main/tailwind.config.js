/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: "#f4f7f5",
        "surface-container-low": "#e8ede9",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#d9e0da",
        "surface-container-highest": "#cdd4ce",
        "on-surface": "#1a1c1a",
        "on-surface-variant": "#404943",
        primary: "#02C39A",
        "primary-container": "#a8f0dc",
        "on-primary-container": "#00382a",
        secondary: "#1E2D40",
        "on-secondary": "#ffffff",
        outline: "#707973",
        "outline-variant": "#bfc9c1",
      },
      fontFamily: {
        headline: ["Lexend_700Bold"],
        body: ["Inter_400Regular"],
      },
    },
  },
  plugins: [],
};