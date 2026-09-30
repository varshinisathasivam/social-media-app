/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        instagram: {
          pink: '#E1306C',
          purple: '#C13584',
          orange: '#F77737',
          yellow: '#FCAF45',
          blue: '#0095F6',
          darkBg: '#0f141c',
          darkCard: '#1a2230',
          darkBorder: '#273549'
        }
      },
      keyframes: {
        heartPulse: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.3)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        }
      },
      animation: {
        heart: 'heartPulse 0.8s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
