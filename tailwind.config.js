/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1ffdb0",
        background: "#181818",
      },
      fontFamily: {
        bebas: ["Bebas Neue", "cursive"],
      },
    },
  },
  plugins: [],
};
