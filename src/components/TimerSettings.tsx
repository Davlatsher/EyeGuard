import { motion } from 'framer-motion';
import { Timer, Bell, Volume2, Moon, Shield, Sliders, Power } from 'lucide-react';
import { useStore, TimerMode, BreakMode } from '../store/useStore';
import { setAutoStart } from '../lib/tauri';

export default function TimerSettings() {
  const {
    timerMode,
    breakMode,
    breakDuration,
    soundEnabled,
    notificationsEnabled,
    autoStart,
    doNotDisturb,
    setTimerMode,
    setBreakMode,
    toggleSetting,
  } = useStore();

  const modes: { id: TimerMode; label: string; desc: string; time: string }[] = [
    { id: '20-20-20', label: '20-20-20', desc: 'Har 20 daqiqada 20 soniya', time: '20 min' },
    { id: 'pomodoro', label: 'Pomodoro', desc: '25 min ishlash, 5 min dam', time: '25 min' },
    { id: 'custom', label: 'Custom', desc: 'O’zingiz sozlang', time: '30 min' },
  ];

  const breakModes: { id: BreakMode; label: string; desc: string; color: string }[] = [
    { id: 'gentle', label: 'Yumshoq', desc: 'Ogohlantirish + xira ekran', color: 'emerald' },
    { id: 'strict', label: 'Qat’iy', desc: 'Ekran to’liq bloklanadi', color: 'red' },
    { id: 'camouflage', label: 'Kamuflyaj', desc: 'Shaffof overlay', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Sozlamalar</h2>
        <p className="text-slate-400">Ilovani o’zingizga moslang</p>
      </div>

      {/* Timer Mode */}
      <Section icon={<Timer className="w-5 h-5" />} title="Timer rejimi">
        <div className="space-y-3">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTimerMode(mode.id)}
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
                  <div className={`font-semibold ${timerMode === mode.id ? 'text-sky-400' : 'text-white'}`}>
                    {mode.label}
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
      </Section>

      {/* Break Mode */}
      <Section icon={<Shield className="w-5 h-5" />} title="Break rejimi">
        <div className="space-y-3">
          {breakModes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setBreakMode(mode.id)}
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
                  <div className={`font-semibold ${breakMode === mode.id ? `text-${mode.color}-400` : 'text-white'}`}>
                    {mode.label}
                  </div>
                  <div className="text-sm text-slate-500">{mode.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* General Settings */}
      <Section icon={<Sliders className="w-5 h-5" />} title="Umumiy sozlamalar">
        <div className="space-y-2">
          <ToggleSetting
            icon={<Bell size={18} />}
            label="Bildirishnomalar"
            desc="Windows toast notification"
            enabled={notificationsEnabled}
            onToggle={() => toggleSetting('notificationsEnabled')}
          />
          <ToggleSetting
            icon={<Volume2 size={18} />}
            label="Tovush"
            desc="Ogohlantirish tovushlari"
            enabled={soundEnabled}
            onToggle={() => toggleSetting('soundEnabled')}
          />
          <ToggleSetting
            icon={<Moon size={18} />}
            label="Do Not Disturb"
            desc="Barcha ogohlantirishlarni o’chirish"
            enabled={doNotDisturb}
            onToggle={() => toggleSetting('doNotDisturb')}
          />
          <ToggleSetting
            icon={<Power size={18} />}
            label="Avto-ishga tushirish"
            desc="Windows bilan birga ochilsin"
            enabled={autoStart}
            onToggle={() => {
              void setAutoStart(!autoStart);
              toggleSetting('autoStart');
            }}
          />
        </div>
      </Section>

      {/* Break Duration */}
      <Section icon={<Timer className="w-5 h-5" />} title="Tanaffus davomiyligi">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300">Davomiylik</span>
            <span className="text-sky-400 font-mono font-bold">{breakDuration} soniya</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            value={breakDuration}
            readOnly
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
