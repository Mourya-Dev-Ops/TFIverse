/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e8b923',
          dark: '#b8891a',
          light: '#f5d060',
        },
        dark: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          hover: '#242424',
        },
      },
    },
  },
  plugins: [],
}

