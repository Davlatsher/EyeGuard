/**
 * Freemium feature boundaries (Free vs Pro).
 *
 * Free tier: 20-20-20 timer, gentle break mode, 2 games, 7-day stats.
 * Pro tier: everything.
 */
export const FREE_TIMER_MODES = ['20-20-20'] as const;
export const FREE_BREAK_MODES = ['gentle'] as const;
export const FREE_GAMES = ['followdot', 'blink'] as const;

export const FREE_STATS_DAYS = 7;
export const PRO_STATS_DAYS = 30;

export function isTimerModeFree(mode: string): boolean {
  return (FREE_TIMER_MODES as readonly string[]).includes(mode);
}
export function isBreakModeFree(mode: string): boolean {
  return (FREE_BREAK_MODES as readonly string[]).includes(mode);
}
export function isGameFree(id: string): boolean {
  return (FREE_GAMES as readonly string[]).includes(id);
}

/** Pricing shown in the upgrade dialog (from the sales strategy). */
export const PRICING = {
  lifetimeUsd: 14.99,
  lifetimeUzs: 99000,
};
