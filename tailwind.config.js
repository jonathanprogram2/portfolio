/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        checkerFade: "checkerFade 1.2s ease-in-out forwards",
      },
      keyframes: {
        checkerFade: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        }
      },
      fontFamily: {
        ethnocentric: ['"Ethnocentric"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

