import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { FileSpreadsheet, ShieldAlert, CheckCircle2, Edit3, Award } from 'lucide-react';

export const FacultyMarksEntry: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit marks modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<any | null>(null);
  const [internalScore, setInternalScore] = useState(25);
  const [grade, setGrade] = useState('A+');
  const [reason, setReason] = useState('Mid-1 evaluation script verified');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [clsRes, exRes, stuRes] = await Promise.all([
          api.get('/faculty/classes'),
          api.get('/admin/exams'),
          api.get('/admin/students'),
        ]);
        setClasses(clsRes.data);
        setExams(exRes.data);
        setStudents(stuRes.data);

        if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0]);
        if (exRes.data.length > 0) setSelectedExamId(exRes.data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchMarks = async () => {
    if (!selectedClass || !selectedExamId) return;
    try {
      const res = await api.get(`/faculty/marks?courseId=${selectedClass.course.id}&examId=${selectedExamId}`);
      setMarks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [selectedClass, selectedExamId]);

  const openEntryModal = (student: any, existingMark: any) => {
    setTargetStudent(student);
    setInternalScore(existingMark ? existingMark.internalMarks : 25);
    setGrade(existingMark ? existingMark.grade : 'A');
    setReason('Standard Mid evaluation score');
    setEditModalOpen(true);
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !selectedClass || !selectedExamId) return;
    setSubmitting(true);

    try {
      await api.post('/faculty/marks', {
        studentId: targetStudent.id,
        courseId: selectedClass.course.id,
        examId: selectedExamId,
        internalMarks: Number(internalScore),
        externalMarks: 0,
        grade,
        status: 'SUBMITTED',
        reason,
      });

      setSuccessMsg(`Marks updated for ${targetStudent.hallTicketNo}. Audit log created!`);
      setEditModalOpen(false);
      fetchMarks();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to enter marks. Verify role permissions.');
    } finally {
      setSubmitting(false);
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
          Examination &amp; Internal Marks Entry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Record Mid examination scores and internal marks. Every addition or change triggers a permanent audit trail.
        </p>
      </div>

      {/* Mandatory Audit Notice */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3 text-purple-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold">Institutional Security &amp; Audit Protocol:</span> In accordance with MLRIT examination rules,
          all marks entries, edits, or revisions are immutably logged in the <span className="font-semibold underline">Central Audit Log</span>{' '}
          with your Employee ID, timestamp, prior value, and revision rationale.
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Select Assigned Subject
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
                {cls.course.code} - {cls.course.title} (Section {cls.section})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Select Examination Event
          </label>
          <select
            value={selectedExamId || ''}
            onChange={(e) => setSelectedExamId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} (Semester {ex.semester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-[#800020]" />
            Student Evaluation Sheet ({selectedClass?.course?.code} - Sec {selectedClass?.section})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Hall Ticket</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3 text-center">Internal Score (30)</th>
                <th className="px-6 py-3 text-center">Calculated Grade</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const existing = marks.find((m) => m.student.id === student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                      {student.hallTicketNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {student.user?.fullName}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {existing ? `${existing.internalMarks} / 30` : 'Not Entered'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {existing ? (
                        <StatusBadge status={existing.grade} type="grade" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {existing ? existing.status : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEntryModal(student, existing)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#800020] hover:bg-[#66001a] text-white text-xs font-semibold inline-flex items-center transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        {existing ? 'Revise Marks' : 'Enter Score'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Marks Entry: ${targetStudent?.user?.fullName} (${targetStudent?.hallTicketNo})`}
      >
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Internal Exam Score (Max 30)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="30"
              required
              value={internalScore}
              onChange={(e) => setInternalScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Awarded Letter Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              <option value="O">O (Outstanding - 10)</option>
              <option value="A+">A+ (Excellent - 9)</option>
              <option value="A">A (Very Good - 8)</option>
              <option value="B+">B+ (Good - 7)</option>
              <option value="B">B (Above Average - 6)</option>
              <option value="C">C (Pass - 5)</option>
              <option value="F">F (Fail - 0)</option>
              <option value="AB">AB (Absent - 0)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason / Justification (Mandatory for Audit Log)
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mid-1 script valuation checked; Re-totaling correction"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {submitting ? 'Auditing & Saving...' : 'Save & Audit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
