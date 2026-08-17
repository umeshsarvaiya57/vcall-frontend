import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Users, Video, Clock, ShieldAlert, Ban, Sparkles } from 'lucide-react';
import { formatTime } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminApi.getAnalytics,
    refetchInterval: 5000, // Auto-refresh statistics every 5 seconds
  });

  if (isLoading) {
    return <Loader message="Loading dashboard statistics..." />;
  }

  if (error) {
    return (
      <div className="text-danger bg-danger/10 border border-danger/25 p-4 rounded-xl text-sm">
        Failed to load statistics: {(error as any).message || 'Server connection error'}
      </div>
    );
  }

  const statCards = [
    { title: 'Active Users', value: stats?.activeUsers ?? 0, icon: Users, color: 'text-indigo-400 bg-indigo-500/10' },
    { title: 'Active Calls', value: stats?.activeCalls ?? 0, icon: Video, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Waiting Males', value: stats?.waitingMale ?? 0, icon: Sparkles, color: 'text-blue-400 bg-blue-500/10' },
    { title: 'Waiting Females', value: stats?.waitingFemale ?? 0, icon: Sparkles, color: 'text-pink-400 bg-pink-500/10' },
    { title: 'Pending Reports', value: stats?.pendingReports ?? 0, icon: ShieldAlert, color: 'text-red-400 bg-red-500/10' },
    { title: 'Active Bans', value: stats?.activeBans ?? 0, icon: Ban, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6 border border-borderDark/60 bg-bgSurface/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-textMuted">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-textLight">
                  {card.value}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Metrics Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calls metrics */}
        <Card className="p-6 border border-borderDark/60 bg-bgSurface/40">
          <h4 className="text-base font-semibold text-textLight mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Connection Metrics</span>
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm py-2 border-b border-borderDark/10">
              <span className="text-textMuted">Matches Today</span>
              <span className="font-semibold text-textLight">{stats?.matchesToday ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 border-b border-borderDark/10">
              <span className="text-textMuted">Matches This Week</span>
              <span className="font-semibold text-textLight">{stats?.matchesThisWeek ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-textMuted">Avg. Call Duration</span>
              <span className="font-semibold text-textLight">
                {formatTime(stats?.averageCallDurationSeconds ?? 0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Security Metrics */}
        <Card className="p-6 border border-borderDark/60 bg-bgSurface/40">
          <h4 className="text-base font-semibold text-textLight mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-danger" />
            <span>Moderation Overview</span>
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm py-2 border-b border-borderDark/10">
              <span className="text-textMuted">Reports Today</span>
              <span className="font-semibold text-textLight">{stats?.reportsToday ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 border-b border-borderDark/10">
              <span className="text-textMuted">Reports This Week</span>
              <span className="font-semibold text-textLight">{stats?.reportsThisWeek ?? 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2">
              <span className="text-textMuted">Bans Today</span>
              <span className="font-semibold text-textLight">{stats?.bansToday ?? 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
