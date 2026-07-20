/**
 * Appearance: light/dark theme + accent color.
 *
 * Light/dark is free (accessibility). Accent color themes other than the
 * default "sky" are a Pro feature. Values are persisted to localStorage and
 * applied as `data-theme` / `data-accent` on <html>; the actual palette lives
 * in src/index.css.
 */
export type Theme = 'dark' | 'light';
export type Accent = 'sky' | 'emerald' | 'violet' | 'rose';

export const ACCENTS: readonly Accent[] = ['sky', 'emerald', 'violet', 'rose'];

/** Only the default accent is available on the free tier. */
export const FREE_ACCENTS: readonly Accent[] = ['sky'];

export function isAccentFree(accent: Accent): boolean {
  return FREE_ACCENTS.includes(accent);
}

/** Hex used purely for the settings swatch previews (500 shade). */
export const ACCENT_SWATCH: Record<Accent, string> = {
  sky: '#0ea5e9',
  emerald: '#10b981',
  violet: '#8b5cf6',
  rose: '#f43f5e',
};

const LS_THEME = 'eyeguard-theme';
const LS_ACCENT = 'eyeguard-accent';

export function loadTheme(): Theme {
  try {
    const v = localStorage.getItem(LS_THEME);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function loadAccent(): Accent {
  try {
    const v = localStorage.getItem(LS_ACCENT);
    if (v && (ACCENTS as readonly string[]).includes(v)) return v as Accent;
  } catch {
    /* ignore */
  }
  return 'sky';
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(LS_THEME, theme);
  } catch {
    /* ignore */
  }
}

export function storeAccent(accent: Accent): void {
  try {
    localStorage.setItem(LS_ACCENT, accent);
  } catch {
    /* ignore */
  }
}

/**
 * Reflect the current appearance onto <html>. `forceDark` keeps a surface dark
 * regardless of the user's theme (used by the fullscreen strict break overlay).
 */
export function applyAppearance(theme: Theme, accent: Accent, forceDark = false): void {
  const root = document.documentElement;
  root.dataset.theme = forceDark ? 'dark' : theme;
  root.dataset.accent = accent;
}
