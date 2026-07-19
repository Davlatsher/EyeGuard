import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Settings, BarChart3, Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from './store/useStore';
import { isTauri, onEvent, createOverlayWindow } from './lib/tauri';
import { playChime } from './lib/sound';
import Dashboard from './components/Dashboard';
import TimerSettings from './components/TimerSettings';
import MiniGames from './components/MiniGames/MiniGames';
import Analytics from './components/Analytics';
import BreakOverlay from './components/BreakOverlay';
import UpgradeModal from './components/UpgradeModal';
import Onboarding, { isOnboarded } from './components/Onboarding';

type Tab = 'dashboard' | 'settings' | 'games' | 'analytics';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded());
  const { isTimerRunning, timerMode, nextBreakIn, isOverlayVisible, decrementNextBreak, upgradeOpen } =
    useStore();

  // On mount: hydrate from backend and subscribe to backend-driven events.
  useEffect(() => {
    const store = useStore.getState();
    void store.hydrate();

    if (!isTauri()) return;

    const unlisteners: Array<Promise<() => void>> = [
      onEvent<number>('timer-tick', (secs) => useStore.getState().setNextBreakIn(secs)),
      onEvent<void>('break-due', () => {
        const s = useStore.getState();
        if (s.soundEnabled) playChime();
        if (s.breakMode === 'strict') {
          // Strict: open a real fullscreen, always-on-top OS window.
          void createOverlayWindow();
        } else if (!s.isOverlayVisible) {
          s.showOverlay('break');
        }
      }),
      onEvent<void>('stats-updated', () => void useStore.getState().refreshStats()),
    ];

    return () => {
      unlisteners.forEach((p) => p.then((un) => un()));
    };
  }, []);

  // Browser-only fallback countdown (desktop app is driven by the Rust timer).
  useEffect(() => {
    if (isTauri()) return;
    if (!isTimerRunning || isOverlayVisible) return;

    const interval = setInterval(() => {
      const s = useStore.getState();
      if (s.nextBreakIn <= 1) {
        if (!s.isOverlayVisible) s.showOverlay('break');
      } else {
        decrementNextBreak();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isOverlayVisible, decrementNextBreak]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Break Overlay */}
      <AnimatePresence>
        {isOverlayVisible && <BreakOverlay />}
      </AnimatePresence>

      {/* First-launch onboarding */}
      <AnimatePresence>
        {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      {/* Pro upgrade / license modal */}
      <AnimatePresence>{upgradeOpen && <UpgradeModal />}</AnimatePresence>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Eye className="w-8 h-8 text-sky-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">EyeGuard</h1>
              <p className="text-xs text-slate-400">{t('header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer badge */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-1.5 border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm text-slate-300 font-mono">
                {Math.floor(nextBreakIn / 60).toString().padStart(2, '0')}:{(nextBreakIn % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:block">{timerMode}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto p-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'settings' && <TimerSettings />}
            {activeTab === 'games' && <MiniGames />}
            {activeTab === 'analytics' && <Analytics />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-6 py-2">
        <div className="flex justify-around max-w-lg mx-auto">
          <NavButton
            icon={<Eye size={20} />}
            label={t('nav.dashboard')}
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavButton
            icon={<Gamepad2 size={20} />}
            label={t('nav.games')}
            isActive={activeTab === 'games'}
            onClick={() => setActiveTab('games')}
          />
          <NavButton
            icon={<BarChart3 size={20} />}
            label={t('nav.analytics')}
            isActive={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          />
          <NavButton
            icon={<Settings size={20} />}
            label={t('nav.settings')}
            isActive={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'text-sky-400' 
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-sky-400/10 rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 text-xs font-medium">{label}</span>
    </button>
  );
}

export default App;
