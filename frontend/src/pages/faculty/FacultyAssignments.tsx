import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { FileCheck, Plus, CheckCircle2, Award, Calendar, ExternalLink } from 'lucide-react';

export const FacultyAssignments: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);

  const [gradeMarks, setGradeMarks] = useState(9);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/faculty/classes');
        setClasses(res.data);
        if (res.data.length > 0) {
          setSelectedClass(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchSubmissionsForClass = async () => {
    if (!selectedClass) return;
    try {
      // Fetch submissions for assignment #1 (or course assignments)
      const res = await api.get('/faculty/assignments/1/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubmissionsForClass();
  }, [selectedClass]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    setSubmitting(true);
    try {
      await api.post('/faculty/assignments', {
        courseId: selectedClass.course.id,
        section: selectedClass.section,
        title,
        instructions,
        dueDate: new Date(dueDate).toISOString(),
        maxMarks: Number(maxMarks),
      });
      setSuccessMsg('New assignment posted successfully for Section ' + selectedClass.section);
      setCreateModalOpen(false);
      setTitle('');
      setInstructions('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to post assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setSubmitting(true);
    try {
      await api.post('/faculty/assignments/grade', {
        submissionId: selectedSubmission.id,
        marksObtained: gradeMarks,
        feedback: gradeFeedback,
      });
      setSuccessMsg('Submission evaluated and grade recorded successfully!');
      setGradeModalOpen(false);
      fetchSubmissionsForClass();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to grade submission');
    } finally {
      setSubmitting(false);
    }
  };

  const openGradeModal = (sub: any) => {
    setSelectedSubmission(sub);
    setGradeMarks(sub.marksObtained || 9);
    setGradeFeedback(sub.feedback || '');
    setGradeModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assignments &amp; Submission Grading
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create lab assignments, set submission deadlines, and evaluate student work.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Post New Assignment
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Select Assigned Class */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {classes.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedClass(item)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedClass?.id === item.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono text-amber-500 mr-2">{item.course.code}</span>
            {item.course.title} (Section {item.section})
          </button>
        ))}
      </div>

      {/* Student Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-[#1e40af]" />
            Student Submissions for Review
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Hall Ticket</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Submission Details</th>
                <th className="px-6 py-3">Attachment URL</th>
                <th className="px-6 py-3 text-center">Marks (Max 10)</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No submissions currently waiting for evaluation.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#1e40af]">
                      {sub.student.hallTicketNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {sub.student.user?.fullName}
                    </td>
                    <td className="px-6 py-4 max-w-xs text-slate-600 truncate">
                      {sub.contentText}
                    </td>
                    <td className="px-6 py-4">
                      {sub.attachmentUrl ? (
                        <a
                          href={sub.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1e40af] hover:underline font-medium inline-flex items-center text-xs"
                        >
                          View Link <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-slate-400">No link</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {sub.marksObtained !== null ? `${sub.marksObtained} / 10` : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openGradeModal(sub)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition"
                      >
                        {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Post Assignment for Students"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab Project 2: Microservices Architecture Design"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Instructions &amp; Requirements
            </label>
            <textarea
              required
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Detailed submission guidelines, required format, problem statement..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Due Date &amp; Time
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Max Marks
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1e40af] hover:bg-[#1d4ed8] transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        title={`Evaluate: ${selectedSubmission?.student?.user?.fullName} (${selectedSubmission?.student?.hallTicketNo})`}
      >
        <form onSubmit={handleGradeSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Marks Awarded (Out of 10)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              required
              value={gradeMarks}
              onChange={(e) => setGradeMarks(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Feedback Remarks
            </label>
            <textarea
              rows={3}
              value={gradeFeedback}
              onChange={(e) => setGradeFeedback(e.target.value)}
              placeholder="Constructive feedback, code comments, or areas for improvement..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setGradeModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1e40af] hover:bg-[#1d4ed8] transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
