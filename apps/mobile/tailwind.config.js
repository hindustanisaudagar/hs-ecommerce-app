/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        foreground: '#1A1613',
        primary: { DEFAULT: '#1A1613', foreground: '#FAF8F5' },
        secondary: { DEFAULT: '#EDE6DB', foreground: '#1A1613' },
        muted: { DEFAULT: '#EDE6DB', foreground: '#7D6B5D' },
        accent: { DEFAULT: '#B85A38', foreground: '#FAF8F5' },
        destructive: { DEFAULT: '#B85A38', foreground: '#FAF8F5' },
        border: '#E5DDD2',
        input: '#E5DDD2',
        ring: '#B85A38',
        terracotta: { DEFAULT: '#B85A38', light: '#D4785A' },
        'clay-brown': '#7D6B5D',
        'warm-beige': '#EDE6DB',
        cream: '#FAF8F5',
        ink: '#1A1613',
        gold: '#C9A962',
      },
      fontFamily: {
        sans: ['Inter'],
        serif: ['CormorantGaramond'],
        hindi: ['TiroDevanagariHindi'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
