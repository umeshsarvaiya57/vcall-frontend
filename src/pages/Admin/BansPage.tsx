import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Ban, Trash2, ShieldCheck, Plus } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const BansPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [sessionToBan, setSessionToBan] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: bans, isLoading, error } = useQuery({
    queryKey: ['admin-bans'],
    queryFn: adminApi.getBans,
  });

  const liftBanMutation = useMutation({
    mutationFn: adminApi.deleteBan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('Ban lifted successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lift request failed.');
    },
  });

  const handleLiftBan = (id: string) => {
    liftBanMutation.mutate(id);
  };

  const handleManualBanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToBan.trim()) {
      toast.error('Please enter a session ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.createBan({
        sessionId: sessionToBan.trim(),
        reason: banReason || 'Manual lockout by moderator',
        durationDays: banDuration,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('Block created.');
      setSessionToBan('');
      setBanReason('');
    } catch (err: any) {
      toast.error(err.message || 'Block request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader message="Fetching block logs..." />;

  if (error) {
    return (
      <div className="text-danger bg-danger/10 border border-danger/25 p-4 rounded-xl text-sm">
        Failed to fetch block lists: {(error as any).message || 'Server error'}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Manual Input Block */}
      <Card className="p-6 border border-borderDark/60 bg-bgSurface/40">
        <h4 className="text-base font-semibold text-textLight mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          <span>Manual block entry</span>
        </h4>

        <form onSubmit={handleManualBanSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold text-textMuted select-none">Session ID</label>
            <input
              type="text"
              required
              placeholder="anon_..."
              value={sessionToBan}
              onChange={(e) => setSessionToBan(e.target.value)}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold text-textMuted select-none">Justification Reason</label>
            <input
              type="text"
              placeholder="Provide reason for block"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-semibold text-textMuted select-none">Duration</label>
            <select
              value={banDuration}
              onChange={(e) => setBanDuration(Number(e.target.value))}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={99999}>Permanent</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="danger"
            loading={isSubmitting}
            className="md:col-span-1 h-10 w-full"
          >
            Apply Block
          </Button>
        </form>
      </Card>

      {/* Block Log Table */}
      <div>
        <h4 className="text-base font-semibold text-textLight mb-4 flex items-center gap-2 select-none">
          <Ban className="h-5 w-5 text-danger" />
          <span>Active Lock Records</span>
        </h4>

        {bans?.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Block log clear"
            description="There are currently no active blocks registered in the database."
          />
        ) : (
          <Card className="border border-borderDark/60 bg-bgSurface/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-borderDark/40 bg-bgSurface/65 text-xs font-semibold text-textMuted uppercase tracking-wider select-none">
                    <th className="px-6 py-4">Banned Session ID</th>
                    <th className="px-6 py-4">Lock Reason</th>
                    <th className="px-6 py-4">Blocked Date</th>
                    <th className="px-6 py-4">Expiration Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderDark/10 text-sm">
                  {bans?.map((ban: any) => {
                    const isPermanent = new Date(ban.expiresAt).getFullYear() > 2100;
                    return (
                      <tr key={ban._id} className="hover:bg-bgSurface/15 transition-all">
                        <td className="px-6 py-4 font-mono text-xs select-all text-textLight">
                          {ban.sessionId}
                        </td>
                        <td className="px-6 py-4 text-textMuted">
                          {ban.reason}
                        </td>
                        <td className="px-6 py-4 text-xs text-textMuted">
                          {new Date(ban.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-xs text-textMuted">
                          {isPermanent ? <Badge variant="danger">Permanent</Badge> : new Date(ban.expiresAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleLiftBan(ban._id)}
                            className="py-1 px-2.5 rounded-lg text-xs border border-borderDark hover:text-success hover:border-success/30"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Lift Ban
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
