/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B0F1A',
          light: '#161C2D',
          dark: '#05080F'
        },
        secondary: {
          DEFAULT: '#F5F7FA',
          dark: '#E4E8F0'
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA'
        },
        highlight: {
          DEFAULT: '#22C55E',
          hover: '#16A34A'
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
