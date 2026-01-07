import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs de fond iOS
        'ios-bg': '#F2F2F7',
        'ios-bg-secondary': '#FFFFFF',
        'ios-bg-tertiary': '#FAFAFA',

        // Couleurs système iOS
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-indigo': '#5856D6',
        'ios-orange': '#FF9500',
        'ios-pink': '#FF2D55',
        'ios-purple': '#AF52DE',
        'ios-red': '#FF3B30',
        'ios-teal': '#5AC8FA',
        'ios-yellow': '#FFCC00',

        // Couleurs de texte iOS
        'ios-label': '#000000',
        'ios-label-secondary': '#3C3C43',
        'ios-label-tertiary': '#3C3C4399',
        'ios-label-quaternary': '#3C3C432E',

        // Couleurs de séparation iOS
        'ios-separator': '#3C3C4329',
        'ios-separator-opaque': '#C6C6C8',

        // Couleurs spécifiques app "Recettes"
        'recipe-primary': '#ff2d55',
        'recipe-secondary': '#FF686B',
        'recipe-accent': '#ffa69e',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        'ios-xs': '4px',
        'ios-sm': '8px',
        'ios-md': '16px',
        'ios-lg': '24px',
        'ios-xl': '32px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'ios-md': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'ios-xl': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.28, 0, 0.42, 1)',
      },
      transitionDuration: {
        'ios-fast': '200ms',
        'ios-normal': '300ms',
        'ios-slow': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
