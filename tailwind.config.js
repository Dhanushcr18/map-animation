/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#f5f5f0',
        carbon: '#1a1a1a'
      }
    }
  },
  plugins: []
};