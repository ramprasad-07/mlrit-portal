import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import { BookOpen, Plus, FileText, ExternalLink, Video, File, CheckCircle2 } from 'lucide-react';

export const FacultyLMS: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [lmsContent, setLmsContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  // Modals state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Form states
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState('PDF');
  const [materialUrl, setMaterialUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/faculty/classes');
        setClasses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0].course);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchLmsContent = async (courseId: number) => {
    setContentLoading(true);
    try {
      const res = await api.get(`/student/courses/${courseId}/lms`);
      setLmsContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchLmsContent(selectedCourse.id);
    }
  }, [selectedCourse]);

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await api.post(`/faculty/courses/${selectedCourse.id}/modules`, {
        title: moduleTitle,
        description: moduleDesc,
        orderIndex: (lmsContent?.modules?.length || 0) + 1,
      });
      setSuccessMsg('Course module created successfully!');
      setModuleModalOpen(false);
      setModuleTitle('');
      setModuleDesc('');
      fetchLmsContent(selectedCourse.id);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to create module');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId || !selectedCourse) return;
    setSubmitting(true);
    try {
      await api.post(`/faculty/modules/${selectedModuleId}/materials`, {
        title: materialTitle,
        fileType: materialType,
        resourceUrl: materialUrl,
      });
      setSuccessMsg('Course material uploaded successfully!');
      setMaterialModalOpen(false);
      setMaterialTitle('');
      setMaterialUrl('');
      fetchLmsContent(selectedCourse.id);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to upload material');
    } finally {
      setSubmitting(false);
    }
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
            LMS Course Content &amp; Material Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize syllabus modules, upload lecture notes, slides, and learning links for students.
          </p>
        </div>

        {selectedCourse && (
          <button
            onClick={() => setModuleModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Module
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Select Course Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {classes.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCourse(item.course)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCourse?.id === item.course.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono text-amber-500 mr-2">{item.course.code}</span>
            {item.course.title} (Sec {item.section})
          </button>
        ))}
      </div>

      {/* Modules List */}
      {contentLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e40af]" />
        </div>
      ) : lmsContent?.modules?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
          No modules created for this course yet. Click "Add New Module" above to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {lmsContent?.modules?.map((mItem: any) => (
            <div
              key={mItem.module.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#1e40af] uppercase tracking-wider block">
                    Module {mItem.module.orderIndex}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {mItem.module.title}
                  </h3>
                  {mItem.module.description && (
                    <p className="text-xs text-slate-500 mt-1">{mItem.module.description}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedModuleId(mItem.module.id);
                    setMaterialModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white text-xs font-semibold flex items-center transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Attach Material
                </button>
              </div>

              <div className="p-4 divide-y divide-slate-100">
                {mItem.materials.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No learning materials uploaded to this module yet.
                  </p>
                ) : (
                  mItem.materials.map((mat: any) => (
                    <div
                      key={mat.id}
                      className="py-3 flex items-center justify-between first:pt-1 last:pb-1"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                          <FileText className="w-4 h-4 text-[#1e40af]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">
                            {mat.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Format: {mat.fileType}
                          </span>
                        </div>
                      </div>

                      <a
                        href={mat.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center"
                      >
                        Preview <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title="Add New Course Module"
      >
        <form onSubmit={handleCreateModule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Module Title
            </label>
            <input
              type="text"
              required
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Unit 3: Design Patterns and Architecture"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Module Summary / Objectives
            </label>
            <textarea
              rows={3}
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              placeholder="Brief description of concepts covered in this unit..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModuleModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1e40af] hover:bg-[#1d4ed8] transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Attach Material Modal */}
      <Modal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        title="Attach Study Material to Module"
      >
        <form onSubmit={handleUploadMaterial} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Material Title
            </label>
            <input
              type="text"
              required
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Lecture 5 Notes: Singleton and Factory Pattern"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              File Format
            </label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="PDF">PDF Document</option>
              <option value="NOTES">Handwritten / Typed Notes</option>
              <option value="PPT">Presentation Slides</option>
              <option value="VIDEO">Lecture Video Recording</option>
              <option value="LINK">External Resource Link</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Resource URL (Cloud Storage, Drive, or PDF URL)
            </label>
            <input
              type="url"
              required
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
              placeholder="https://mlrit.ac.in/materials/lecture5.pdf"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMaterialModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#1e40af] hover:bg-[#1d4ed8] transition disabled:opacity-50"
            >
              {submitting ? 'Attaching...' : 'Upload Material'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
