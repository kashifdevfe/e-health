/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#08CB00', // Vibrant Green
          dark: '#06a300',    // Slightly darker shade for hover states
          light: '#39db32',   // Slightly lighter for accents
          soft: '#e6fae5',    // Very soft green for backgrounds
        },
        secondary: {
          DEFAULT: '#253900', // Dark Green from palette
          dark: '#1a2900',
          light: '#365200',
        },
        accent: {
          DEFAULT: '#08CB00',
          light: '#e6fae5',
        },
        page: '#EEEEEE', // Light Grey from palette
        // Headspace-inspired colors
        headspace: {
          orange: '#FF6B6B',
          peach: '#FFB88C',
          blue: '#4ECDC4',
          green: '#95E1D3',
          purple: '#A8E6CF',
          yellow: '#FFD93D',
          softBlue: '#E8F4F8',
          softPurple: '#F0E6FF',
          softPink: '#FFE6F0',
        },
      },
      borderRadius: {
        'headspace': '20px',
        'headspace-lg': '30px',
      },
      boxShadow: {
        'headspace': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'headspace-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
