/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      objectPosition: {
        "almost-top": "25% 50%"
      },
      screens: {
        "3xl": "1660px"
      },
      borderRadius: {
        "4xl": "2rem"
      },
    },
  },
  plugins: [],
}

