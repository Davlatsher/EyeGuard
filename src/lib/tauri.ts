/**
 * Thin service layer over the Tauri v2 backend.
 *
 * Every call has a browser fallback so the UI still runs under `npm run dev`
 * in a plain browser (no Tauri runtime). When running inside the desktop app,
 * the Rust backend is the source of truth for the timer, settings and stats.
 */
import { invoke, isTauri as coreIsTauri } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export const isTauri = (): boolean => {
  try {
    return coreIsTauri();
  } catch {
    return false;
  }
};

// ---- Types mirrored from the Rust structs (serde snake_case) --------------

export interface BackendSettings {
  timer_mode: string;
  break_mode: string;
  break_duration: number;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  auto_start: boolean;
  do_not_disturb: boolean;
  max_snooze: number;
  custom_interval: number;
}

export interface BackendBreakRecord {
  id: number;
  timestamp: string;
  duration: number;
  completed: boolean;
  game_played: string | null;
  score: number | null;
}

export interface DailyStat {
  date: string;
  breaks: number;
  completed: number;
  score: number;
}

export interface StatsSummary {
  eye_health_score: number;
  today_breaks: number;
  total_breaks: number;
  streak: number;
}

export interface TimerStatus {
  is_running: boolean;
  next_break_in: number;
  interval: number;
}

// ---- Safe invoke helper ---------------------------------------------------

async function call<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<T>(cmd, args);
  } catch (err) {
    console.error(`invoke ${cmd} failed:`, err);
    return null;
  }
}

// ---- Timer ----------------------------------------------------------------

export const startTimer = (mode?: string) =>
  call<TimerStatus>('start_timer', { mode: mode ?? null });
export const stopTimer = () => call<TimerStatus>('stop_timer');
export const setTimerMode = (mode: string) => call<TimerStatus>('set_timer_mode', { mode });
export const setInterval = (seconds: number) => call<TimerStatus>('set_interval', { seconds });
export const resetTimer = () => call<TimerStatus>('reset_timer');
export const snoozeTimer = (seconds?: number) =>
  call<TimerStatus>('snooze_timer', { seconds: seconds ?? null });
export const getTimerStatus = () => call<TimerStatus>('get_timer_status');

// ---- Notifications & overlay ---------------------------------------------

export const showNotification = (title: string, body: string) =>
  call<void>('show_notification', { title, body });
export const createOverlayWindow = () => call<string>('create_overlay_window');
export const closeOverlayWindow = () => call<string>('close_overlay_window');

// ---- Data -----------------------------------------------------------------

export const getSettings = () => call<BackendSettings>('get_settings');
export const updateSettings = (settings: BackendSettings) =>
  call<string>('update_settings', { settings });
export const saveBreakRecord = (
  duration: number,
  completed: boolean,
  game?: string | null,
  score?: number | null,
) => call<number>('save_break_record', { duration, completed, game: game ?? null, score: score ?? null });
export const getBreakHistory = (limit = 50) =>
  call<BackendBreakRecord[]>('get_break_history', { limit });
export const getDailyStats = (days = 7) => call<DailyStat[]>('get_daily_stats', { days });
export const getStatsSummary = () => call<StatsSummary>('get_stats_summary');

// ---- Autostart (OS launch on login) --------------------------------------

export async function setAutoStart(on: boolean): Promise<void> {
  if (!isTauri()) return;
  try {
    const { enable, disable } = await import('@tauri-apps/plugin-autostart');
    if (on) await enable();
    else await disable();
  } catch (err) {
    console.error('setAutoStart failed:', err);
  }
}

// ---- Events ---------------------------------------------------------------

export async function onEvent<T>(
  name: string,
  handler: (payload: T) => void,
): Promise<UnlistenFn> {
  if (!isTauri()) return () => {};
  return listen<T>(name, (e) => handler(e.payload));
}
