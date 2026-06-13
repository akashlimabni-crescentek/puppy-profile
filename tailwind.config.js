/** @type {import('tailwindcss').Config} */

/**
 * DESIGN TOKENS — Stokeshire vendor design spec
 * Single source of truth for the visual system. CSS custom properties in
 * `src/styles/index.css` mirror these values (the `--stokeshire-*` variables).
 * To re-skin the UI, change values here and in index.css only — never in a
 * component (see CRESCENTEK-CODE-QUALITY-STANDARD §13).
 *
 * Copper (#9C723A) is a restrained hero accent: active states, the single key
 * metric (week progress), and the one primary CTA only — never a fill or body
 * text.
 */
const tokens = {
  colors: {
    // Primary
    tan: '#E4DFD8',
    blue: '#9CA5B0',
    copper: '#9C723A', // HERO ACCENT — use sparingly
    ink: '#1C1C1C',

    // UI neutral
    slate: 'rgba(82, 82, 82, 0.7)',

    // Supporting
    'tan-light': '#F2EFEA',
    'tan-dark': '#CFC7BC',
    'copper-light': '#C29A5A',
    'copper-dark': '#6E4F27', // accessible copper for body text on light grounds
    cream: '#FAF7F2',
    parchment: '#F5EFE4',

    // Functional UI states (form validation, etc. — outside the brand card)
    success: '#3F7A4F',
    warning: '#9C723A',
    error: '#9B3B33',
  },
  fontFamily: {
    // Display / headers / puppy name
    display: ['Cormorant Garamond', 'serif'],
    // Body / UI / labels / data
    sans: ['Jost', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    card: '16px', // Stokeshire card radius (spec range 14–18px)
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
}

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius,
      boxShadow: {
        // Barely perceptible — the spec calls for none or near-none.
        card: '0 1px 2px rgba(28, 28, 28, 0.04)',
        'card-hover': '0 2px 6px rgba(28, 28, 28, 0.06)',
      },
      borderColor: {
        hairline: 'rgba(28, 28, 28, 0.07)', // Stokeshire card border
      },
    },
  },
  plugins: [],
}
