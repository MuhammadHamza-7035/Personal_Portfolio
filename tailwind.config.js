/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Palette is restricted to the design tokens on purpose.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'rgb(255 255 255 / <alpha-value>)',
      black: 'rgb(0 0 0 / <alpha-value>)',
      bg: 'rgb(var(--bg) / <alpha-value>)',
      surface: 'rgb(var(--surface) / <alpha-value>)',
      border: 'rgb(var(--border) / <alpha-value>)',
      text: 'rgb(var(--text) / <alpha-value>)',
      muted: 'rgb(var(--muted) / <alpha-value>)',
      accent: 'rgb(var(--accent) / <alpha-value>)',
      'accent-glow': 'var(--accent-glow)',
    },
    borderRadius: {
      none: '0',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      pill: '9999px',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        sans: [
          '"Geist Variable"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          '"Geist Mono Variable"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        display: [
          'clamp(2.75rem, 1.25rem + 7vw, 7.5rem)',
          { lineHeight: '0.92', letterSpacing: '-0.045em', fontWeight: '600' },
        ],
        headline: [
          'clamp(2rem, 1.1rem + 3.8vw, 4rem)',
          { lineHeight: '1', letterSpacing: '-0.035em', fontWeight: '600' },
        ],
        title: [
          'clamp(1.25rem, 1rem + 1vw, 1.75rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        lead: [
          'clamp(1.0625rem, 0.98rem + 0.4vw, 1.25rem)',
          { lineHeight: '1.55', letterSpacing: '-0.005em' },
        ],
        label: [
          '0.75rem',
          { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '500' },
        ],
      },
      spacing: {
        section: 'var(--space-section)',
        gutter: 'var(--gutter)',
      },
      maxWidth: {
        page: 'var(--page-max)',
      },
      borderColor: {
        DEFAULT: 'rgb(var(--border) / 0.09)',
      },
      boxShadow: {
        glass:
          'inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 24px 48px -24px rgb(0 0 0 / 0.6)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.45), 0 0 32px -4px var(--accent-glow)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        micro: '150ms',
        fast: '200ms',
        base: '250ms',
        page: '320ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [],
};