/** @type {import('tailwindcss').Config} */

/**
 * DESIGN TOKENS
 * TODO: Replace ALL values in this object with client-provided design spec.
 * This is the single source of truth — change here, entire UI updates.
 */
const tokens = {
  colors: {
    primary: {
      50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc',
      400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf',
      800: '#86198f', 900: '#701a75',
    },
    accent: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
      400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
      800: '#9a3412', 900: '#7c2d12',
    },
    neutral: {
      50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
      400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
      800: '#27272a', 900: '#18181b',
    },
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  fontFamily: {
    // TODO: Replace with client font
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    // TODO: Replace with client typography scale
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  },
  borderRadius: {
    none: '0', sm: '0.125rem', DEFAULT: '0.25rem', md: '0.375rem',
    lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', full: '9999px',
  },
}

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius,
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
