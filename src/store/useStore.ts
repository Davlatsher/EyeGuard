import { create } from 'zustand';

export type TimerMode = '20-20-20' | 'pomodoro' | 'custom';
export type BreakMode = 'gentle' | 'strict' | 'camouflage';

interface BreakRecord {
  id: string;
  time: string;
  duration: number;
  completed: boolean;
  gamePlayed?: string;
}

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

  // Overlay
  isOverlayVisible: boolean;
  overlayContent: 'break' | 'game' | null;

  // Actions
  setTimerMode: (mode: TimerMode) => void;
  setBreakMode: (mode: BreakMode) => void;
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

export const useStore = create<EyeGuardState>((set, get) => ({
  // Timer defaults
  isTimerRunning: true,
  timerMode: '20-20-20',
  nextBreakIn: 20 * 60, // 20 minutes
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

  // Stats defaults
  eyeHealthScore: 75,
  todayBreaks: 0,
  streak: 5,
  totalBreaks: 127,
  breakHistory: [
    { id: '1', time: '09:30', duration: 20, completed: true, gamePlayed: 'FollowDot' },
    { id: '2', time: '10:00', duration: 20, completed: true, gamePlayed: 'BlinkTrainer' },
    { id: '3', time: '10:30', duration: 15, completed: false },
    { id: '4', time: '11:00', duration: 20, completed: true, gamePlayed: 'FocusShift' },
  ],

  // Overlay
  isOverlayVisible: false,
  overlayContent: null,

  // Actions
  setTimerMode: (mode) => {
    const durations: Record<TimerMode, number> = {
      '20-20-20': 20 * 60,
      'pomodoro': 25 * 60,
      'custom': 30 * 60,
    };
    set({ timerMode: mode, nextBreakIn: durations[mode] });
  },

  setBreakMode: (mode) => set({ breakMode: mode }),

  toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),

  setNextBreakIn: (seconds) => set({ nextBreakIn: seconds }),

  decrementNextBreak: () => set((state) => ({
    nextBreakIn: Math.max(0, state.nextBreakIn - 1),
    totalWorkTime: state.totalWorkTime + 1,
  })),

  incrementBreaks: () => set((state) => ({
    todayBreaks: state.todayBreaks + 1,
    totalBreaks: state.totalBreaks + 1,
  })),

  setEyeHealthScore: (score) => set({ eyeHealthScore: Math.min(100, Math.max(0, score)) }),

  addBreakRecord: (record) => set((state) => ({
    breakHistory: [record, ...state.breakHistory].slice(0, 50),
  })),

  showOverlay: (content) => set({ isOverlayVisible: true, overlayContent: content }),

  hideOverlay: () => set({ isOverlayVisible: false, overlayContent: null }),

  toggleSetting: (key) => set((state) => ({ [key]: !state[key] } as Partial<EyeGuardState>)),

  snooze: () => {
    const state = get();
    if (state.snoozeCount >= state.maxSnooze) return false;
    set({ 
      snoozeCount: state.snoozeCount + 1,
      nextBreakIn: 5 * 60, // 5 minutes
    });
    return true;
  },

  resetSnooze: () => set({ snoozeCount: 0 }),
}));
