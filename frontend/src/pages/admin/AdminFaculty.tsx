import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Search,
  CheckCircle2,
  RefreshCw,
  Building,
} from 'lucide-react';

export const AdminFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Provision Faculty modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [empId, setEmpId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Faculty@123');
  const [dept, setDept] = useState('CSE');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [qualification, setQualification] = useState('M.Tech, Ph.D (Pursuing)');
  const [cabinNo, setCabinNo] = useState('Cabin 215, Ramanujan Block');
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFaculty = async () => {
    try {
      const res = await api.get('/admin/faculty');
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !fullName || !email) return;

    setCreating(true);
    try {
      const payload = {
        employeeId: empId.trim().toUpperCase(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        department: dept,
        designation: designation,
        qualification: qualification,
        cabinNo: cabinNo,
        phone: '98490' + Math.floor(10000 + Math.random() * 89999),
      };

      await api.post('/admin/faculty', payload);
      setSuccessMsg(`Faculty account provisioned for ${empId.toUpperCase()}! Password: ${password}`);
      setCreateModalOpen(false);
      setEmpId('');
      setFullName('');
      setEmail('');
      await fetchFaculty();
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to provision faculty account');
    } finally {
      setCreating(false);
    }
  };

  const filtered = faculty.filter((f) => {
    const matchesDept = deptFilter === 'ALL' || f.department === deptFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      f.employeeId.toLowerCase().includes(q) ||
      (f.user?.fullName && f.user.fullName.toLowerCase().includes(q)) ||
      (f.user?.email && f.user.email.toLowerCase().includes(q));
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
            Staff Administration / Faculty Module
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Faculty Directory &amp; Staff Provisioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Admin provisions faculty accounts with Employee ID &amp; Password. All records saved directly to Supabase PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center shadow-xs self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> Provision New Faculty
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
            placeholder="Search by employee ID (e.g. MLRIT-FAC-101), name, or email..."
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
          <option value="ALL">All Departments ({faculty.length})</option>
          <option value="CSE">CSE</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </div>

      {/* Faculty Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-[#1e40af]" />
            Faculty Members Registry ({filtered.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Academic Staff</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Faculty Name &amp; Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4">Chamber Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1e40af]">
                    {item.employeeId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{item.user?.fullName}</span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
                      <Mail className="w-3 h-3 mr-1" />
                      {item.user?.email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    Dept of {item.department}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.designation}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.qualification}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#1e40af] flex-shrink-0" />
                    {item.cabinNo || 'Ramanujan Block'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Faculty Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-[#1e40af]" />
              Provision New Faculty Account
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates faculty credentials in Supabase PostgreSQL and sets up teaching designation.
            </p>

            <form onSubmit={handleCreateFaculty} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MLRIT-FAC-111"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh.k@mlrit.ac.in"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
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
                  <label className="block font-bold text-slate-700 mb-1">Teaching Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  >
                    <option value="Professor & Head of Department">Professor &amp; Head of Department</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Computer Science (IIT Madras)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chamber / Cabin Location</label>
                  <input
                    type="text"
                    value={cabinNo}
                    onChange={(e) => setCabinNo(e.target.value)}
                    placeholder="e.g. Cabin 204, Ramanujan Block"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1e40af] outline-none"
                  />
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
    </div>
  );
};

export default AdminFaculty;
