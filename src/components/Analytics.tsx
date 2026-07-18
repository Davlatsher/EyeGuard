import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Award, Eye, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useStore } from '../store/useStore';
import { isTauri, type DailyStat } from '../lib/tauri';

/** Map internal game ids (stored in the DB) to translation keys. */
const GAME_TITLE_KEY: Record<string, string> = {
  FollowDot: 'games.followdot.title',
  BlinkTrainer: 'games.blink.title',
  FocusShift: 'games.focus.title',
  ColorMatch: 'games.color.title',
  Breathing: 'games.breathing.title',
};

const DOW_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

// Score-band colours shared by the app (emerald / amber / red).
function scoreHex(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

// Browser-preview fallback: only used when there is no backend (no real DB).
const DEMO_DAILY: DailyStat[] = (() => {
  const breaks = [7, 11, 9, 6, 13, 8, 10];
  const scores = [70, 85, 78, 62, 90, 75, 82];
  return breaks.map((b, i) => ({ date: `demo-${i}`, breaks: b, completed: b, score: scores[i] }));
})();

export default function Analytics() {
  const { t } = useTranslation();
  const { eyeHealthScore, todayBreaks, streak, totalBreaks, breakHistory, dailyStats } = useStore();

  const usingDemo = dailyStats.length === 0 && !isTauri();
  const source = dailyStats.length > 0 ? dailyStats : usingDemo ? DEMO_DAILY : [];

  // Map backend DailyStat -> chart rows with localized weekday labels.
  const chartData = source.map((d, i) => {
    let label: string;
    if (d.date.startsWith('demo-')) {
      // demo rows: label the last as today, spread the rest across the week
      label = t(`analytics.days.${DOW_KEYS[(i + 1) % 7]}`);
    } else {
      const parsed = new Date(d.date + 'T00:00:00');
      label = isNaN(parsed.getTime())
        ? d.date
        : t(`analytics.days.${DOW_KEYS[parsed.getDay()]}`);
    }
    return { day: label, breaks: d.breaks, score: d.score };
  });

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">{t('analytics.title')}</h2>
        <p className="text-slate-400">{t('analytics.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Eye className="w-5 h-5" />} value={eyeHealthScore} label={t('analytics.healthScore')} color="sky" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} value={streak} label={t('analytics.streak')} color="amber" />
        <StatCard icon={<Clock className="w-5 h-5" />} value={todayBreaks} label={t('analytics.todayBreaks')} color="emerald" />
        <StatCard icon={<Award className="w-5 h-5" />} value={totalBreaks} label={t('analytics.totalBreaks')} color="purple" />
      </div>

      {/* Weekly Breaks (bar chart) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">{t('analytics.weekly')}</h3>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#1e293b55' }}
                content={({ active, payload, label }) =>
                  active && payload && payload.length ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-lg">
                      <div className="text-slate-300 font-medium mb-1">{label}</div>
                      <div className="text-sky-400">
                        {payload[0].value} {t('analytics.break')}
                      </div>
                      <div className={getScoreTextColor(Number(payload[0].payload.score))}>
                        {t('analytics.healthScore')}: {payload[0].payload.score}
                      </div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="breaks" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={scoreHex(d.score)} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Health Score trend (area chart) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">{t('analytics.scoreTrend')}</h3>
        </div>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ stroke: '#334155' }}
                content={({ active, payload, label }) =>
                  active && payload && payload.length ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-lg">
                      <div className="text-slate-300 font-medium mb-1">{label}</div>
                      <div className={getScoreTextColor(Number(payload[0].value))}>
                        {t('analytics.healthScore')}: {payload[0].value}
                      </div>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#scoreGrad)"
                dot={{ fill: '#0ea5e9', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {usingDemo && <p className="text-xs text-slate-500 mt-3 text-center">{t('analytics.demoNote')}</p>}
      </motion.div>

      {/* Recent Breaks */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">{t('analytics.recentBreaks')}</h3>
        </div>

        <div className="space-y-3">
          {breakHistory.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">—</p>
          )}
          {breakHistory.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${record.completed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <div>
                  <div className="text-sm text-white font-medium">
                    {record.gamePlayed
                      ? t(GAME_TITLE_KEY[record.gamePlayed] ?? record.gamePlayed)
                      : t('analytics.break')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {record.duration} {t('common.seconds')}
                  </div>
                </div>
              </div>
              <span className="text-sm text-slate-400 font-mono">{record.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`${colors[color]} rounded-2xl p-4 border`}>
      <div className="mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}
