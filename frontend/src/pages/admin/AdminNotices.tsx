import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import { Megaphone, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminNotices: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create notice modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/notices', {
        title,
        content,
        category,
        targetAudience,
        isPinned,
      });
      setSuccessMsg('Notice published successfully to college bulletin board!');
      setCreateModalOpen(false);
      setTitle('');
      setContent('');
      fetchNotices();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to publish notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      setSuccessMsg('Notice removed.');
      fetchNotices();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to delete notice');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            College Notices &amp; Announcements Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish examination circulars, academic calendar alerts, events, and institutional directives.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#800020] hover:bg-[#66001a] text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Broadcast New Notice
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notices List */}
      <div className="grid grid-cols-1 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-100 text-amber-800">
                  {notice.category}
                </span>
                <span className="text-xs text-slate-400">
                  Target: <strong className="text-slate-700">{notice.targetAudience}</strong>
                </span>
                {notice.isPinned && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#800020]/10 text-[#800020]">
                    ★ Pinned Circular
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {notice.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {notice.content}
              </p>

              <div className="text-[11px] text-slate-400 pt-1">
                Published on {new Date(notice.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </div>
            </div>

            <button
              onClick={() => handleDeleteNotice(notice.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Broadcast New Notice"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule for B.Tech Mid-1 Examinations 2026"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="EXAM">EXAM</option>
                <option value="FEES">FEES</option>
                <option value="EVENTS">EVENTS</option>
                <option value="CIRCULAR">CIRCULAR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <option value="ALL">All (Students &amp; Faculty)</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Notice Content / Circular Text
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed announcement details, instructions, venue, or links..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pinCheck"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-[#800020] rounded border-slate-300 focus:ring-[#800020]"
            />
            <label htmlFor="pinCheck" className="text-xs font-semibold text-slate-700">
              Pin to top of bulletin board
            </label>
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
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {submitting ? 'Broadcasting...' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
