import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDays,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  RefreshCw,
} from 'lucide-react';

export const FacultyLeave: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Form fields
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/faculty/leaves');
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

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;

    setSubmitting(true);
    try {
      await api.post('/faculty/leaves', {
        leaveType,
        fromDate,
        toDate,
        totalDays: Number(totalDays),
        reason,
      });
      setApplyModalOpen(false);
      setFromDate('');
      setToDate('');
      setReason('');
      await fetchLeaves();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Staff Affairs &amp; Attendance Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Faculty Leave Management System
          </h1>
          <p className="text-sm text-slate-500">
            Apply for Casual, Medical, and On-Duty (OD) leaves, check entitlement balance, and track Dean approvals.
          </p>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Apply for New Leave
        </button>
      </div>

      {/* Leave Entitlement Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Casual Leave (CL)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              12 Days / Year
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">
            9.0 <span className="text-xs text-slate-400 font-normal">Days Remaining</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">3 days utilized in Current Academic Term</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Medical Leave (ML)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              10 Days / Year
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2 font-mono">
            10.0 <span className="text-xs text-slate-400 font-normal">Days Remaining</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Full quota available with medical certificate</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">On-Duty (OD) Leave</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
              15 Days / Year
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 mt-2 font-mono">
            12.0 <span className="text-xs text-slate-400 font-normal">Days Remaining</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Conferences, JNTUH Evaluation, FDP duties</p>
        </div>
      </div>

      {/* Applied Leaves History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-[#1e40af]" />
            Applied Leave Applications &amp; Approval Status
          </h2>
          <span className="text-xs text-slate-500 font-medium">{leaves.length} Applications Recorded</span>
        </div>

        {leaves.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No leave applications recorded yet. Click &quot;Apply for New Leave&quot; above to submit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">From Date</th>
                  <th className="py-3 px-4">To Date</th>
                  <th className="py-3 px-4">Total Days</th>
                  <th className="py-3 px-4">Purpose / Reason</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">Dean / Admin Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {leaves.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{l.fromDate}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{l.toDate}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.totalDays} Day(s)</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{l.reason}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-slate-500 italic">
                      {l.adminComments || 'Pending review by Dean & Portal Administrator'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-[#1e40af]" />
              MLRIT College Leave Application
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Electronic leave request submitted directly to Department HOD and Principal.
            </p>

            <form onSubmit={handleApplyLeave} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Leave Classification Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                >
                  <option value="CASUAL">Casual Leave (CL)</option>
                  <option value="MEDICAL">Medical Leave (ML)</option>
                  <option value="ON_DUTY">On-Duty Leave (OD - FDP / Conference / Valuation)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Days of Leave</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Purpose of Leave</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain reason for leave and list colleague adjusting scheduled class periods..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold transition shadow-xs flex items-center"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Leave Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyLeave;
