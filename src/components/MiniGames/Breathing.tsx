import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

const TOTAL_CYCLES = 4;
const DURATIONS: Record<'inhale' | 'hold' | 'exhale', number> = {
  inhale: 4,
  hold: 4,
  exhale: 6,
};

export default function Breathing() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [timer, setTimer] = useState(0);
  const { incrementBreaks, addBreakRecord } = useStore();

  const labelFor = (p: 'inhale' | 'hold' | 'exhale') => t(`games.breathing.${p}`);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (stepRef.current) clearTimeout(stepRef.current);
  };

  // Clean up any running timers when the component unmounts.
  useEffect(() => clearTimers, []);

  const runPhase = (p: 'inhale' | 'hold' | 'exhale', currentCycle: number) => {
    setPhase(p);
    const seconds = DURATIONS[p];
    setTimer(seconds);

    clearTimers();
    tickRef.current = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    stepRef.current = setTimeout(() => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (p === 'inhale') {
        runPhase('hold', currentCycle);
      } else if (p === 'hold') {
        runPhase('exhale', currentCycle);
      } else {
        // finished one full cycle
        const next = currentCycle + 1;
        setCycle(next);
        if (next >= TOTAL_CYCLES) {
          finish();
        } else {
          runPhase('inhale', next);
        }
      }
    }, seconds * 1000);
  };

  const finish = () => {
    clearTimers();
    setPhase('complete');
    incrementBreaks();
    addBreakRecord({
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      duration: 60,
      completed: true,
      gamePlayed: 'Breathing',
    });
  };

  const start = () => {
    setCycle(0);
    runPhase('inhale', 0);
  };

  // Circle scales up on inhale, stays large on hold, shrinks on exhale.
  const circleScale = phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : phase === 'exhale' ? 0.7 : 1;
  const circleColor =
    phase === 'inhale'
      ? 'from-sky-400 to-indigo-500'
      : phase === 'hold'
        ? 'from-indigo-400 to-purple-500'
        : 'from-emerald-400 to-teal-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Wind className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t('games.breathing.title')}</h3>
            <p className="text-sm text-slate-400">{t('games.breathing.desc')}</p>
          </div>
        </div>
      </div>

      {/* Exercise Area */}
      <div className="relative h-80 bg-slate-950 flex items-center justify-center overflow-hidden">
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
                🌬️
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-xs mx-auto">
                {t('games.breathing.intro')}
              </p>
              <button
                onClick={start}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {t('common.start')}
              </button>
            </motion.div>
          )}

          {(phase === 'inhale' || phase === 'hold' || phase === 'exhale') && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="relative flex items-center justify-center mb-6" style={{ height: 160 }}>
                <motion.div
                  animate={{ scale: circleScale }}
                  transition={{ duration: DURATIONS[phase], ease: 'easeInOut' }}
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${circleColor} flex items-center justify-center shadow-2xl shadow-indigo-500/30`}
                >
                  <span className="text-3xl font-mono font-bold text-white">{timer}</span>
                </motion.div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">{labelFor(phase)}</p>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${i < cycle ? 'bg-indigo-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {t('games.breathing.cycleLabel', { current: cycle + 1, total: TOTAL_CYCLES })}
              </p>
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
                🧘
              </motion.div>
              <p className="text-2xl font-bold text-indigo-400 mb-2">{t('games.great')}</p>
              <p className="text-slate-400 mb-6">{t('games.breathing.result', { total: TOTAL_CYCLES })}</p>
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
