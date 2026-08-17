import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { Settings, Save, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: settingsData, isLoading, error } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxCallDuration, setMaxCallDuration] = useState(0);
  const [recentMatchTTL, setRecentMatchTTL] = useState(120);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [matchingEnabled, setMatchingEnabled] = useState(true);

  useEffect(() => {
    if (settingsData) {
      setMaintenanceMode(settingsData.maintenanceMode ?? false);
      setMaxCallDuration(settingsData.maxCallDuration ?? 0);
      setRecentMatchTTL(settingsData.recentMatchTTL ?? 120);
      setChatEnabled(settingsData.chatEnabled ?? true);
      setMatchingEnabled(settingsData.matchingEnabled ?? true);
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('System settings saved.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Settings update failed.');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      maintenanceMode,
      maxCallDuration,
      recentMatchTTL,
      chatEnabled,
      matchingEnabled,
    });
  };

  if (isLoading) return <Loader message="Loading settings..." />;

  if (error) {
    return (
      <div className="text-danger bg-danger/10 border border-danger/25 p-4 rounded-xl text-sm">
        Failed to load settings: {(error as any).message || 'Server error'}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6 animate-in fade-in duration-200">
      {/* Alert Warning for maintenance status */}
      {maintenanceMode && (
        <div className="flex items-start space-x-3 p-4 rounded-xl border border-warning/20 bg-warning/5 text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold block mb-0.5">Maintenance Mode Active</span>
            New visitors will be blocked from joining matchmaking queues. Active calls will not be dropped immediately.
          </div>
        </div>
      )}

      {/* Configuration Card */}
      <Card className="p-6 border border-borderDark/60 bg-bgSurface/40 space-y-6">
        <h4 className="text-base font-semibold text-textLight flex items-center gap-2 select-none border-b border-borderDark/10 pb-4">
          <Settings className="h-5 w-5 text-primary" />
          <span>System Operation Settings</span>
        </h4>

        <div className="space-y-4">
          {/* Maintenance mode switch */}
          <div className="flex items-center justify-between py-2.5">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-textLight">Maintenance Mode</span>
              <p className="text-xs text-textMuted max-w-sm">
                Suspend all user accesses. Shows a service offline screen to clients.
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-5 w-10 rounded-full bg-slate-800 border-borderDark cursor-pointer accent-primary"
            />
          </div>

          {/* Matchmaking enabled switch */}
          <div className="flex items-center justify-between py-2.5 border-t border-borderDark/10">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-textLight">Matchmaking Enabled</span>
              <p className="text-xs text-textMuted max-w-sm">
                Suspend matching routines, preventing Males and Females from pairing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={matchingEnabled}
              onChange={(e) => setMatchingEnabled(e.target.checked)}
              className="h-5 w-10 rounded-full bg-slate-800 border-borderDark cursor-pointer accent-primary"
            />
          </div>

          {/* Chat Enabled Switch */}
          <div className="flex items-center justify-between py-2.5 border-t border-borderDark/10">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-textLight">P2P Text Chat</span>
              <p className="text-xs text-textMuted max-w-sm">
                Allow or suspend text-based chat message routing.
              </p>
            </div>
            <input
              type="checkbox"
              checked={chatEnabled}
              onChange={(e) => setChatEnabled(e.target.checked)}
              className="h-5 w-10 rounded-full bg-slate-800 border-borderDark cursor-pointer accent-primary"
            />
          </div>

          {/* Max Call duration input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-borderDark/10">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-textLight select-none">
                Max Call Duration (seconds)
              </label>
              <p className="text-xs text-textMuted">
                Automatically terminates calls reaching this duration limit. Set to 0 to make it unlimited.
              </p>
            </div>
            <input
              type="number"
              min={0}
              value={maxCallDuration}
              onChange={(e) => setMaxCallDuration(Number(e.target.value))}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-10 max-w-[180px]"
            />
          </div>

          {/* Match TTL limit input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-borderDark/10">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-textLight select-none">
                Recent Match TTL (seconds)
              </label>
              <p className="text-xs text-textMuted">
                Prevents skipped pairings from immediate rematching for this period of time.
              </p>
            </div>
            <input
              type="number"
              min={10}
              value={recentMatchTTL}
              onChange={(e) => setRecentMatchTTL(Number(e.target.value))}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-10 max-w-[180px]"
            />
          </div>
        </div>
      </Card>

      {/* Submit button row */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={updateMutation.isPending}
          className="px-6 font-semibold shadow-md shadow-indigo-500/10"
        >
          <Save className="h-4 w-4 mr-2" />
          <span>Save Settings</span>
        </Button>
      </div>
    </form>
  );
};
