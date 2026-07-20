import { motion } from 'framer-motion';
import { Eye, Clock, Zap, Trophy, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { LevelCard } from './Achievements';

export default function Dashboard() {
  const { t } = useTranslation();
  const {
    eyeHealthScore, 
    todayBreaks, 
    streak, 
    totalBreaks,
    nextBreakIn,
    isTimerRunning,
    timerMode,
    toggleTimer,
    showOverlay,
    breakMode,
  } = useStore();

  const [progress, setProgress] = useState(100);

  // Calculate progress based on timer mode
  useEffect(() => {
    const totalTime = timerMode === '20-20-20' ? 20 * 60 : timerMode === 'pomodoro' ? 25 * 60 : 30 * 60;
    setProgress((nextBreakIn / totalTime) * 100);
  }, [nextBreakIn, timerMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getHealthGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-teal-500/20';
    if (score >= 60) return 'from-amber-500/20 to-orange-500/20';
    return 'from-red-500/20 to-pink-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Hero Card - Eye Health Score */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getHealthGradient(eyeHealthScore)} border border-slate-700/50 p-8`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        <div className="relative flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - eyeHealthScore / 100)}`}
                strokeLinecap="round"
                className={getHealthColor(eyeHealthScore)}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className={`w-10 h-10 ${getHealthColor(eyeHealthScore)}`} />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-300 mb-1">{t('dashboard.eyeHealth')}</h2>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${getHealthColor(eyeHealthScore)}`}>{eyeHealthScore}</span>
              <span className="text-slate-500 text-lg">/100</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {eyeHealthScore >= 80
                ? t('dashboard.healthGood')
                : eyeHealthScore >= 60
                  ? t('dashboard.healthMedium')
                  : t('dashboard.healthBad')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Level / XP */}
      <LevelCard />

      {/* Timer Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-3xl p-6 border border-slate-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('dashboard.nextBreak')}</h3>
              <p className="text-sm text-slate-500">{t('dashboard.modeLabel', { mode: timerMode })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-xs text-slate-500">{isTimerRunning ? t('dashboard.active') : t('dashboard.paused')}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-6">
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Timer display */}
        <div className="text-center mb-6">
          <motion.div 
            key={nextBreakIn}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-6xl font-mono font-bold text-white tracking-wider"
          >
            {formatTime(nextBreakIn)}
          </motion.div>
          <p className="text-slate-500 mt-2">{t('dashboard.breakCountdown')}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button 
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              isTimerRunning 
                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            {isTimerRunning ? t('dashboard.pause') : t('dashboard.resume')}
          </button>
          <button
            onClick={() => showOverlay('break')}
            className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white-fixed py-3 rounded-xl font-semibold transition-colors"
          >
            <Sparkles size={18} />
            {t('dashboard.breakNow')}
          </button>
        </div>

        {/* Break mode indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>{t('dashboard.modePrefix')}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            breakMode === 'gentle' ? 'bg-emerald-500/10 text-emerald-400' :
            breakMode === 'strict' ? 'bg-red-500/10 text-red-400' :
            'bg-purple-500/10 text-purple-400'
          }`}>
            {t(`breakModes.${breakMode}`)}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          value={todayBreaks}
          label={t('dashboard.todayBreaks')}
          color="amber"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-purple-400" />}
          value={streak}
          label={t('dashboard.streak')}
          color="purple"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-sky-400" />}
          value={totalBreaks}
          label={t('dashboard.totalBreaks')}
          color="sky"
        />
        <StatCard
          icon={<RotateCcw className="w-5 h-5 text-emerald-400" />}
          value={Math.floor(nextBreakIn / 60)}
          label={t('dashboard.minutesLeft')}
          color="emerald"
        />
      </div>

      {/* Quick Tip */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-300 mb-1">{t('dashboard.tipTitle')}</h4>
            <p className="text-sm text-slate-400">{t('dashboard.tipBody')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { 
  icon: React.ReactNode; 
  value: number; 
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-500/10 border-amber-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    sky: 'bg-sky-500/10 border-sky-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${colorClasses[color]} rounded-2xl p-5 border`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}
