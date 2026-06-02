/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
        },
        gold: {
          DEFAULT: '#C5A059',
          500: '#C5A059',
          600: '#B38D45',
          light: '#D4AF37',
        },
        offwhite: '#FAF9F6',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.2)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
