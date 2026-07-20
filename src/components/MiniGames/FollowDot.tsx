import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function FollowDot() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const { t } = useTranslation();
  const { incrementBreaks, addBreakRecord } = useStore();

  const generateDot = useCallback(() => {
    const newDot: Dot = {
      id: Date.now(),
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25,
      size: Math.random() * 16 + 32,
    };
    setDots([newDot]);
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(20);
    generateDot();
  };

  const handleDotClick = () => {
    setScore((prev) => prev + 1);
    generateDot();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setDots([]);
          setBestScore((prev) => Math.max(prev, score + 1));
          incrementBreaks();
          addBreakRecord({
            id: Date.now().toString(),
            time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            duration: 20,
            completed: true,
            gamePlayed: 'FollowDot',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score, incrementBreaks, addBreakRecord]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">{t('games.followdot.title')}</h3>
              <p className="text-sm text-slate-400">{t('games.followdot.header')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-xs text-slate-500">ball</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-80 bg-slate-950">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                👁️
              </motion.div>
              <p className="text-slate-400 mb-2 text-center px-8">
                {t('games.followdot.intro')}
              </p>
              {bestScore > 0 && (
                <div className="flex items-center gap-2 text-amber-400 mb-4">
                  <Trophy size={16} />
                  <span className="text-sm">{t('games.followdot.best', { score: bestScore })}</span>
                </div>
              )}
              <button 
                onClick={startGame}
                className="bg-sky-500 hover:bg-sky-600 text-white-fixed px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {t('common.start')}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Timer */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-slate-800/80 backdrop-blur rounded-full px-4 py-2 border border-slate-700">
                  <span className="text-slate-300 font-mono font-bold">{timeLeft}s</span>
                </div>
              </div>

              {/* Score */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-sky-500/10 backdrop-blur rounded-full px-4 py-2 border border-sky-500/30">
                  <span className="text-sky-400 font-bold">{score}</span>
                </div>
              </div>

              {/* Dots */}
              <AnimatePresence>
                {dots.map((dot) => (
                  <motion.button
                    key={dot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={handleDotClick}
                    className="absolute rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/30 cursor-pointer"
                    style={{
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      width: dot.size,
                      height: dot.size,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-sky-400/30"
                    />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      {!isPlaying && score > 0 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 border-t border-slate-800"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold text-emerald-400 mb-1">{t('games.great')}</p>
            <p className="text-slate-400 mb-4">{t('games.followdot.result', { score })}</p>
            <button 
              onClick={startGame}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              <RotateCcw size={16} />
              {t('common.restart')}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
