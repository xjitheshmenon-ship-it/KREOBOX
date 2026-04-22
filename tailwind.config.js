/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#0F0F0F',
        sidebar: '#1A1A1A',
        card:    '#2A2A2A',
        accent:  '#FF6B35',
        'text-secondary': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
