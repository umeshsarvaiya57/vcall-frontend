import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { ShieldAlert, Check, Ban } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ReportsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [banTargetId, setBanTargetId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<number>(7); // Default 7 days
  const [isBanSubmitting, setIsBanSubmitting] = useState(false);

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: adminApi.getReports,
  });

  const dismissMutation = useMutation({
    mutationFn: adminApi.dismissReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('Report marked as reviewed.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Dismissal request failed.');
    },
  });

  const handleDismiss = (id: string) => {
    dismissMutation.mutate(id);
  };

  const handleBanInit = (reportedSessionId: string, reason: string) => {
    setBanTargetId(reportedSessionId);
    setBanReason(`Moderator action: reported for ${reason}`);
  };

  const handleBanSubmit = async () => {
    if (!banTargetId) return;

    setIsBanSubmitting(true);
    try {
      await adminApi.createBan({
        sessionId: banTargetId,
        reason: banReason,
        durationDays: banDuration,
      });

      // Find report matching target and mark as dismissed
      const matchingReport = reports?.find((r: any) => r.reportedSessionId === banTargetId);
      if (matchingReport) {
        await adminApi.dismissReport(matchingReport._id);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success(`Session locked for ${banDuration} days.`);
      setBanTargetId(null);
      setBanReason('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit ban.');
    } finally {
      setIsBanSubmitting(false);
    }
  };

  if (isLoading) return <Loader message="Fetching pending moderation tasks..." />;

  if (error) {
    return (
      <div className="text-danger bg-danger/10 border border-danger/25 p-4 rounded-xl text-sm">
        Failed to fetch reports: {(error as any).message || 'Server error'}
      </div>
    );
  }

  const pendingReports = reports?.filter((r: any) => r.status === 'pending') || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {pendingReports.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="Reports Queue Empty"
          description="Good work! There are no unresolved user reports remaining."
        />
      ) : (
        <Card className="border border-borderDark/60 bg-bgSurface/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderDark/40 bg-bgSurface/65 text-xs font-semibold text-textMuted uppercase tracking-wider select-none">
                  <th className="px-6 py-4">Room ID</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Report Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderDark/10 text-sm">
                {pendingReports.map((report: any) => (
                  <tr key={report._id} className="hover:bg-bgSurface/15 transition-all">
                    <td className="px-6 py-4 font-mono text-xs text-indigo-400">
                      {report.roomId}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="danger">{report.reason}</Badge>
                    </td>
                    <td className="px-6 py-4 text-textMuted max-w-xs truncate">
                      {report.description || <span className="italic">No details provided</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-textMuted">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleDismiss(report._id)}
                        className="py-1 px-2.5 rounded-lg text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Dismiss
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleBanInit(report.reportedSessionId, report.reason)}
                        className="py-1 px-2.5 rounded-lg text-xs"
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        Ban Session
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Ban Options Dialog */}
      <Modal isOpen={!!banTargetId} onClose={() => setBanTargetId(null)} title="Ban Session User">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>Issue Block</DialogTitle>
            <DialogDescription>
              Select the lock period duration for the reported session:
              <span className="block font-mono text-xs text-indigo-400 mt-1 select-all">{banTargetId}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
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
              <option value={365}>1 Year</option>
              <option value={99999}>Permanent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textMuted select-none">Ban Justification Reason</label>
            <input
              type="text"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setBanTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={isBanSubmitting} onClick={handleBanSubmit}>
              Apply Ban
            </Button>
          </DialogFooter>
        </div>
      </Modal>
    </div>
  );
};
