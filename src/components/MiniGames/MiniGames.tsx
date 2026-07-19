import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, Eye, Focus, Palette, Wind, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { isGameFree } from '../../lib/pro';
import FollowDot from './FollowDot';
import BlinkTrainer from './BlinkTrainer';
import FocusShift from './FocusShift';
import ColorMatch from './ColorMatch';
import Breathing from './Breathing';

type GameType = 'menu' | 'followdot' | 'blink' | 'focus' | 'color' | 'breathing';
type GameId = 'followdot' | 'blink' | 'focus' | 'color' | 'breathing';

interface GameInfo {
  id: GameId;
  icon: React.ReactNode;
  color: string;
  seconds: number; // duration in seconds
}

const games: GameInfo[] = [
  { id: 'followdot', icon: <Target size={24} />, color: 'sky', seconds: 20 },
  { id: 'blink', icon: <Eye size={24} />, color: 'emerald', seconds: 30 },
  { id: 'focus', icon: <Focus size={24} />, color: 'amber', seconds: 20 },
  { id: 'color', icon: <Palette size={24} />, color: 'purple', seconds: 30 },
  { id: 'breathing', icon: <Wind size={24} />, color: 'indigo', seconds: 60 },
];

export default function MiniGames() {
  const { t } = useTranslation();
  const { isPro, openUpgrade } = useStore();
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  const openGame = (id: GameId) => {
    if (isGameFree(id) || isPro) setActiveGame(id);
    else openUpgrade();
  };

  const durationText = (seconds: number) =>
    seconds >= 60
      ? t('games.durationMinute', { count: Math.round(seconds / 60) })
      : t('games.durationSeconds', { count: seconds });

  if (activeGame !== 'menu') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveGame('menu')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span>{t('games.back')}</span>
        </button>

        <AnimatePresence mode="wait">
          {activeGame === 'followdot' && <FollowDot key="followdot" />}
          {activeGame === 'blink' && <BlinkTrainer key="blink" />}
          {activeGame === 'focus' && <FocusShift key="focus" />}
          {activeGame === 'color' && <ColorMatch key="color" />}
          {activeGame === 'breathing' && <Breathing key="breathing" />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">{t('games.title')}</h2>
        <p className="text-slate-400">{t('games.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openGame(game.id)}
            className="w-full text-left bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${game.color}-500/10 flex items-center justify-center text-${game.color}-400 group-hover:bg-${game.color}-500/20 transition-colors`}>
                {game.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {t(`games.${game.id}.title`)}
                    {!isGameFree(game.id) && !isPro && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <Lock size={10} /> {t('pro.badge')}
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                    {durationText(game.seconds)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{t(`games.${game.id}.desc`)}</p>
                <span className={`text-xs text-${game.color}-400`}>
                  ✅ {t(`games.${game.id}.benefits`)}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
