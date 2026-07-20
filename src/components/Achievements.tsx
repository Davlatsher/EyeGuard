import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ACHIEVEMENTS, totalXp, levelFromXp } from '../lib/achievements';

function useGami() {
  const { totalBreaks, streak, todayBreaks, eyeHealthScore, unlockedAchievements } = useStore();
  const stats = {
    totalBreaks,
    streak,
    todayBreaks,
    health: eyeHealthScore,
    gamesPlayed: useStore.getState().playedGames.length,
  };
  const xp = totalXp(stats, unlockedAchievements);
  return { xp, level: levelFromXp(xp), unlocked: unlockedAchievements };
}

/** Compact level + XP card for the dashboard. */
export function LevelCard() {
  const { t } = useTranslation();
  const { level, xp, unlocked } = useGami();

  return (
    <motion.div
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/25 p-5"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-white-fixed">{level.level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-white">
              {t('gami.level')} {level.level}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {level.intoLevel} / {level.perLevel} {t('gami.xp')}
            </span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${level.pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {unlocked.length} / {ACHIEVEMENTS.length} · {xp} {t('gami.xp')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Full achievements grid for the analytics screen. */
export function AchievementsGrid() {
  const { t } = useTranslation();
  const { unlocked } = useGami();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
    >
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold text-white">{t('gami.achievements')}</h3>
        <span className="text-xs text-slate-500 ml-auto">
          {unlocked.length} / {ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const on = unlocked.includes(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-2xl p-3 border text-center transition-all ${
                on
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-800/50 border-slate-800 opacity-60'
              }`}
            >
              <div className={`text-3xl mb-1 ${on ? '' : 'grayscale opacity-50'}`}>{a.icon}</div>
              <div className={`text-xs font-semibold ${on ? 'text-white' : 'text-slate-500'}`}>
                {t(`gami.ach.${a.id}.title`)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{t(`gami.ach.${a.id}.desc`)}</div>
              <div className={`text-[10px] mt-1 font-mono ${on ? 'text-amber-400' : 'text-slate-600'}`}>
                +{a.xp} {t('gami.xp')}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
