import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShieldCheck, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'eyeguard_onboarded';

/** Returns true if the user has already seen (or skipped) the onboarding. */
export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // localStorage may be unavailable (private mode / SSR) — treat as onboarded
    // so we never block the app on a storage error.
    return true;
  }
}

function markOnboarded() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore — worst case the intro shows again next launch */
  }
}

const STEP_ICONS = [Eye, ShieldCheck, BarChart3];
const TOTAL_STEPS = 3;

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const finish = () => {
    markOnboarded();
    onDone();
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else finish();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const Icon = STEP_ICONS[step];
  const isLast = step === TOTAL_STEPS - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6"
    >
      {/* Animated background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Skip */}
        <div className="flex justify-end mb-4">
          <button
            onClick={finish}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            {t('onboarding.skip')}
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-sky-400/10 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon className="w-10 h-10 text-sky-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-3">
                {t(`onboarding.step${step + 1}.title`)}
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {t(`onboarding.step${step + 1}.body`)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-8 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-sky-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={back}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
              >
                {t('onboarding.back')}
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
            >
              {isLast ? t('onboarding.start') : t('onboarding.next')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
