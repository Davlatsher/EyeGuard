import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Focus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

export default function FocusShift() {
  const [phase, setPhase] = useState<'idle' | 'near' | 'far' | 'complete'>('idle');
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const { t } = useTranslation();
  const { incrementBreaks, addBreakRecord } = useStore();

  const startExercise = () => {
    setPhase('near');
    setCount(0);
    runCycle(0);
  };

  const runCycle = (currentCount: number) => {
    if (currentCount >= 10) {
      setPhase('complete');
      incrementBreaks();
      addBreakRecord({
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        duration: 20,
        completed: true,
        gamePlayed: 'FocusShift',
      });
      return;
    }

    setPhase('near');
    setTimer(2);

    const nearTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(nearTimer);
          setPhase('far');
          setTimer(2);

          const farTimer = setInterval(() => {
            setTimer((prev2) => {
              if (prev2 <= 1) {
                clearInterval(farTimer);
                setCount(currentCount + 1);
                runCycle(currentCount + 1);
                return 0;
              }
              return prev2 - 1;
            });
          }, 1000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Focus className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t('games.focus.title')}</h3>
            <p className="text-sm text-slate-400">{t('games.focus.desc')}</p>
          </div>
        </div>
      </div>

      {/* Exercise Area */}
      <div className="relative h-80 bg-slate-950 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🔍
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-xs mx-auto">
                {t('games.focus.intro')}
              </p>
              <button 
                onClick={startExercise}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {t('common.start')}
              </button>
            </motion.div>
          )}

          {phase === 'near' && (
            <motion.div 
              key="near"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="relative mb-4"
              >
                <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-4xl font-bold text-white">YA</span>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-amber-400 text-sm font-medium"
                >
                  {t('games.focus.nearLabel')}
                </motion.div>
              </motion.div>
              <p className="text-xl font-bold text-white mb-2">{t('games.focus.near')}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold text-amber-400">{timer}</span>
                <span className="text-slate-500">{t('common.seconds')}</span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < count ? 'bg-amber-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'far' && (
            <motion.div 
              key="far"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="relative mb-4"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <span className="text-xl font-bold text-white">UZ</span>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sky-400 text-sm font-medium"
                >
                  {t('games.focus.farLabel')}
                </motion.div>
              </motion.div>
              <p className="text-xl font-bold text-white mb-2">{t('games.focus.far')}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold text-sky-400">{timer}</span>
                <span className="text-slate-500">{t('common.seconds')}</span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < count ? 'bg-sky-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <p className="text-2xl font-bold text-amber-400 mb-2">{t('games.great')}</p>
              <p className="text-slate-400 mb-6">{t('games.focus.result')}</p>
              <button 
                onClick={() => setPhase('idle')}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                <RotateCcw size={16} />
                {t('common.restart')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
