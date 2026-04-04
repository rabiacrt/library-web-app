/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        boxShadow: {
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)', // Biraz daha yumuşak bir gölge
        },
        fontFamily: {
          display: ['"Playfair Display"', 'serif'],
          body: ['"DM Sans"', 'sans-serif'],
          italic: ['"Cormorant Garamond"', 'serif'],
        },
        colors: {
          cream: '#F5F0E8',
          'light-warm': '#EDE5D5',
          ink: '#2C2418',
          dark: '#1A1410',
          warm: '#8B5E3C',
          gold: '#C9A84C',
          rust: '#A04030',
          sage: '#5A6B5B',
        },
      },
    },
    plugins: [],
  }