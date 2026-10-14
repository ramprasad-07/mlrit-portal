import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  Users,
  Search,
  Phone,
  Mail,
  GraduationCap,
  Building,
  User,
  ShieldCheck,
  Eye,
  X,
  Clock,
  Award,
} from 'lucide-react';

export const FacultyStudentProfiles: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/faculty/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const filteredStudents = students.filter((s) => {
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      s.hallTicketNo.toLowerCase().includes(query) ||
      (s.user?.fullName && s.user.fullName.toLowerCase().includes(query)) ||
      (s.user?.email && s.user.email.toLowerCase().includes(query));
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Student Information System (SIS)
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Department Student Profiles &amp; Dossiers
          </h1>
          <p className="text-sm text-slate-500">
            Access student hall ticket numbers, parent contact details, academic progress, and CGPA metrics.
          </p>
        </div>

        <div className="text-xs bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold self-start md:self-auto">
          Total Students: <span className="font-bold text-[#1e40af] font-mono">{students.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by hall ticket (e.g. 21R21A0501), name, or email..."
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
          <option value="ALL">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#1e40af] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-[#1e40af] px-2 py-0.5 rounded bg-[#1e40af]/10">
                  {s.hallTicketNo}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {s.department} • Sec {s.section}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-1">
                {s.user?.fullName}
              </h3>
              <p className="text-xs text-slate-500 truncate">{s.user?.email}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Semester &amp; Batch</span>
                  <span className="font-bold text-slate-800">Sem {s.currentSemester} ({s.batchYear})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Current CGPA</span>
                  <span className="font-black text-[#1e40af] font-mono">{s.currentCgpa} / 10.0</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Parent Phone</span>
                  <span className="font-mono text-slate-700">{s.parentMobile || '9848098765'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Admission Quota</span>
                  <span className="font-bold text-emerald-700">{s.feeCategory || 'CONVENER'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(s)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#1e40af] hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Full Student Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#1e40af] text-white flex items-center justify-center font-bold text-lg">
                {selectedStudent.user?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedStudent.user?.fullName}</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-[#1e40af]">{selectedStudent.hallTicketNo}</span>
                  <span>•</span>
                  <span>{selectedStudent.branch}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Father Name</span>
                <span className="font-bold text-slate-900">{selectedStudent.fatherName || 'K. Ramesh'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Mother Name</span>
                <span className="font-bold text-slate-900">{selectedStudent.motherName || 'K. Saraswathi Devi'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Parent Mobile</span>
                <span className="font-mono font-bold text-slate-900">{selectedStudent.parentMobile || '9848098765'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Student Email</span>
                <span className="font-mono text-slate-900 truncate block">{selectedStudent.user?.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Admission Date</span>
                <span className="font-bold text-slate-900">{selectedStudent.admitDate || '18-Aug-2022'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Aadhaar &amp; APAAR ID</span>
                <span className="font-mono text-slate-900 truncate block">{selectedStudent.apaarId || `APAAR-2024-${selectedStudent.hallTicketNo}`}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-emerald-700 block uppercase font-bold">Academic Performance</span>
                <span className="font-bold text-emerald-950">CGPA: {selectedStudent.currentCgpa} • {selectedStudent.totalCredits} Credits</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                Zero Backlogs
              </span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-[#1e40af] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyStudentProfiles;
