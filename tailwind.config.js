/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        coffee_wave: "url('/bottom.svg')",
      },
    },
  },
  plugins: [],
};
