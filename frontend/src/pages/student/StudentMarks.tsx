import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import {
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Sparkles,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export const StudentMarks: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await api.get('/student/marks');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  // Sample course marks breakdown with Mid-1, Mid-2, Best of Mid, CIA, and Total
  const courseMarksBreakdown = [
    {
      code: 'CS501PC',
      title: 'Software Engineering & Agile Methodologies',
      mid1: 27,
      mid2: 29,
      bestMid: 28,
      ciaLabRecord: 10,
      finalInternal: 38,
      external: 54,
      total: 92,
      grade: 'O',
      gradePoints: 10,
      credits: 3,
    },
    {
      code: 'CS502PC',
      title: 'Computer Networks & Protocols',
      mid1: 26,
      mid2: 28,
      bestMid: 27,
      ciaLabRecord: 9,
      finalInternal: 36,
      external: 51,
      total: 87,
      grade: 'A+',
      gradePoints: 9,
      credits: 4,
    },
    {
      code: 'CS503PC',
      title: 'Full-Stack Web Technologies',
      mid1: 28,
      mid2: 30,
      bestMid: 29,
      ciaLabRecord: 10,
      finalInternal: 39,
      external: 56,
      total: 95,
      grade: 'O',
      gradePoints: 10,
      credits: 3,
    },
    {
      code: 'CS504PE',
      title: 'Machine Learning & Neural Networks',
      mid1: 25,
      mid2: 27,
      bestMid: 26,
      ciaLabRecord: 9,
      finalInternal: 35,
      external: 48,
      total: 83,
      grade: 'A',
      gradePoints: 8,
      credits: 3,
    },
  ];

  const creditRegistrations = [
    { semester: 'Semester 1', registered: 20, earned: 20, sgpa: '8.40', status: 'COMPLETED' },
    { semester: 'Semester 2', registered: 20, earned: 20, sgpa: '8.65', status: 'COMPLETED' },
    { semester: 'Semester 3', registered: 22, earned: 22, sgpa: '8.75', status: 'COMPLETED' },
    { semester: 'Semester 4', registered: 22, earned: 22, sgpa: '8.50', status: 'COMPLETED' },
    { semester: 'Semester 5', registered: 22, earned: 12, sgpa: '8.92 (In-Prog)', status: 'CURRENT' },
    { semester: 'Semester 6', registered: 20, earned: 0, sgpa: 'Upcoming', status: 'UPCOMING' },
    { semester: 'Semester 7', registered: 20, earned: 0, sgpa: 'Upcoming', status: 'UPCOMING' },
    { semester: 'Semester 8', registered: 14, earned: 0, sgpa: 'Upcoming', status: 'UPCOMING' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Autonomous Grading &amp; Continuous Assessment
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Marks Details &amp; Evaluation Transcript
          </h1>
          <p className="text-sm text-slate-500">
            Comprehensive evaluation matrix including Mid-1, Mid-2, best of mid average, CIA lab records, and overall CGPA.
          </p>
        </div>
      </div>

      {/* CGPA & Credits Header Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Cumulative GPA (CGPA)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#1e40af] mt-1 font-mono">
            {data?.currentCgpa || '8.75'} <span className="text-xs text-slate-400 font-normal">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Autonomous JNTUH Standard</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Credits Achieved
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {data?.totalCredits || 96} <span className="text-xs text-slate-400 font-normal">/ 160 Required</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">On Track for 4-Year B.Tech</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Academic Standing
          </span>
          <div className="text-sm font-bold text-emerald-700 mt-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
            First Class with Distinction
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero active backlogs</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Honors / Minors Track
          </span>
          <div className="text-sm font-bold text-purple-700 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Enrolled (B.Tech Honors)
          </div>
          <p className="text-[11px] text-slate-500 mt-1">8 / 18 Honors Credits Completed</p>
        </div>
      </div>

      {/* MODULE 5 PART 1: Comprehensive Midterm & CIA Marks Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-[#1e40af]" />
              Detailed Midterm Examination Marks &amp; CIA Internal Evaluation
            </h2>
            <p className="text-xs text-slate-500">
              Mid-1 (30M) • Mid-2 (30M) • Best of Mid Average (30M) • Continuous Lab/Assignment Assessment (10M) • Final Internal (40M)
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            Formula: Best(Mid) + CIA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-3 text-center">Mid-1 (30)</th>
                <th className="py-3 px-3 text-center">Mid-2 (30)</th>
                <th className="py-3 px-3 text-center bg-sky-50/60 text-sky-900">Best Mid Avg (30)</th>
                <th className="py-3 px-3 text-center">CIA / Lab (10)</th>
                <th className="py-3 px-3 text-center bg-blue-50 text-[#1e40af] border border-blue-200">Final Internal (40)</th>
                <th className="py-3 px-3 text-center">External (60)</th>
                <th className="py-3 px-3 text-center font-black">Overall (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {courseMarksBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#1e40af] block">{item.code}</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{item.title}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">{item.mid1}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">{item.mid2}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-sky-900 bg-sky-50/30">
                    {item.bestMid}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">{item.ciaLabRecord}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-[#1e40af] bg-[#1e40af]/5">
                    {item.finalInternal}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">{item.external}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-black text-slate-900 text-sm">
                    {item.total}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-800">{item.gradePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODULE 5 PART 2: Honors and Minors Degree Tracks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Honors &amp; Minors Degree Specializations (AICTE &amp; JNTUH Norms)
            </h2>
            <p className="text-xs text-slate-500">
              Students maintaining CGPA &gt; 8.0 without backlogs are eligible for 18 additional credits specializations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Honors Track */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-200 text-purple-900">
                Honors Degree Track
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE ENROLLMENT
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950">
                B.Tech (Honors) in Artificial Intelligence &amp; Autonomous Systems
              </h3>
              <p className="text-slate-600 text-[11px] mt-1">
                Advanced specialized track requiring 18 credits from NPTEL / Swayam and departmental electives.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-200 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Required</span>
                <span className="font-bold text-slate-900">18 Credits</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Completed</span>
                <span className="font-bold text-purple-700">8 Credits</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">CGPA Cutoff</span>
                <span className="font-bold text-emerald-700">&ge; 8.00 (Pass)</span>
              </div>
            </div>
          </div>

          {/* Minors Track */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-200 text-blue-900">
                Minor Degree Track
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                ELIGIBLE FOR SPRING
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Minor in Engineering Entrepreneurship &amp; Management (MBA Cell)
              </h3>
              <p className="text-slate-600 text-[11px] mt-1">
                Interdisciplinary minor allowing engineering undergraduates to master enterprise finance and product leadership.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Required</span>
                <span className="font-bold text-slate-900">18 Credits</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Completed</span>
                <span className="font-bold text-blue-700">0 Credits</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Registration</span>
                <span className="font-bold text-slate-700">Opens Sem 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 5 PART 3: Semester-wise Credit Registration & Credits Achieved */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-[#1e40af]" />
              Semester-Wise Credit Registration &amp; SGPA Progression
            </h2>
            <p className="text-xs text-slate-500">
              Total 160 B.Tech credits curriculum distributed across 8 semesters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          {creditRegistrations.map((cr, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition ${
                cr.status === 'COMPLETED'
                  ? 'bg-slate-50 border-slate-200'
                  : cr.status === 'CURRENT'
                  ? 'bg-[#1e40af]/5 border-[#1e40af]'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-500 block uppercase">{cr.semester}</span>
              <div className="text-base font-extrabold text-slate-900 mt-1 font-mono">{cr.sgpa}</div>
              <div className="text-[10px] text-slate-600 mt-1 font-semibold">
                {cr.earned} / {cr.registered} Cr
              </div>
              <span
                className={`inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  cr.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : cr.status === 'CURRENT'
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {cr.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentMarks;
