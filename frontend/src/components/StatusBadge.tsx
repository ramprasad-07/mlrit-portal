import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'attendance' | 'grade' | 'fee' | 'general';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general' }) => {
  const getBadgeStyle = () => {
    const s = status.toUpperCase();

    // Attendance
    if (s === 'PRESENT') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'ABSENT') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (s === 'ON_DUTY') return 'bg-blue-50 text-blue-700 border-blue-200';

    // Fees
    if (s === 'SUCCESS' || s === 'CLEARED' || s === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'PENDING' || s === 'DUE') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'FAILED') return 'bg-rose-50 text-rose-700 border-rose-200';

    // Grades
    if (s === 'O' || s === 'A+' || s === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'B+' || s === 'B') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s === 'C') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'F' || s === 'AB') return 'bg-rose-50 text-rose-700 border-rose-200';

    // Submissions
    if (s === 'GRADED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'SUBMITTED') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (s === 'LATE') return 'bg-rose-50 text-rose-700 border-rose-200';

    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};
