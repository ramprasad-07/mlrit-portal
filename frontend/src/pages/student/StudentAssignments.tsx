import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { FileCheck, Calendar, Award, ExternalLink, Send, CheckCircle2 } from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [contentText, setContentText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/student/assignments');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openSubmitModal = (assignment: any, currentSubmission: any) => {
    setSelectedAssignment(assignment);
    setContentText(currentSubmission?.contentText || '');
    setAttachmentUrl(currentSubmission?.attachmentUrl || '');
    setSubmissionModalOpen(true);
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);

    try {
      await api.post('/student/assignments/submit', {
        assignmentId: selectedAssignment.id,
        contentText,
        attachmentUrl,
      });
      setSuccessMessage('Assignment submission uploaded successfully!');
      setSubmissionModalOpen(false);
      fetchAssignments();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment. Please try again.');
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
          Assignments &amp; Submissions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review assignments, submit work before deadline, and inspect faculty evaluation &amp; remarks.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map(({ assignment, submission }) => {
          const isGraded = submission?.status === 'GRADED';
          const isSubmitted = !!submission;

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-xs font-bold font-mono">
                    {assignment.course.code}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {assignment.course.title}
                  </span>
                  <StatusBadge
                    status={submission ? submission.status : 'PENDING'}
                    type="general"
                  />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {assignment.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {assignment.instructions}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-slate-400" />
                    Max Marks: {assignment.maxMarks}
                  </span>
                </div>

                {/* Grade & Feedback Box if graded */}
                {isGraded && (
                  <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center justify-between">
                      <span>Evaluated Marks: {submission.marksObtained} / {assignment.maxMarks}</span>
                      <span className="text-[11px] font-normal text-emerald-700">
                        Graded by Faculty
                      </span>
                    </div>
                    {submission.feedback && (
                      <p className="text-emerald-800 text-xs italic">
                        Feedback: "{submission.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col items-start md:items-end justify-center">
                <button
                  onClick={() => openSubmitModal(assignment, submission)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center transition shadow-2xs ${
                    isSubmitted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      : 'bg-[#800020] hover:bg-[#66001a] text-white shadow-xs'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitted ? 'Resubmit / Edit Work' : 'Submit Assignment'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title={`Submit Work: ${selectedAssignment?.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Submission Text / Solution Description
            </label>
            <textarea
              required
              rows={4}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Describe your solution, methodology, or write inline answers..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Attachment or Project URL (GitHub, Google Drive, PDF link)
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://github.com/username/project or drive link"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSubmissionModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm Submission'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
