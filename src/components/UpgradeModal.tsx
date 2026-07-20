import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, X, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { PRICING } from '../lib/pro';

export default function UpgradeModal() {
  const { t } = useTranslation();
  const { closeUpgrade, activateLicense } = useStore();
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const features = ['feat1', 'feat2', 'feat3', 'feat4', 'feat5'];

  const handleActivate = () => {
    const ok = activateLicense(key);
    if (!ok) setError(true);
    // On success the store closes the modal and flips isPro.
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeUpgrade}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 rounded-3xl border border-slate-700 max-w-md w-full p-8 overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={closeUpgrade}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5">
            <Crown className="w-8 h-8 text-white-fixed" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{t('pro.title')}</h2>
          <p className="text-slate-400 mb-6">{t('pro.subtitle')}</p>

          <ul className="space-y-2.5 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </span>
                {t(`pro.${f}`)}
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 mb-4 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-white">${PRICING.lifetimeUsd}</span>
              <span className="text-slate-500">
                / {PRICING.lifetimeUzs.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t('pro.lifetime')}</p>
          </div>

          {!showKeyInput ? (
            <div className="space-y-3">
              <button
                disabled
                title={t('pro.comingSoon')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white-fixed font-semibold opacity-60 cursor-not-allowed"
              >
                {t('pro.buy')} · {t('pro.comingSoon')}
              </button>
              <button
                onClick={() => setShowKeyInput(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <KeyRound size={16} />
                {t('pro.haveKey')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                autoFocus
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError(false);
                }}
                placeholder={t('pro.enterKey')}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none ${
                  error ? 'border-red-500/60' : 'border-slate-700 focus:border-sky-500/60'
                }`}
              />
              {error && <p className="text-xs text-red-400">{t('pro.invalidKey')}</p>}
              <button
                onClick={handleActivate}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white-fixed font-semibold transition-colors"
              >
                {t('pro.activate')}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
