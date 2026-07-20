/** @type {import('tailwindcss').Config} */

// Surface/neutral (slate) and accent (sky/indigo) scales resolve through CSS
// custom properties so the whole UI re-themes (dark ↔ light, accent color)
// without touching component class names. Values are set per theme in
// src/index.css. `<alpha-value>` keeps Tailwind's /opacity modifiers working.
const varColor = (name) => `rgb(var(${name}) / <alpha-value>)`;

const scale = (prefix, shades) =>
  Object.fromEntries(shades.map((s) => [s, varColor(`--${prefix}-${s}`)]));

const SLATE_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950];
const ACCENT_SHADES = [300, 400, 500, 600, 700];

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware neutral surface + text ramp.
        slate: scale('slate', SLATE_SHADES),
        // Theme-aware accent pair (swapped by data-accent for Pro themes).
        sky: scale('sky', ACCENT_SHADES),
        indigo: scale('indigo', ACCENT_SHADES),
        // `white` follows the theme so text-white / bg-white flip in light
        // mode. Use `.text-white-fixed` (index.css) to force pure white on
        // saturated/gradient surfaces.
        white: varColor('--white'),
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
