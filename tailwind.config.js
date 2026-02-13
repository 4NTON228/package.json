/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pink-light': '#FFB6C1',
        'pink-peach': '#FFDAB9',
        'pink-accent': '#FF6B9D',
      },
    },
  },
  plugins: [],
}
