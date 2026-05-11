/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        poke: {
          red: '#E3350D',
          'red-dark': '#C02A09',
          yellow: '#E6A800',
          blue: '#3182CE',
          dark: '#222222',
          'dark-2': '#444444',
          gray: '#E5E7EB',
          'gray-light': '#F3F4F6',
          'gray-dark': '#737373',
          white: '#FFFFFF',
          light: '#F9F9F9',
        },
        type: {
          normal: '#A8A77A',
          fire: '#EE8130',
          water: '#6390F0',
          electric: '#F7D02C',
          grass: '#7AC74C',
          ice: '#96D9D6',
          fighting: '#C22E28',
          poison: '#A33EA1',
          ground: '#E2BF65',
          flying: '#A98FF3',
          psychic: '#F95587',
          bug: '#A6B91A',
          rock: '#B6A136',
          ghost: '#735797',
          dragon: '#6F35FC',
          dark: '#705746',
          steel: '#B7B7CE',
          fairy: '#D685AD',
        },
      },
      boxShadow: {
        'flat': '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
