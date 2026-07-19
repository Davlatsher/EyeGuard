import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ACHIEVEMENTS } from '../lib/achievements';
import { playChime } from '../lib/sound';

/** Transient banner shown when a new achievement unlocks. */
export default function AchievementToast() {
  const { t } = useTranslation();
  const { achievementToast, clearAchievementToast, soundEnabled } = useStore();

  useEffect(() => {
    if (!achievementToast) return;
    if (soundEnabled) playChime();
    const id = setTimeout(clearAchievementToast, 4000);
    return () => clearTimeout(id);
  }, [achievementToast, clearAchievementToast, soundEnabled]);

  if (!achievementToast) return null;
  const ach = ACHIEVEMENTS.find((a) => a.id === achievementToast);
  if (!ach) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.9 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[80]"
    >
      <div className="flex items-center gap-3 bg-slate-900 border border-amber-500/40 rounded-2xl pl-3 pr-5 py-3 shadow-xl shadow-amber-500/10">
        <div className="text-3xl">{ach.icon}</div>
        <div>
          <div className="text-xs text-amber-400 font-semibold">{t('gami.unlocked')}</div>
          <div className="text-sm font-bold text-white">{t(`gami.ach.${ach.id}.title`)}</div>
        </div>
        <div className="text-xs font-mono text-amber-400 ml-2">+{ach.xp} {t('gami.xp')}</div>
      </div>
    </motion.div>
  );
}
