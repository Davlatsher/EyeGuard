import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

const TOTAL_ROUNDS = 6;

/** Grid size and colour-difference per round (harder = smaller diff, bigger grid). */
function roundConfig(round: number): { grid: number; diff: number } {
  if (round < 2) return { grid: 2, diff: 18 };
  if (round < 4) return { grid: 3, diff: 12 };
  return { grid: 4, diff: 7 };
}

// Deterministic pseudo-random from a seed so we don't need Math.random in render.
function makeRound(round: number, seed: number) {
  const { grid, diff } = roundConfig(round);
  const tiles = grid * grid;
  const hue = (seed * 47 + round * 71) % 360;
  const baseL = 55;
  const base = `hsl(${hue}, 60%, ${baseL}%)`;
  const odd = `hsl(${hue}, 60%, ${baseL - diff}%)`;
  const oddIndex = (seed * 13 + round * 29) % tiles;
  return { grid, tiles, base, odd, oddIndex };
}

export default function ColorMatch() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [round, setRound] = useState(0);
  const [seed, setSeed] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const { t } = useTranslation();
  const { incrementBreaks, addBreakRecord } = useStore();

  const current = makeRound(round, seed);

  const start = () => {
    setRound(0);
    setSeed(2);
    setScore(0);
    setWrongTile(null);
    setPhase('playing');
  };

  const finish = () => {
    setPhase('complete');
    incrementBreaks();
    addBreakRecord({
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      duration: 30,
      completed: true,
      gamePlayed: 'ColorMatch',
    });
  };

  const handleTile = (index: number) => {
    if (index === current.oddIndex) {
      setScore((s) => s + 1);
      setWrongTile(null);
      const next = round + 1;
      if (next >= TOTAL_ROUNDS) {
        finish();
      } else {
        setRound(next);
        setSeed((s) => s + 3);
      }
    } else {
      // Gentle feedback, no fail state.
      setWrongTile(index);
      setTimeout(() => setWrongTile((w) => (w === index ? null : w)), 400);
    }
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
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t('games.color.title')}</h3>
            <p className="text-sm text-slate-400">{t('games.color.desc')}</p>
          </div>
        </div>
      </div>

      {/* Exercise Area */}
      <div className="relative h-80 bg-slate-950 flex items-center justify-center p-6">
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
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🎨
              </motion.div>
              <p className="text-slate-400 mb-6 max-w-xs mx-auto">
                {t('games.color.intro')}
              </p>
              <button
                onClick={start}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {t('common.start')}
              </button>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div
              key={`round-${round}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs"
            >
              <div
                className="grid gap-2 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${current.grid}, minmax(0, 1fr))`,
                  maxWidth: 260,
                }}
              >
                {Array.from({ length: current.tiles }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleTile(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={wrongTile === i ? { x: [0, -6, 6, -6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="aspect-square rounded-lg"
                    style={{ backgroundColor: i === current.oddIndex ? current.odd : current.base }}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < round ? 'bg-purple-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-slate-500 mt-3">
                {t('games.color.roundLabel', { current: round + 1, total: TOTAL_ROUNDS })}
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
                🎉
              </motion.div>
              <p className="text-2xl font-bold text-purple-400 mb-2">{t('games.great')}</p>
              <p className="text-slate-400 mb-1">
                {t('games.color.resultFirst', { score, total: TOTAL_ROUNDS })}
              </p>
              <p className="text-slate-500 text-sm mb-6">{t('games.color.resultRest')}</p>
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
