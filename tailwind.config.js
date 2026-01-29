/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'background-light': '#ffffff',
        'background-dark': '#0a0a0a',
        accent: '#ff8c37',
        'panel-light': '#ffffff',
        'panel-dark': '#1e293b',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        'brand-heading': ['Cormorant Garamond', 'serif'],
        'brand-body': ['Open Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
}
