import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { CheckCircle2, ShieldAlert, Award, Globe, EyeOff } from 'lucide-react';

export const AdminResults: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      const res = await api.get('/admin/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const togglePublish = async (exam: any) => {
    const nextStatus = !exam.isPublished;
    try {
      await api.post(`/admin/exams/${exam.id}/publish`, { isPublished: nextStatus });
      setSuccessMsg(`Result publication state updated for ${exam.name}! Audit entry recorded.`);
      fetchExams();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to update result publication status');
    }
  };

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
          Examination Results Publishing Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review examination score approvals and manage student portal visibility with audited release logs.
        </p>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3 text-purple-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold">Result Publishing Audit:</span> Toggling the release of semester or mid-examination results
          triggers an administrative audit event confirming date, publisher username, and previous visibility status.
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Exams Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#800020]" />
            Examinations &amp; Scorecard Publications ({exams.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Examination Name</th>
                <th className="px-6 py-3 text-center">Semester</th>
                <th className="px-6 py-3 text-center">Academic Year</th>
                <th className="px-6 py-3 text-center">Current Status</th>
                <th className="px-6 py-3 text-right">Publishing Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {exam.name}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-700">
                    Semester {exam.semester}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {exam.academicYear}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      exam.isPublished
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {exam.isPublished ? 'PUBLISHED (Visible to Students)' : 'DRAFT / UNPUBLISHED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => togglePublish(exam)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center transition shadow-2xs ${
                        exam.isPublished
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          : 'bg-[#800020] hover:bg-[#66001a] text-white'
                      }`}
                    >
                      {exam.isPublished ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 mr-1" />
                          Unpublish Results
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5 mr-1" />
                          Publish to Students
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
