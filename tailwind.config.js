/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:         '#F5F3EE',
        sidebar:        '#1A1208',
        'sidebar-act':  '#2A1E0C',
        card:           '#FFFFFF',
        accent:         '#E85228',
        'accent-hover': '#D04420',
        border:         '#E8E5DF',
        'border-dark':  '#2E1E0E',
        ink:            '#1C1A16',
        'ink-2':        '#7A7570',
        'ink-3':        '#ABA79E',
        success:        '#3CAF6A',
        'success-bg':   '#EAF7F0',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
