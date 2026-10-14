import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import {
  Users,
  Search,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  Plus,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Password reset modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [reason, setReason] = useState('Student requested password reset at helpdesk');
  const [resetting, setResetting] = useState(false);

  // Provision student modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rollNo, setRollNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Student@123');
  const [dept, setDept] = useState('CSE');
  const [branch, setBranch] = useState('B.Tech Computer Science & Engineering');
  const [batchYear, setBatchYear] = useState('2024-2028');
  const [semester, setSemester] = useState(3);
  const [section, setSection] = useState('A');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [feeCategory, setFeeCategory] = useState('CONVENER');
  const [creating, setCreating] = useState(false);

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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo || !fullName || !email) return;

    setCreating(true);
    try {
      const payload = {
        hallTicketNo: rollNo.trim().toUpperCase(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        department: dept,
        branch: branch,
        batchYear: batchYear,
        currentSemester: Number(semester),
        section: section,
        feeCategory: feeCategory,
        fatherName: fatherName || `K. ${fullName.split(' ')[0]} Sharma`,
        motherName: motherName || 'K. Saraswathi Devi',
        parentMobile: parentMobile || '9848098765',
        admitDate: '14-Aug-2024',
        dateOfBirth: '15-Jun-2004',
        caste: 'BC-B',
        aadhaarNo: '7849 2039 ' + Math.floor(1000 + Math.random() * 8999),
        apaarId: `APAAR-2024-${rollNo.trim().toUpperCase()}`,
        currentCgpa: 8.50,
        totalCredits: 48,
      };

      await api.post('/admin/students', payload);
      setSuccessMsg(`Student account provisioned for ${rollNo.toUpperCase()}! Password: ${password}`);
      setCreateModalOpen(false);
      setRollNo('');
      setFullName('');
      setEmail('');
      await fetchStudents();
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to provision student account');
    } finally {
      setCreating(false);
    }
  };

  const filtered = students.filter((s) => {
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      s.hallTicketNo.toLowerCase().includes(q) ||
      s.user?.fullName?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Executive Portal / SIS Module
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Student Information System (SIS) &amp; Provisioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Admin provisions student accounts with Hall Ticket &amp; Password. All records saved directly to Supabase PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center shadow-xs self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> Provision New Student
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by hall ticket (e.g. 21R21A0501), student name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1e40af] outline-none"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-[#1e40af] outline-none"
        >
          <option value="ALL">All Departments ({students.length})</option>
          <option value="CSE">CSE</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </div>

      {/* Students Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#1e40af]" />
            Enrolled Students Registry ({filtered.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">B.Tech Autonomous</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hall Ticket</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department &amp; Branch</th>
                <th className="py-3 px-3 text-center">Sem &amp; Sec</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-4">Parent Mobile</th>
                <th className="py-3 px-4">Quota</th>
                <th className="py-3 px-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1e40af]">
                    {s.hallTicketNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{s.user?.fullName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{s.user?.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{s.department}</span>
                    <span className="text-[11px] text-slate-500 truncate block max-w-xs">{s.branch}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-bold text-slate-800">Sem {s.currentSemester}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">Sec {s.section}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-black text-slate-900">
                    {s.currentCgpa}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {s.parentMobile || '9848098765'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {s.feeCategory || 'CONVENER'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openResetModal(s)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1e40af] text-slate-700 hover:text-[#1e40af] text-xs font-bold transition inline-flex items-center"
                    >
                      <KeyRound className="w-3.5 h-3.5 mr-1 text-slate-400" /> Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Provision New Student */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-[#1e40af]" />
              Provision New Student Account
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates authenticated credentials in Supabase PostgreSQL and initializes ERP profile.
            </p>

            <form onSubmit={handleCreateStudent} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hall Ticket / Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24R21A05C1"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manisha Reddy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student College Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. manisha.r@student.mlrit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => {
                      setDept(e.target.value);
                      if (e.target.value === 'CSE') setBranch('B.Tech Computer Science & Engineering');
                      if (e.target.value === 'CSE-AIML') setBranch('B.Tech Artificial Intelligence & Machine Learning');
                      if (e.target.value === 'ECE') setBranch('B.Tech Electronics & Communication Engineering');
                      if (e.target.value === 'MECH') setBranch('B.Tech Mechanical Engineering');
                      if (e.target.value === 'CIVIL') setBranch('B.Tech Civil Engineering');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-semibold"
                  >
                    <option value="CSE">CSE</option>
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father Name</label>
                  <input
                    type="text"
                    placeholder="e.g. K. Ramesh"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. 9849012345"
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Quota</label>
                  <select
                    value={feeCategory}
                    onChange={(e) => setFeeCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  >
                    <option value="CONVENER">CONVENER (TSEAMCET)</option>
                    <option value="MANAGEMENT">MANAGEMENT (Category B)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold transition shadow-xs flex items-center"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    'Provision & Save to Supabase'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Administrative Password Reset: ${targetStudent?.hallTicketNo}`}
        maxWidth="md"
      >
        <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Secure Password</label>
            <input
              type="text"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Trail Reason</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetting}
              className="px-4 py-2 rounded-xl bg-[#1e40af] text-white font-bold"
            >
              {resetting ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudents;
