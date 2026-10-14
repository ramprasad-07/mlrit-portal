import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { CalendarCheck2, CheckCircle2, Save, UserCheck, UserX, AlertCircle } from 'lucide-react';

export const FacultyAttendance: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodSlot, setPeriodSlot] = useState(1);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [clsRes, stuRes] = await Promise.all([
          api.get('/faculty/classes'),
          api.get('/faculty/students'),
        ]);
        setClasses(clsRes.data);
        setStudents(stuRes.data);

        if (clsRes.data.length > 0) {
          setSelectedClass(clsRes.data[0]);
        }

        // Initialize everyone as PRESENT by default
        const initialMap: Record<number, string> = {};
        stuRes.data.forEach((s: any) => {
          initialMap[s.id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const setStatus = (studentId: number, status: string) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: string) => {
    const updated: Record<number, string> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    setSaving(true);

    const items = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id] || 'PRESENT',
    }));

    try {
      await api.post('/faculty/attendance', {
        courseId: selectedClass.course.id,
        attendanceDate,
        periodSlot: Number(periodSlot),
        items,
      });

      setSuccessMsg(`Attendance recorded successfully for ${attendanceDate} (Slot ${periodSlot})!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const presentCount = Object.values(attendanceMap).filter((v) => v === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'ABSENT').length;
  const onDutyCount = Object.values(attendanceMap).filter((v) => v === 'ON_DUTY').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Daily Class Attendance Marking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Take roll call for assigned periods. Real-time percentages update directly on student profiles.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Filters */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Assigned Class / Section
            </label>
            <select
              value={selectedClass?.id || ''}
              onChange={(e) => {
                const match = classes.find((c) => c.id.toString() === e.target.value);
                setSelectedClass(match);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.course.code} - {cls.course.title} (Sec {cls.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Period Slot
            </label>
            <select
              value={periodSlot}
              onChange={(e) => setPeriodSlot(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-800"
            >
              <option value={1}>Period 1 (09:30 AM - 10:30 AM)</option>
              <option value={2}>Period 2 (10:30 AM - 11:30 AM)</option>
              <option value={3}>Period 3 (11:45 AM - 12:45 PM)</option>
              <option value={4}>Period 4 (01:30 PM - 02:30 PM)</option>
              <option value={5}>Period 5 (02:30 PM - 03:30 PM)</option>
            </select>
          </div>
        </div>

        {/* Attendance Counter & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 p-4 rounded-xl">
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Present: {presentCount}
            </span>
            <span className="text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
              Absent: {absentCount}
            </span>
            <span className="text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              On Duty: {onDutyCount}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => markAll('PRESENT')}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => markAll('ABSENT')}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Student Roll Call Sheet */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <CalendarCheck2 className="w-5 h-5 mr-2 text-[#1e40af]" />
              Roster &amp; Status Toggles
            </h2>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center shadow-xs transition disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {saving ? 'Recording...' : 'Save & Submit Attendance'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {students.map((student) => {
              const currentStatus = attendanceMap[student.id] || 'PRESENT';
              return (
                <div
                  key={student.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 transition"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-[#1e40af] block">
                      {student.hallTicketNo}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {student.user?.fullName}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      Sec {student.section} • Sem {student.currentSemester}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setStatus(student.id, 'PRESENT')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                        currentStatus === 'PRESENT'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Present
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus(student.id, 'ABSENT')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
                        currentStatus === 'ABSENT'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5 mr-1" />
                      Absent
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus(student.id, 'ON_DUTY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        currentStatus === 'ON_DUTY'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      On Duty
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};
