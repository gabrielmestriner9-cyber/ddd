/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#dbeefe',
          200: '#bfe0fd',
          300: '#93ccfb',
          400: '#5eaef7',
          500: '#3b91f2',
          600: '#1e6fc6',
          700: '#1a5aa0',
          800: '#1a4c84',
          900: '#1a3f6d',
          DEFAULT: '#1a5aa0',
        },
        accent: {
          50: '#f6fce8',
          100: '#ecf9d1',
          200: '#d6f1a5',
          300: '#b7e46d',
          400: '#96d43c',
          500: '#78bc1f',
          600: '#5c9714',
          700: '#467512',
          800: '#3a5e14',
          900: '#314f15',
          DEFAULT: '#78bc1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
