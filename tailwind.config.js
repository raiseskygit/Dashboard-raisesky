/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ea580c",
          dark: "#c2410c",
          light: "#fff7ed",
        },
      },
    },
  },
  plugins: [],
};
