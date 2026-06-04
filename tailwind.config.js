/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'azul-noche':  '#0A1628',
        'azul-medio':  '#152238',
        'azul-acento': '#1B3A6B',
        'rojo':        '#D10A11',
        'oro':         '#C8922A',
        'blanco':      '#F5F0E8',
        'verde-gol':   '#00B341',
        'gris':        '#8A8A8A',
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'Impact', 'Arial Narrow', 'sans-serif'],
        barlow:    ['Barlow', 'Arial', 'sans-serif'],
      },
      maxWidth: { site: '1600px' },
      animation: {
        shimmer:     'shimmer 2s infinite',
        'flip-in':   'flipIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-gol': 'pulseGol 0.6s ease-out',
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'bounce-ball':'bounceBall 0.8s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200%' },
          '100%': { backgroundPosition: '-200%' },
        },
        flipIn: {
          '0%':   { transform: 'rotateX(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)',   opacity: '1' },
        },
        pulseGol: {
          '0%':   { transform: 'scale(1)',    boxShadow: 'none' },
          '50%':  { transform: 'scale(1.08)', boxShadow: '0 0 30px #00B341' },
          '100%': { transform: 'scale(1)',    boxShadow: 'none' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceBall: {
          '0%, 100%': { transform: 'translateY(0) scaleX(1)' },
          '50%':      { transform: 'translateY(-18px) scaleX(0.93)' },
        },
      },
    },
  },
  plugins: [],
}
