import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
}

const REPORT_REASONS = [
  'Harassment',
  'Sexual Content',
  'Nudity',
  'Spam',
  'Hate Speech',
  'Abusive Behavior',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReason) {
      onSubmit(selectedReason, description);
      setSelectedReason('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Stranger">
      <form onSubmit={handleSubmit} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Help Keep Us Safe</DialogTitle>
          <DialogDescription>
            Select the most appropriate reason why you are reporting this connection.
          </DialogDescription>
        </DialogHeader>

        {/* List of select buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setSelectedReason(reason)}
              className={`px-4 py-2.5 rounded-lg text-left text-xs font-semibold border transition-all duration-200 focus:outline-none ${
                selectedReason === reason
                  ? 'border-danger bg-danger/10 text-red-200 ring-1 ring-danger'
                  : 'border-borderDark/60 bg-bgDark hover:border-slate-700 text-textLight'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Optional text area details */}
        <div className="space-y-1.5">
          <label htmlFor="report-desc" className="text-xs font-semibold text-textMuted select-none">
            Additional details (Optional)
          </label>
          <Textarea
            id="report-desc"
            placeholder="Provide any context that will help moderation admins review this log..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
          />
          <div className="text-[10px] text-textMuted text-right">
            {description.length}/300
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={!selectedReason}>
            Submit Report
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
};
