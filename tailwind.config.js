/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077b6',
          dark: '#03045e',
          light: '#90e0ef',
          soft: '#caf0f8',
        },
        secondary: {
          DEFAULT: '#00b4d8',
          dark: '#0077b6',
          light: '#90e0ef',
        },
        accent: {
          DEFAULT: '#90e0ef',
          light: '#caf0f8',
        },
      },
    },
  },
  plugins: [],
};
