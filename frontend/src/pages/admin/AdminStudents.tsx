import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import { Users, Search, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Password reset modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [reason, setReason] = useState('Student requested password reset at helpdesk');
  const [resetting, setResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openResetModal = (student: any) => {
    setTargetStudent(student);
    setNewPassword('Student@123');
    setReason('Student submitted verification form for password reset');
    setResetModalOpen(true);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent) return;
    setResetting(true);

    try {
      await api.post('/admin/users/reset-password', {
        userId: targetStudent.user.id,
        newPassword,
        reason,
      });

      setSuccessMsg(`Password successfully reset for ${targetStudent.hallTicketNo}! Audit entry recorded.`);
      setResetModalOpen(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.hallTicketNo.toLowerCase().includes(q) ||
      s.user?.fullName?.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student Management &amp; Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enrolled student profiles, academic statistics, and administrative account controls.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hall ticket or name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Students Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#800020]" />
            Registered Students ({filtered.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Hall Ticket</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Branch &amp; Dept</th>
                <th className="px-6 py-3 text-center">Semester / Sec</th>
                <th className="px-6 py-3 text-center">CGPA</th>
                <th className="px-6 py-3 text-center">Quota</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                    {student.hallTicketNo}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>{student.user?.fullName}</div>
                    <div className="text-xs text-slate-400 font-normal">{student.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {student.branch} ({student.department})
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-800">
                    Sem {student.currentSemester} - Sec {student.section}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900">
                    {student.currentCgpa}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {student.feeCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openResetModal(student)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#800020] text-xs font-semibold text-slate-700 hover:text-[#800020] inline-flex items-center transition"
                    >
                      <KeyRound className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Reset Password for ${targetStudent?.hallTicketNo}`}
      >
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>
              This password reset will be permanently logged in the audit trail with your Administrator ID.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password (BCrypt Encrypted)
            </label>
            <input
              type="text"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new student portal password"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason / Ticket Reference
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Identity verified via College ID Card at Exam Cell"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {resetting ? 'Resetting...' : 'Execute Password Reset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
