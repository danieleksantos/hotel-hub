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
          DEFAULT: '#0f5132', 
          hover: '#0a3622',   
          light: '#d1e7dd',   
        },
        secondary: {
          DEFAULT: '#fbbf24', 
          light: '#fff3cd',   
          dark: '#b45309',    
        },
        background: '#f8f9fa', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}