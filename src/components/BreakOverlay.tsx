import { motion } from 'framer-motion';
import { X, Clock, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

export default function BreakOverlay() {
  const { breakMode, breakDuration, hideOverlay, snooze, snoozeCount, maxSnooze } = useStore();
  const [timeLeft, setTimeLeft] = useState(breakDuration);
  const [showSnooze, setShowSnooze] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          hideOverlay();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hideOverlay]);

  const handleSnooze = () => {
    const success = snooze();
    if (!success) {
      setShowSnooze(false);
    } else {
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
          <h2 className="text-2xl font-bold text-white mb-2">Ko'zni dam oldiring!</h2>
          <p className="text-slate-400 mb-6">
            20 soniya davomida 6 metr uzoqlikka qarang
          </p>

          <div className="text-5xl font-mono font-bold text-sky-400 mb-6">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3">
            {showSnooze && snoozeCount < maxSnooze && (
              <button
                onClick={handleSnooze}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                Kechiktirish ({maxSnooze - snoozeCount})
              </button>
            )}
            <button
              onClick={hideOverlay}
              className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
            >
              Davom etish
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
          <h2 className="text-3xl font-bold text-white mb-4">Dam olish vaqti!</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Ekran to'liq bloklangan. Ko'zlaringizni dam oldiring.
          </p>

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
            <p className="text-sm text-white font-medium">Ko'zni dam oldiring</p>
            <p className="text-xs text-slate-400">{formatTime(timeLeft)} qoldi</p>
          </div>
          <button
            onClick={hideOverlay}
            className="ml-2 p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
