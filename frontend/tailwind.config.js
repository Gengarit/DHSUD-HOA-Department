/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1A1F2B',
        card: '#242B3D',
        text: '#E2E8F0',
        accent: '#6366F1',
        accentHover: '#4F46E5',
        border: '#374151',
        danger: '#EF4444',
        dangerHover: '#DC2626',
        success: '#10B981',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
