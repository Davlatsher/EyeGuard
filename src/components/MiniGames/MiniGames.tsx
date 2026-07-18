import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, Eye, Focus, Palette, Wind } from 'lucide-react';
import FollowDot from './FollowDot';
import BlinkTrainer from './BlinkTrainer';
import FocusShift from './FocusShift';

type GameType = 'menu' | 'followdot' | 'blink' | 'focus' | 'color' | 'breathing';

interface GameInfo {
  id: GameType;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  benefits: string;
}

const games: GameInfo[] = [
  {
    id: 'followdot',
    title: 'Nuqtani Kuzat',
    desc: 'Ekranda harakatlanuvchi nuqtani kuzatib ko’z mushaklaringizni mashq qiling',
    icon: <Target size={24} />,
    color: 'sky',
    duration: '20 soniya',
    benefits: 'Ko’z mushaklari',
  },
  {
    id: 'blink',
    title: 'Ko’z Yumish',
    desc: 'Animatsiya bilan ko’zni yumish-ch yumish mashqi',
    icon: <Eye size={24} />,
    color: 'emerald',
    duration: '30 soniya',
    benefits: 'Ko’z namligi',
  },
  {
    id: 'focus',
    title: 'Fokus Almashtirish',
    desc: 'Yaqin va uzoq nuqtalar o’rtasida fokusni o’zgartiring',
    icon: <Focus size={24} />,
    color: 'amber',
    duration: '20 soniya',
    benefits: 'Akkomodatsiya',
  },
  {
    id: 'color',
    title: 'Rang Tanish',
    desc: 'Ranglarni eslab qolish va tanish orqali ko’zni dam oldiring',
    icon: <Palette size={24} />,
    color: 'purple',
    duration: '30 soniya',
    benefits: 'Ko’z dam olish',
  },
  {
    id: 'breathing',
    title: 'Nafas Olish',
    desc: 'Nafas olish bilan birga ko’zni yumish mashqi',
    icon: <Wind size={24} />,
    color: 'indigo',
    duration: '1 daqiqa',
    benefits: 'Umumiy dam olish',
  },
];

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  if (activeGame !== 'menu') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveGame('menu')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span>O’yinlarga qaytish</span>
        </button>

        <AnimatePresence mode="wait">
          {activeGame === 'followdot' && <FollowDot key="followdot" />}
          {activeGame === 'blink' && <BlinkTrainer key="blink" />}
          {activeGame === 'focus' && <FocusShift key="focus" />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Ko’z Mashqlari</h2>
        <p className="text-slate-400">Ko’zlaringizni dam oldirish uchun o’yinlar</p>
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
            onClick={() => setActiveGame(game.id)}
            className="w-full text-left bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${game.color}-500/10 flex items-center justify-center text-${game.color}-400 group-hover:bg-${game.color}-500/20 transition-colors`}>
                {game.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{game.title}</h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                    {game.duration}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{game.desc}</p>
                <span className={`text-xs text-${game.color}-400`}>
                  ✅ {game.benefits}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
