import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getSettings, saveBreakRecord, resetTimer, closeOverlayWindow } from './lib/tauri';

/**
 * Standalone view rendered inside the real OS overlay window (label "overlay",
 * loaded with ?overlay=1). Fullscreen, always-on-top strict break: counts down
 * the break duration, records it, resets the backend timer, then closes itself.
 */
export default function OverlayView() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [duration, setDuration] = useState(20);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    void saveBreakRecord(duration, true, null).then(() => resetTimer());
    void closeOverlayWindow();
  };

  // Load the configured break duration, then run the countdown.
  useEffect(() => {
    let cancelled = false;
    getSettings().then((s) => {
      if (cancelled) return;
      const d = s?.break_duration ?? 20;
      setDuration(d);
      setTimeLeft(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const id = setTimeout(() => setTimeLeft((v) => (v === null ? null : v - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const shown = timeLeft ?? duration;
  const pct = duration > 0 ? (shown / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center select-none">
      <div className="text-center px-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          😌
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-3">{t('overlay.strictTitle')}</h1>
        <p className="text-slate-400 mb-10 max-w-md mx-auto">{t('overlay.strictBody')}</p>

        <div className="text-7xl font-mono font-bold text-sky-400 mb-10">
          {String(Math.floor(shown / 60)).padStart(2, '0')}:{String(shown % 60).padStart(2, '0')}
        </div>

        <div className="w-72 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-sky-500 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${pct}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
