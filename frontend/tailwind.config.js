/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sylhet: {
          green: '#059669',
          'green-dark': '#065f46',
          'green-light': '#10b981',
          yellow: '#facc15',
          'yellow-dark': '#ca8a04',
          gold: '#eab308',
          red: '#dc2626',
          newsprint: '#fcf8eb',
          'newsprint-dark': '#f4ebd0',
          ink: '#1c1917',
        },
      },
      fontFamily: {
        bangla: ['Hind Siliguri', 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', 'sans-serif'],
        newspaper: ['Playfair Display', 'Merriweather', 'SolaimanLipi', 'serif'],
        display: ['Outfit', 'Montserrat', 'sans-serif'],
      },
      animation: {
        'ticker-slide': 'ticker 25s linear infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};
