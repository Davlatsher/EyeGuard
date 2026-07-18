import { create } from 'zustand';
import * as backend from '../lib/tauri';

export type TimerMode = '20-20-20' | 'pomodoro' | 'custom';
export type BreakMode = 'gentle' | 'strict' | 'camouflage';

interface BreakRecord {
  id: string;
  time: string;
  duration: number;
  completed: boolean;
  gamePlayed?: string;
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  '20-20-20': 20 * 60,
  pomodoro: 25 * 60,
  custom: 30 * 60,
};

interface EyeGuardState {
  // Timer
  isTimerRunning: boolean;
  timerMode: TimerMode;
  nextBreakIn: number;
  totalWorkTime: number;

  // Break settings
  breakMode: BreakMode;
  breakDuration: number;
  snoozeCount: number;
  maxSnooze: number;

  // Settings
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoStart: boolean;
  doNotDisturb: boolean;

  // Stats
  eyeHealthScore: number;
  todayBreaks: number;
  streak: number;
  totalBreaks: number;
  breakHistory: BreakRecord[];
  dailyStats: backend.DailyStat[];

  // Overlay
  isOverlayVisible: boolean;
  overlayContent: 'break' | 'game' | null;

  // Lifecycle
  hydrated: boolean;
  hydrate: () => Promise<void>;
  refreshStats: () => Promise<void>;

  // Actions
  setTimerMode: (mode: TimerMode) => void;
  setBreakMode: (mode: BreakMode) => void;
  setBreakDuration: (seconds: number) => void;
  toggleTimer: () => void;
  setNextBreakIn: (seconds: number) => void;
  decrementNextBreak: () => void;
  incrementBreaks: () => void;
  setEyeHealthScore: (score: number) => void;
  addBreakRecord: (record: BreakRecord) => void;
  showOverlay: (content: 'break' | 'game') => void;
  hideOverlay: () => void;
  toggleSetting: (key: 'soundEnabled' | 'notificationsEnabled' | 'autoStart' | 'doNotDisturb') => void;
  snooze: () => boolean;
  resetSnooze: () => void;
}

/** Build the backend settings payload from current state. */
function toBackendSettings(s: EyeGuardState): backend.BackendSettings {
  return {
    timer_mode: s.timerMode,
    break_mode: s.breakMode,
    break_duration: s.breakDuration,
    sound_enabled: s.soundEnabled,
    notifications_enabled: s.notificationsEnabled,
    auto_start: s.autoStart,
    do_not_disturb: s.doNotDisturb,
    max_snooze: s.maxSnooze,
  };
}

export const useStore = create<EyeGuardState>((set, get) => {
  // Fire-and-forget persistence of the whole settings object.
  const persistSettings = () => {
    void backend.updateSettings(toBackendSettings(get()));
  };

  return {
    // Timer defaults
    isTimerRunning: true,
    timerMode: '20-20-20',
    nextBreakIn: 20 * 60,
    totalWorkTime: 0,

    // Break defaults
    breakMode: 'gentle',
    breakDuration: 20,
    snoozeCount: 0,
    maxSnooze: 3,

    // Settings defaults
    soundEnabled: true,
    notificationsEnabled: true,
    autoStart: true,
    doNotDisturb: false,

    // Stats defaults (overwritten by hydrate when backend is present)
    eyeHealthScore: 75,
    todayBreaks: 0,
    streak: 0,
    totalBreaks: 0,
    breakHistory: [],
    dailyStats: [],

    // Overlay
    isOverlayVisible: false,
    overlayContent: null,

    hydrated: false,

    hydrate: async () => {
      const [settings, summary, history, status, daily] = await Promise.all([
        backend.getSettings(),
        backend.getStatsSummary(),
        backend.getBreakHistory(50),
        backend.getTimerStatus(),
        backend.getDailyStats(7),
      ]);

      const patch: Partial<EyeGuardState> = { hydrated: true };

      if (settings) {
        patch.timerMode = settings.timer_mode as TimerMode;
        patch.breakMode = settings.break_mode as BreakMode;
        patch.breakDuration = settings.break_duration;
        patch.soundEnabled = settings.sound_enabled;
        patch.notificationsEnabled = settings.notifications_enabled;
        patch.autoStart = settings.auto_start;
        patch.doNotDisturb = settings.do_not_disturb;
        patch.maxSnooze = settings.max_snooze;
      }
      if (summary) {
        patch.eyeHealthScore = summary.eye_health_score;
        patch.todayBreaks = summary.today_breaks;
        patch.totalBreaks = summary.total_breaks;
        patch.streak = summary.streak;
      }
      if (history) {
        patch.breakHistory = history.map((r) => ({
          id: String(r.id),
          time: new Date(r.timestamp + 'Z').toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: r.duration,
          completed: r.completed,
          gamePlayed: r.game_played ?? undefined,
        }));
      }
      if (status) {
        patch.isTimerRunning = status.is_running;
        patch.nextBreakIn = status.next_break_in;
      }
      if (daily) patch.dailyStats = daily;

      set(patch as EyeGuardState);
    },

    refreshStats: async () => {
      const [summary, history, daily] = await Promise.all([
        backend.getStatsSummary(),
        backend.getBreakHistory(50),
        backend.getDailyStats(7),
      ]);
      const patch: Partial<EyeGuardState> = {};
      if (daily) patch.dailyStats = daily;
      if (summary) {
        patch.eyeHealthScore = summary.eye_health_score;
        patch.todayBreaks = summary.today_breaks;
        patch.totalBreaks = summary.total_breaks;
        patch.streak = summary.streak;
      }
      if (history) {
        patch.breakHistory = history.map((r) => ({
          id: String(r.id),
          time: new Date(r.timestamp + 'Z').toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: r.duration,
          completed: r.completed,
          gamePlayed: r.game_played ?? undefined,
        }));
      }
      set(patch as EyeGuardState);
    },

    setTimerMode: (mode) => {
      set({ timerMode: mode, nextBreakIn: MODE_DURATIONS[mode] });
      void backend.setTimerMode(mode);
      persistSettings();
    },

    setBreakMode: (mode) => {
      set({ breakMode: mode });
      persistSettings();
    },

    setBreakDuration: (seconds) => {
      set({ breakDuration: seconds });
      persistSettings();
    },

    toggleTimer: () => {
      const running = !get().isTimerRunning;
      set({ isTimerRunning: running });
      if (running) void backend.startTimer();
      else void backend.stopTimer();
    },

    setNextBreakIn: (seconds) => set({ nextBreakIn: seconds }),

    decrementNextBreak: () =>
      set((state) => ({
        nextBreakIn: Math.max(0, state.nextBreakIn - 1),
        totalWorkTime: state.totalWorkTime + 1,
      })),

    incrementBreaks: () =>
      set((state) => ({
        todayBreaks: state.todayBreaks + 1,
        totalBreaks: state.totalBreaks + 1,
      })),

    setEyeHealthScore: (score) =>
      set({ eyeHealthScore: Math.min(100, Math.max(0, score)) }),

    addBreakRecord: (record) => {
      set((state) => ({ breakHistory: [record, ...state.breakHistory].slice(0, 50) }));
      // Persist to backend; refresh derived stats afterwards.
      void backend
        .saveBreakRecord(record.duration, record.completed, record.gamePlayed ?? null)
        .then(() => get().refreshStats());
    },

    showOverlay: (content) => set({ isOverlayVisible: true, overlayContent: content }),

    hideOverlay: () => set({ isOverlayVisible: false, overlayContent: null }),

    toggleSetting: (key) => {
      set((state) => ({ [key]: !state[key] }) as Partial<EyeGuardState>);
      persistSettings();
    },

    snooze: () => {
      const state = get();
      if (state.snoozeCount >= state.maxSnooze) return false;
      set({ snoozeCount: state.snoozeCount + 1, nextBreakIn: 5 * 60 });
      void backend.snoozeTimer(5 * 60);
      return true;
    },

    resetSnooze: () => set({ snoozeCount: 0 }),
  };
});
