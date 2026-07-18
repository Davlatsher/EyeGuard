import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

export default function BlinkTrainer() {
  const [phase, setPhase] = useState<'idle' | 'open' | 'close' | 'complete'>('idle');
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const { t } = useTranslation();
  const { incrementBreaks, addBreakRecord } = useStore();

  const startExercise = () => {
    setPhase('open');
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
        duration: 30,
        completed: true,
        gamePlayed: 'BlinkTrainer',
      });
      return;
    }

    setPhase('open');
    setTimer(2);

    const openTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(openTimer);
          setPhase('close');
          setTimer(2);

          const closeTimer = setInterval(() => {
            setTimer((prev2) => {
              if (prev2 <= 1) {
                clearInterval(closeTimer);
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t('games.blink.header')}</h3>
            <p className="text-sm text-slate-400">{t('games.blink.headerDesc')}</p>
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
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                😌
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-xs mx-auto">
                {t('games.blink.intro')}
              </p>
              <button 
                onClick={startExercise}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {t('common.start')}
              </button>
            </motion.div>
          )}

          {phase === 'open' && (
            <motion.div 
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                👁️
              </motion.div>
              <p className="text-2xl font-bold text-white mb-2">{t('games.blink.open')}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold text-emerald-400">{timer}</span>
                <span className="text-slate-500">{t('common.seconds')}</span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < count ? 'bg-emerald-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'close' && (
            <motion.div 
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                😌
              </motion.div>
              <p className="text-2xl font-bold text-white mb-2">{t('games.blink.close')}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold text-emerald-400">{timer}</span>
                <span className="text-slate-500">{t('common.seconds')}</span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < count ? 'bg-emerald-400' : 'bg-slate-700'}`}
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
              <p className="text-2xl font-bold text-emerald-400 mb-2">{t('games.great')}</p>
              <p className="text-slate-400 mb-6">{t('games.blink.result')}</p>
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
