import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  Search,
  MessageSquare,
} from 'lucide-react';

export const AdminLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/admin/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.post(`/admin/leaves/${leaveId}/action`, {
        status,
        comments: status === 'APPROVED' ? 'Sanctioned by Dean of Academic Affairs' : 'Declined due to examination invigilation schedule',
      });
      setActionMsg(`Leave request #${leaveId} has been ${status}!`);
      await fetchLeaves();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err) {
      alert('Failed to update leave request status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const filtered = leaves.filter((l) => {
    const matchesFilter = filter === 'ALL' || l.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      (l.faculty?.user?.fullName && l.faculty.user.fullName.toLowerCase().includes(q)) ||
      (l.faculty?.employeeId && l.faculty.employeeId.toLowerCase().includes(q)) ||
      (l.reason && l.reason.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Staff Administration &amp; Human Resources
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Faculty Leave Applications Approval Cell
          </h1>
          <p className="text-sm text-slate-500">
            Review and sanction Casual, Medical, and On-Duty leaves submitted by college faculty.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 border px-3.5 py-2 rounded-xl text-xs font-semibold">
          <span>Pending Approvals:</span>
          <span className="font-bold text-amber-600 font-mono">
            {leaves.filter((l) => l.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by faculty name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1e40af] outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-2 rounded-lg font-bold transition ${filter === 'ALL' ? 'bg-[#1e40af] text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-2 rounded-lg font-bold transition ${filter === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-2 rounded-lg font-bold transition ${filter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-2 rounded-lg font-bold transition ${filter === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No faculty leave applications found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates &amp; Duration</th>
                  <th className="py-3 px-4">Reason / Colleague Adjustment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Dean Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{l.faculty?.user?.fullName || 'Faculty Member'}</span>
                      <span className="text-[11px] font-mono text-[#1e40af] block">{l.faculty?.employeeId} ({l.faculty?.department})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800 block">{l.fromDate} to {l.toDate}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{l.totalDays} Day(s)</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{l.reason}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          l.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {l.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleAction(l.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(l.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Decision Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaves;
