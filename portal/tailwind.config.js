/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#064E3B', 50: '#ECFDF5', 100: '#D1FAE5', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B', 950: '#022C22' },
        secondary: { DEFAULT: '#10B981', light: '#34D399', dark: '#059669' },
        sage:      { DEFAULT: '#2D6A4F', light: '#D8F3DC' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


