/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // or './app' if you're using Next.js app dir
    ],
    theme: {
      extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
  }
  