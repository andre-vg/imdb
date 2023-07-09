/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "electric-violet": {
          50: "#f3f1ff",
          100: "#ebe5ff",
          200: "#d9ceff",
          300: "#bea6ff",
          400: "#9f75ff",
          500: "#843dff",
          600: "#7916ff",
          700: "#6b04fd",
          800: "#5a03d5",
          900: "#4b05ad",
          950: "#2c0076",
        },
        'woodsmoke': {
          '50': '#f6f6f7',
          '100': '#e1e1e6',
          '200': '#c2c2cd',
          '300': '#9e9cac',
          '400': '#78768b',
          '500': '#5e5c70',
          '600': '#4a4859',
          '700': '#3e3c49',
          '800': '#35333c',
          '900': '#2f2d34',
          '950': '#17161b',
      },      
      },
    },
  },
  darkMode: 'class', // or 'media' or 'class
  plugins: [],
};
