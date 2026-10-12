import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { GraduationCap, Award, TrendingUp, CheckCircle } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Marks &amp; Academic Grade Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Mid examination scores, laboratory internals, SGPA progression history, and cumulative CGPA.
        </p>
      </div>

      {/* CGPA & Credits Header Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cumulative GPA (CGPA)
          </span>
          <div className="text-3xl font-extrabold text-[#800020] mt-2">
            {data?.currentCgpa || '8.45'} <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on all completed semesters</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Credits Earned
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {data?.totalCredits || 96}
          </div>
          <p className="text-xs text-slate-500 mt-1">Under Autonomous JNTUH Regulations</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Academic Standing
          </span>
          <div className="text-lg font-bold text-emerald-700 mt-2 flex items-center">
            <CheckCircle className="w-5 h-5 mr-1.5" />
            First Class with Distinction
          </div>
          <p className="text-xs text-slate-500 mt-1">Zero backlogs</p>
        </div>
      </div>

      {/* Semester GPA History Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#800020]" />
          Semester Progression (SGPA)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data?.semesterGpas?.map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 text-center"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Semester {item.semester}
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {item.sgpa}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                Passed • {item.creditsEarned} Credits
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Semester Mid-Exam Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#800020]" />
            Mid-1 Exam Results (Current Semester)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Course Code</th>
                <th className="px-6 py-3">Course Title</th>
                <th className="px-6 py-3 text-center">Exam Name</th>
                <th className="px-6 py-3 text-center">Internal Score (30)</th>
                <th className="px-6 py-3 text-center">Grade</th>
                <th className="px-6 py-3 text-center">Publication Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.marks?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No examination marks entered yet for this semester.
                  </td>
                </tr>
              ) : (
                data?.marks?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                      {m.course.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {m.course.title}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600">
                      {m.exam.name}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {m.internalMarks}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={m.grade || 'A'} type="grade" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
