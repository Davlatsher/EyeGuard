import { motion } from 'framer-motion';
import { Timer, Bell, Volume2, Moon, Sun, Shield, Sliders, Power, Globe, Crown, Lock, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore, TimerMode, BreakMode } from '../store/useStore';
import { setAutoStart } from '../lib/tauri';
import { SUPPORTED_LANGUAGES, setLang, type LangCode } from '../i18n';
import { isTimerModeFree, isBreakModeFree } from '../lib/pro';
import { ACCENTS, ACCENT_SWATCH, isAccentFree, type Accent } from '../lib/theme';

export default function TimerSettings() {
  const { t, i18n } = useTranslation();
  const {
    timerMode,
    breakMode,
    breakDuration,
    soundEnabled,
    notificationsEnabled,
    autoStart,
    doNotDisturb,
    customMinutes,
    setTimerMode,
    setBreakMode,
    setBreakDuration,
    setCustomMinutes,
    toggleSetting,
    isPro,
    licenseEmail,
    openUpgrade,
    deactivateLicense,
    theme,
    accent,
    setTheme,
    setAccent,
  } = useStore();

  const pickTimerMode = (mode: TimerMode) => {
    if (isTimerModeFree(mode) || isPro) setTimerMode(mode);
    else openUpgrade();
  };
  const pickBreakMode = (mode: BreakMode) => {
    if (isBreakModeFree(mode) || isPro) setBreakMode(mode);
    else openUpgrade();
  };

  const modes: { id: TimerMode; label: string; desc: string; time: string }[] = [
    { id: '20-20-20', label: '20-20-20', desc: t('settings.mode2020Desc'), time: '20 min' },
    { id: 'pomodoro', label: t('timerModes.pomodoro'), desc: t('settings.modePomodoroDesc'), time: '25 min' },
    { id: 'custom', label: t('timerModes.custom'), desc: t('settings.modeCustomDesc'), time: `${customMinutes} min` },
  ];

  const breakModes: { id: BreakMode; label: string; desc: string; color: string }[] = [
    { id: 'gentle', label: t('breakModes.gentle'), desc: t('settings.gentleDesc'), color: 'emerald' },
    { id: 'strict', label: t('breakModes.strict'), desc: t('settings.strictDesc'), color: 'red' },
    { id: 'camouflage', label: t('breakModes.camouflage'), desc: t('settings.camouflageDesc'), color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">{t('settings.title')}</h2>
        <p className="text-slate-400">{t('settings.subtitle')}</p>
      </div>

      {/* Pro / License */}
      {isPro ? (
        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white-fixed" />
            </div>
            <div>
              <div className="font-semibold text-amber-300">{t('pro.proMember')}</div>
              <div className="text-xs text-slate-400">{licenseEmail}</div>
            </div>
          </div>
          <button
            onClick={deactivateLicense}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            {t('pro.deactivate')}
          </button>
        </div>
      ) : (
        <button
          onClick={openUpgrade}
          className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white-fixed" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">{t('pro.upgrade')}</div>
              <div className="text-xs text-slate-400">{t('pro.subtitle')}</div>
            </div>
          </div>
          <span className="text-amber-400 text-sm font-semibold">→</span>
        </button>
      )}

      {/* Language */}
      <Section icon={<Globe className="w-5 h-5" />} title={t('settings.language')}>
        <div className="grid grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLang(lang.code as LangCode)}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                i18n.language === lang.code
                  ? 'bg-sky-500/10 border-sky-500/50 text-sky-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={<Palette className="w-5 h-5" />} title={t('settings.appearance')}>
        {/* Theme (light / dark) — free */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { id: 'dark', label: t('settings.themeDark'), icon: <Moon size={18} /> },
            { id: 'light', label: t('settings.themeLight'), icon: <Sun size={18} /> },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                theme === opt.id
                  ? 'bg-sky-500/10 border-sky-500/50 text-sky-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              {opt.icon}
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Accent color — default is free, the rest are Pro */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300">{t('settings.accentColor')}</span>
            {!isPro && <span className="text-xs text-amber-400 flex items-center gap-1"><Crown size={12} /> Pro</span>}
          </div>
          <div className="flex items-center gap-3">
            {ACCENTS.map((a: Accent) => {
              const active = accent === a;
              const locked = !isAccentFree(a) && !isPro;
              return (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  aria-label={a}
                  title={t(`settings.accent.${a}`)}
                  className={`relative w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                    active ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-100' : ''
                  }`}
                  style={{ backgroundColor: ACCENT_SWATCH[a] }}
                >
                  {locked && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/40">
                      <Lock size={14} className="text-white-fixed" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Timer Mode */}
      <Section icon={<Timer className="w-5 h-5" />} title={t('settings.timerMode')}>
        <div className="space-y-3">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => pickTimerMode(mode.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                timerMode === mode.id
                  ? 'bg-sky-500/10 border-sky-500/50'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  timerMode === mode.id ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  <Timer size={20} />
                </div>
                <div className="text-left">
                  <div className={`font-semibold flex items-center gap-2 ${timerMode === mode.id ? 'text-sky-400' : 'text-white'}`}>
                    {mode.label}
                    {!isTimerModeFree(mode.id) && !isPro && <Lock size={12} className="text-amber-400" />}
                  </div>
                  <div className="text-sm text-slate-500">{mode.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-mono ${timerMode === mode.id ? 'text-sky-400' : 'text-slate-500'}`}>
                  {mode.time}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Custom interval slider (only for the custom mode) */}
        {timerMode === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mt-3"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300">{t('settings.customInterval')}</span>
              <span className="text-sky-400 font-mono font-bold">
                {customMinutes} {t('common.minute')}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>5 min</span>
              <span>60 min</span>
            </div>
          </motion.div>
        )}
      </Section>

      {/* Break Mode */}
      <Section icon={<Shield className="w-5 h-5" />} title={t('settings.breakMode')}>
        <div className="space-y-3">
          {breakModes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => pickBreakMode(mode.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                breakMode === mode.id
                  ? `bg-${mode.color}-500/10 border-${mode.color}-500/50`
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  breakMode === mode.id ? `bg-${mode.color}-500/20 text-${mode.color}-400` : 'bg-slate-700 text-slate-400'
                }`}>
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <div className={`font-semibold flex items-center gap-2 ${breakMode === mode.id ? `text-${mode.color}-400` : 'text-white'}`}>
                    {mode.label}
                    {!isBreakModeFree(mode.id) && !isPro && <Lock size={12} className="text-amber-400" />}
                  </div>
                  <div className="text-sm text-slate-500">{mode.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* General Settings */}
      <Section icon={<Sliders className="w-5 h-5" />} title={t('settings.general')}>
        <div className="space-y-2">
          <ToggleSetting
            icon={<Bell size={18} />}
            label={t('settings.notifications')}
            desc={t('settings.notificationsDesc')}
            enabled={notificationsEnabled}
            onToggle={() => toggleSetting('notificationsEnabled')}
          />
          <ToggleSetting
            icon={<Volume2 size={18} />}
            label={t('settings.sound')}
            desc={t('settings.soundDesc')}
            enabled={soundEnabled}
            onToggle={() => toggleSetting('soundEnabled')}
          />
          <ToggleSetting
            icon={<Moon size={18} />}
            label={t('settings.dnd')}
            desc={t('settings.dndDesc')}
            enabled={doNotDisturb}
            onToggle={() => toggleSetting('doNotDisturb')}
          />
          <ToggleSetting
            icon={<Power size={18} />}
            label={t('settings.autostart')}
            desc={t('settings.autostartDesc')}
            enabled={autoStart}
            onToggle={() => {
              void setAutoStart(!autoStart);
              toggleSetting('autoStart');
            }}
          />
        </div>
      </Section>

      {/* Break Duration */}
      <Section icon={<Timer className="w-5 h-5" />} title={t('settings.breakDuration')}>
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300">{t('settings.duration')}</span>
            <span className="text-sky-400 font-mono font-bold">
              {breakDuration} {t('common.seconds')}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>10s</span>
            <span>60s</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function ToggleSetting({ 
  icon, label, desc, enabled, onToggle 
}: { 
  icon: React.ReactNode; 
  label: string; 
  desc: string; 
  enabled: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>
        <div>
          <div className="text-white font-medium">{label}</div>
          <div className="text-sm text-slate-500">{desc}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-sky-500' : 'bg-slate-600'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}
