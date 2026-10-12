import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { CalendarCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/student/attendance');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  const overall = data?.overallPercentage || 0;
  const isEligible = overall >= 75.0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Attendance Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Subject-wise lecture attendance records and semester examination eligibility status.
        </p>
      </div>

      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cumulative Academic Attendance
            </span>
            <div className="flex items-baseline space-x-3 mt-1">
              <span className={`text-3xl sm:text-4xl font-extrabold ${
                isEligible ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {overall}%
              </span>
              <span className="text-xs text-slate-500">
                ({data?.attendedClasses} attended / {data?.totalClasses} conducted)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isEligible ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                Eligible for Semester Exams (≥ 75%)
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600" />
                Below Criteria (&lt; 75%)
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              overall >= 75 ? 'bg-emerald-600' : overall >= 65 ? 'bg-amber-500' : 'bg-rose-600'
            }`}
            style={{ width: `${Math.min(overall, 100)}%` }}
          />
        </div>
      </div>

      {/* Subject-wise Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
          <CalendarCheck className="w-5 h-5 mr-2 text-[#800020]" />
          Course-Wise Attendance Breakdown
        </h2>

        <div className="divide-y divide-slate-100">
          {data?.subjects?.map((sub: any) => {
            const pct = sub.percentage;
            return (
              <div key={sub.courseId} className="py-4 first:pt-1 last:pb-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-xs font-bold font-mono">
                      {sub.courseCode}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-1">
                      {sub.courseTitle}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className={`text-base font-bold ${
                      pct >= 75 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {pct}%
                    </span>
                    <p className="text-xs text-slate-500">
                      {sub.attendedClasses} / {sub.totalClasses} classes attended
                    </p>
                  </div>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 75 ? 'bg-emerald-500' : pct >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <span>
          MLRIT Autonomous Academic Regulations mandate 75% aggregate attendance in all theory and laboratory courses.
          Condonation for medical reasons (between 65% and 74%) requires prior Dean approval with medical documentation.
        </span>
      </div>
    </div>
  );
};
