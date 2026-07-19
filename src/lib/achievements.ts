/**
 * Gamification: achievements, XP and levels.
 *
 * Achievements unlock from the user's stats (breaks, streak, games, health).
 * XP = 10 per break + the XP of every unlocked achievement. Level is derived
 * from total XP. Everything is computed from stats, so it stays consistent
 * whether stats come from the backend DB or the in-browser fallback.
 */

export interface GamiStats {
  totalBreaks: number;
  streak: number;
  todayBreaks: number;
  health: number;
  gamesPlayed: number; // distinct games ever played
}

export interface Achievement {
  id: string;
  icon: string; // emoji
  xp: number;
  check: (s: GamiStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_break', icon: '🎯', xp: 50, check: (s) => s.totalBreaks >= 1 },
  { id: 'breaks_10', icon: '⭐', xp: 100, check: (s) => s.totalBreaks >= 10 },
  { id: 'breaks_50', icon: '🌟', xp: 200, check: (s) => s.totalBreaks >= 50 },
  { id: 'breaks_100', icon: '💯', xp: 400, check: (s) => s.totalBreaks >= 100 },
  { id: 'daily_5', icon: '⚡', xp: 80, check: (s) => s.todayBreaks >= 5 },
  { id: 'streak_3', icon: '🔥', xp: 100, check: (s) => s.streak >= 3 },
  { id: 'streak_7', icon: '🚀', xp: 250, check: (s) => s.streak >= 7 },
  { id: 'streak_30', icon: '👑', xp: 1000, check: (s) => s.streak >= 30 },
  { id: 'all_games', icon: '🎮', xp: 300, check: (s) => s.gamesPlayed >= 5 },
  { id: 'health_90', icon: '💚', xp: 150, check: (s) => s.health >= 90 },
];

const XP_PER_BREAK = 10;
const XP_PER_LEVEL = 500;

/** IDs of all achievements currently satisfied by the given stats. */
export function evaluateUnlocked(stats: GamiStats): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.id);
}

/** Total XP from breaks plus unlocked achievements. */
export function totalXp(stats: GamiStats, unlockedIds: string[]): number {
  const achXp = ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id)).reduce(
    (sum, a) => sum + a.xp,
    0,
  );
  return stats.totalBreaks * XP_PER_BREAK + achXp;
}

export interface LevelInfo {
  level: number;
  intoLevel: number; // XP earned within the current level
  perLevel: number; // XP needed per level
  pct: number; // progress to next level, 0..100
}

export function levelFromXp(xp: number): LevelInfo {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  return { level, intoLevel, perLevel: XP_PER_LEVEL, pct: (intoLevel / XP_PER_LEVEL) * 100 };
}
