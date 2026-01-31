/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#F9FAFB',
        card: '#FFFFFF',
        primary: '#3B82F6',
        border: '#E5E7EB',
        text: '#111827',
        error: '#EF4444',
        success: '#10B981',
      },
    },
  },
  plugins: [],
}
