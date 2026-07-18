import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Award, Eye, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Analytics() {
  const { eyeHealthScore, todayBreaks, streak, totalBreaks, breakHistory } = useStore();

  const weeklyData = [
    { day: 'Du', breaks: 8, score: 75 },
    { day: 'Se', breaks: 12, score: 85 },
    { day: 'Ch', breaks: 10, score: 80 },
    { day: 'Pa', breaks: 6, score: 65 },
    { day: 'Ju', breaks: 14, score: 90 },
    { day: 'Sh', breaks: 9, score: 78 },
    { day: 'Ya', breaks: todayBreaks, score: eyeHealthScore },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const maxBreaks = Math.max(...weeklyData.map(d => d.breaks));

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Statistika</h2>
        <p className="text-slate-400">Ko’z salomatligingizni kuzatib boring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          value={eyeHealthScore}
          label="Health Score"
          color="sky"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          value={streak}
          label="Kunlik streak"
          color="amber"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          value={todayBreaks}
          label="Bugun tanaffus"
          color="emerald"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          value={totalBreaks}
          label="Jami tanaffus"
          color="purple"
        />
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-white">Haftalik statistika</h3>
        </div>

        <div className="h-48 flex items-end justify-between gap-2">
          {weeklyData.map((day, index) => {
            const height = maxBreaks > 0 ? (day.breaks / maxBreaks) * 100 : 0;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${getScoreColor(day.score)} opacity-80`}
                />
                <span className="text-xs text-slate-500">{day.day}</span>
                <span className={`text-xs font-bold ${getScoreTextColor(day.score)}`}>{day.breaks}</span>
              </div>
            );
          })}
        </div>
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
          <h3 className="font-semibold text-white">So’nggi tanaffuslar</h3>
        </div>

        <div className="space-y-3">
          {breakHistory.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${record.completed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <div>
                  <div className="text-sm text-white font-medium">
                    {record.gamePlayed || 'Tanaffus'}
                  </div>
                  <div className="text-xs text-slate-500">{record.duration} soniya</div>
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

function StatCard({ icon, value, label, color }: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${colors[color]} rounded-2xl p-4 border`}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}
