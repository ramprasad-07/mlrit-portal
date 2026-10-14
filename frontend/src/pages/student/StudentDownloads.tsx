import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Download,
  FileText,
  Printer,
  CheckCircle,
  Eye,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  X,
} from 'lucide-react';

export const StudentDownloads: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (docName: string) => {
    const element = document.createElement('a');
    const file = new Blob([`MLRIT Autonomous Official Document: ${docName}\nStudent: ${user?.fullName} (${profile?.hallTicketNo})\nDate: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${docName.toLowerCase().replace(/\s+/g, '_')}_${profile?.hallTicketNo || 'student'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Examination Branch &amp; Downloads
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Official Document Downloads
          </h1>
          <p className="text-sm text-slate-500">
            Download your external semester hall ticket, internal midterm hall ticket, and evaluated answer script copies.
          </p>
        </div>
      </div>

      {/* 3 Download Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Semester Hall Ticket Download */}
        <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e40af] flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-[#1e40af]">
                External Exam
              </span>
              <span className="text-xs text-slate-400">Sem {profile?.currentSemester || 5}</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-[#1e3a8a]">
              Semester Hall Ticket
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Official JNTUH Autonomous external theory &amp; practical examination admit card featuring registered courses, exam session timings, and barcode authorization.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setPreviewDoc('external')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1e40af] text-xs font-bold transition"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview Admit Card
            </button>
            <button
              onClick={() => handleDownload('Semester_Hall_Ticket')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Hall Ticket PDF
            </button>
          </div>
        </div>

        {/* Card 2: Internal Midterm Hall Ticket Download */}
        <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-800">
                CIA Assessment
              </span>
              <span className="text-xs text-slate-400">Mid-1 &amp; Mid-2</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-[#1e3a8a]">
              Internal Hall Ticket
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Continuous Internal Assessment (CIA) midterm examination hall ticket including seat allotment numbers, lab exam batches, and invigilator clearance signatures.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setPreviewDoc('internal')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview Mid Admit Card
            </button>
            <button
              onClick={() => handleDownload('Internal_Mid_Hall_Ticket')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Mid Admit PDF
            </button>
          </div>
        </div>

        {/* Card 3: Evaluated Answer Script Downloading */}
        <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                Revaluation Portal
              </span>
              <span className="text-xs text-slate-400">Scanned Copy</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-[#1e3a8a]">
              Answer Script Download
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Digitized scanned copy of your evaluated descriptive answer booklet with section-wise marks rubric, question-wise evaluation, and chief examiner annotations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setPreviewDoc('script')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview Evaluated Booklet
            </button>
            <button
              onClick={() => handleDownload('Evaluated_Answer_Script')}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Answer Script
            </button>
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="text-center border-b pb-4 mb-4 border-slate-200">
              <div className="text-[#1e40af] font-black text-xl tracking-wider uppercase font-serif">
                MLR Institute of Technology
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Autonomous Institution • Affiliated to JNTUH, Hyderabad • Accredited by NAAC with &apos;A&apos; Grade
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase mt-2 px-3 py-1 bg-slate-100 inline-block rounded-md">
                {previewDoc === 'external'
                  ? 'End Semester External Examination Hall Ticket (Nov/Dec 2026)'
                  : previewDoc === 'internal'
                  ? 'Continuous Internal Assessment (CIA Mid-2) Admit Card'
                  : 'Digital Evaluated Descriptive Answer Booklet Copy'}
              </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-xs mb-4">
              <div>
                <span className="text-slate-400 block font-semibold">Hall Ticket No:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{profile?.hallTicketNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Candidate Name:</span>
                <span className="font-bold text-slate-900">{user?.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Department &amp; Sem:</span>
                <span className="font-bold text-slate-900">{profile?.department} / Sem {profile?.currentSemester}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Father Name:</span>
                <span className="font-bold text-slate-900">{profile?.fatherName || 'K. Ramesh'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Branch:</span>
                <span className="font-bold text-slate-900">{profile?.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Verification Code:</span>
                <span className="font-bold text-emerald-700 font-mono">AUTH-MLRIT-2026-OK</span>
              </div>
            </div>

            {/* Timetable / Subjects table preview */}
            <div className="overflow-x-auto text-xs mb-6">
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-200">Course Code</th>
                    <th className="p-2 border border-slate-200">Course Title</th>
                    <th className="p-2 border border-slate-200">Exam Date &amp; Session</th>
                    <th className="p-2 border border-slate-200">Room / Hall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-mono font-bold border border-slate-200">CS501PC</td>
                    <td className="p-2 border border-slate-200">Software Engineering &amp; Agile Methodologies</td>
                    <td className="p-2 border border-slate-200">30-Nov-2026 (10:00 AM - 01:00 PM)</td>
                    <td className="p-2 border border-slate-200">Newton Hall 301</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold border border-slate-200">CS502PC</td>
                    <td className="p-2 border border-slate-200">Computer Networks &amp; Protocols</td>
                    <td className="p-2 border border-slate-200">03-Dec-2026 (10:00 AM - 01:00 PM)</td>
                    <td className="p-2 border border-slate-200">Newton Hall 302</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold border border-slate-200">CS503PC</td>
                    <td className="p-2 border border-slate-200">Full-Stack Web Technologies</td>
                    <td className="p-2 border border-slate-200">07-Dec-2026 (10:00 AM - 01:00 PM)</td>
                    <td className="p-2 border border-slate-200">Aryabhata 204</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold border border-slate-200">CS504PE</td>
                    <td className="p-2 border border-slate-200">Machine Learning &amp; Neural Networks</td>
                    <td className="p-2 border border-slate-200">11-Dec-2026 (10:00 AM - 01:00 PM)</td>
                    <td className="p-2 border border-slate-200">Aryabhata 205</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Instructions & Signatures */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <div className="flex items-center text-slate-500">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                Valid with Government Photo ID Card (Aadhaar / Voter ID)
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">Controller of Examinations</span>
                <span className="text-[10px] text-slate-500">MLRIT Autonomous Examination Center</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Copy
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDownloads;
