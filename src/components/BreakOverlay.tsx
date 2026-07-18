import { motion } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { useEffect, useRef, useState } from 'react';
import { resetTimer } from '../lib/tauri';

export default function BreakOverlay() {
  const { t } = useTranslation();
  const { breakMode, breakDuration, hideOverlay, addBreakRecord, resetSnooze, snooze, snoozeCount, maxSnooze } =
    useStore();
  const [timeLeft, setTimeLeft] = useState(breakDuration);
  const [showSnooze, setShowSnooze] = useState(true);
  const recorded = useRef(false);

  // Record the break exactly once, reset the backend countdown, then close.
  const finish = (completed: boolean) => {
    if (!recorded.current) {
      recorded.current = true;
      addBreakRecord({
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        duration: breakDuration,
        completed,
      });
      resetSnooze();
      void resetTimer();
    }
    hideOverlay();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSnooze = () => {
    const success = snooze();
    if (!success) {
      setShowSnooze(false);
    } else {
      // Snoozed: don’t count as a completed break.
      recorded.current = true;
      hideOverlay();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gentle mode
  if (breakMode === 'gentle') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 rounded-3xl p-8 border border-slate-700 max-w-md w-full mx-4 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            👁️
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('overlay.gentleTitle')}</h2>
          <p className="text-slate-400 mb-6">{t('overlay.gentleBody')}</p>

          <div className="text-5xl font-mono font-bold text-sky-400 mb-6">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3">
            {showSnooze && snoozeCount < maxSnooze && (
              <button
                onClick={handleSnooze}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                {t('overlay.snooze', { count: maxSnooze - snoozeCount })}
              </button>
            )}
            <button
              onClick={() => finish(true)}
              className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
            >
              {t('overlay.continue')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Strict mode
  if (breakMode === 'strict') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            😌
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('overlay.strictTitle')}</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">{t('overlay.strictBody')}</p>

          <div className="text-6xl font-mono font-bold text-sky-400 mb-8">
            {formatTime(timeLeft)}
          </div>

          <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-sky-500 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / breakDuration) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Camouflage mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-sky-500/30 shadow-lg shadow-sky-500/10"
      >
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-sky-400" />
          <div>
            <p className="text-sm text-white font-medium">{t('overlay.camouflageTitle')}</p>
            <p className="text-xs text-slate-400">{t('overlay.camouflageLeft', { time: formatTime(timeLeft) })}</p>
          </div>
          <button
            onClick={() => finish(false)}
            className="ml-2 p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
