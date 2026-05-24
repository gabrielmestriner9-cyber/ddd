/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#F0B429',
        'dnz-bg': '#0A0A0A',
        'dnz-surface': '#161616',
        'dnz-elevated': '#1E1E1E',
        brand: {
          pink: '#D4006D',
          'pink-light': '#FF4DA6',
          'pink-pale': '#FFF0F7',
          gold: '#C9992B',
          'gold-light': '#F0C040',
          dark: '#0D0D1A',
          'dark-2': '#1A1A2E',
          'dark-3': '#252540',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-pink': 'pulse-pink 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.35s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'scan': 'scan 2.5s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        'pulse-pink': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5', boxShadow: '0 0 20px #D4006D' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { top: '0%', opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { top: '100%', opacity: '0' },
          '51%': { top: '0%', opacity: '0' },
          '55%': { opacity: '1' },
          '100%': { top: '100%', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
