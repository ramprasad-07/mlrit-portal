import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import { BookOpen, FileText, Download, ExternalLink, ChevronRight, Video, File } from 'lucide-react';

export const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [lmsContent, setLmsContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lmsLoading, setLmsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/student/courses');
        setCourses(res.data);

        const paramCourseId = searchParams.get('courseId');
        if (paramCourseId) {
          const match = res.data.find((c: any) => c.id.toString() === paramCourseId);
          if (match) setSelectedCourse(match);
          else if (res.data.length > 0) setSelectedCourse(res.data[0]);
        } else if (res.data.length > 0) {
          setSelectedCourse(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLms = async () => {
      setLmsLoading(true);
      try {
        const res = await api.get(`/student/courses/${selectedCourse.id}/lms`);
        setLmsContent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLmsLoading(false);
      }
    };
    fetchLms();
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-4 h-4 text-rose-600" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-blue-600" />;
      default: return <File className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          LMS Course Content &amp; Study Materials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Moodle-style course repository with syllabus, lecture modules, and downloadable notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Course Selector (1 col) */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
            My Courses
          </h2>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                selectedCourse?.id === course.id
                  ? 'bg-[#1e40af] text-white border-[#1e40af] shadow-sm font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className={`text-[11px] font-mono font-bold block ${
                  selectedCourse?.id === course.id ? 'text-sky-300' : 'text-[#1e40af]'
                }`}>
                  {course.code}
                </span>
                <span className="text-xs line-clamp-1 mt-0.5">{course.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${
                selectedCourse?.id === course.id ? 'text-white' : 'text-slate-400'
              }`} />
            </button>
          ))}
        </div>

        {/* Right Column: Course Detail & Modules (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {selectedCourse && (
            <>
              {/* Course Info Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#1e40af] border border-blue-200 text-xs font-bold font-mono">
                      {selectedCourse.code}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Credits: {selectedCourse.credits} • Semester {selectedCourse.semester} • Department of {selectedCourse.department}
                    </p>
                  </div>

                  {selectedCourse.syllabusUrl && (
                    <a
                      href={selectedCourse.syllabusUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Syllabus
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Modules & Materials List */}
              {lmsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e40af]" />
                </div>
              ) : lmsContent?.modules?.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                  No modules or materials posted yet for this course.
                </div>
              ) : (
                <div className="space-y-4">
                  {lmsContent?.modules?.map((mItem: any) => (
                    <div
                      key={mItem.module.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                    >
                      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-[#1e40af] uppercase tracking-wider block">
                          Module {mItem.module.orderIndex}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                          {mItem.module.title}
                        </h3>
                        {mItem.module.description && (
                          <p className="text-xs text-slate-500 mt-1">{mItem.module.description}</p>
                        )}
                      </div>

                      <div className="p-4 divide-y divide-slate-100">
                        {mItem.materials.length === 0 ? (
                          <p className="text-xs text-slate-400 py-2 text-center">
                            No study materials attached to this module.
                          </p>
                        ) : (
                          mItem.materials.map((mat: any) => (
                            <div
                              key={mat.id}
                              className="py-3 flex items-center justify-between first:pt-1 last:pb-1"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                  {getFileIcon(mat.fileType)}
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                                    {mat.title}
                                  </h4>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    Type: {mat.fileType}
                                  </span>
                                </div>
                              </div>

                              <a
                                href={mat.resourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1e40af] text-xs font-semibold text-slate-700 hover:text-[#1e40af] flex items-center transition"
                              >
                                View File <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
