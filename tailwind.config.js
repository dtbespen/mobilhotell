/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Vivid green – primary
        primary: {
          50: "#dfffec",
          100: "#b0ffd0",
          200: "#6bffaa",
          300: "#2bf582",
          400: "#00e660",
          500: "#00cc52",
          600: "#00a843",
          700: "#008537",
          800: "#00692d",
          900: "#005625",
          950: "#003316",
        },
        // Vivid amber/gold – rewards / Plugs
        accent: {
          50: "#fff9e5",
          100: "#ffefb8",
          200: "#ffe080",
          300: "#ffd04a",
          400: "#ffc020",
          500: "#ffab00",
          600: "#e08f00",
          700: "#b87000",
          800: "#945800",
          900: "#7a4800",
          950: "#4a2a00",
        },
        // Vivid red/coral – streaks, alerts
        danger: {
          50: "#ffece9",
          100: "#ffd4ce",
          200: "#ffada3",
          500: "#ff4040",
          600: "#ee2020",
          700: "#cc1515",
        },
        // Vivid purple – info, links
        info: {
          50: "#eeebff",
          100: "#ddd5ff",
          200: "#bfb0ff",
          500: "#7b61ff",
          600: "#6248e5",
          700: "#4d36c4",
        },
        // Dark base – backgrounds
        dark: {
          50: "#2a2d35",
          100: "#22252b",
          200: "#1c1f24",
          300: "#16191d",
          400: "#121417",
          500: "#0e1012",
        },
      },
    },
  },
  plugins: [],
};
