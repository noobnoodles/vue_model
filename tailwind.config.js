/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./packages/*/index.html",
    "./packages/*/src/**/*.{vue,js,ts,jsx,tsx}",
    "./shared/**/*.{css,vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 