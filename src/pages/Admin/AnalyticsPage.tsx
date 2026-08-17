import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';
import { formatTime } from '../../lib/utils';

export const AnalyticsPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-analytics-details'],
    queryFn: adminApi.getAnalytics,
  });

  if (isLoading) return <Loader message="Loading analytics dashboard..." />;

  if (error) {
    return (
      <div className="text-danger bg-danger/10 border border-danger/25 p-4 rounded-xl text-sm">
        Failed to load analytics: {(error as any).message || 'Server connection error'}
      </div>
    );
  }

  const callsTodayRatio = Math.min(((stats?.matchesToday ?? 0) / 100) * 100, 100);
  const callsThisWeekRatio = Math.min(((stats?.matchesThisWeek ?? 0) / 500) * 100, 100);

  const hourlyActivity = [
    { hour: '00:00', load: 30 },
    { hour: '04:00', load: 15 },
    { hour: '08:00', load: 45 },
    { hour: '12:00', load: 70 },
    { hour: '16:00', load: 95 }, // peak hour
    { hour: '20:00', load: 80 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-borderDark/60 bg-bgSurface/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-textMuted font-semibold uppercase tracking-wider select-none">Daily Volume</span>
              <h3 className="text-2xl font-extrabold text-glow text-textLight">{stats?.matchesToday ?? 0} Calls</h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-primary border border-primary/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-1.5 bg-bgDark rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${callsTodayRatio}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-textMuted mt-1.5">
              <span>0% target</span>
              <span>100 Calls target</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-borderDark/60 bg-bgSurface/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-textMuted font-semibold uppercase tracking-wider select-none">Weekly matches</span>
              <h3 className="text-2xl font-extrabold text-glow text-textLight">{stats?.matchesThisWeek ?? 0} Calls</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-success/20">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-1.5 bg-bgDark rounded-full overflow-hidden">
              <div className="h-full bg-success" style={{ width: `${callsThisWeekRatio}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-textMuted mt-1.5">
              <span>0% target</span>
              <span>500 Calls target</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-borderDark/60 bg-bgSurface/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-textMuted font-semibold uppercase tracking-wider select-none">Average Call Duration</span>
              <h3 className="text-2xl font-extrabold text-glow text-textLight">
                {formatTime(stats?.averageCallDurationSeconds ?? 0)}
              </h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-primary border border-primary/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-textMuted">
              <span>Call duration limit:</span>
              <span className="font-semibold text-textLight">Unlimited</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Hourly activity representation (Tailwind bar chart) */}
      <Card className="p-6 border border-borderDark/60 bg-bgSurface/40">
        <h4 className="text-base font-semibold text-textLight mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Active Users Hourly Traffic Load</span>
        </h4>
        <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-borderDark/40">
          {hourlyActivity.map((act) => (
            <div key={act.hour} className="flex flex-col items-center flex-1 space-y-2 group">
              <div className="relative w-8 bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/10 rounded-t-lg transition-all duration-300 flex items-end justify-center" style={{ height: `${act.load}%` }}>
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-bgSurface border border-borderDark px-1.5 py-0.5 rounded text-[10px] text-textLight font-mono">
                  {act.load}%
                </div>
                <div className="w-full bg-primary/40 group-hover:bg-primary transition-all duration-300 rounded-t-[6px]" style={{ height: '30%' }} />
              </div>
              <span className="text-[10px] text-textMuted font-medium select-none">{act.hour}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
