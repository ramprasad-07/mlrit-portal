import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  Download,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  FileText,
} from 'lucide-react';

interface Holiday {
  date: string;
  day: string;
  occasion: string;
  type: 'National' | 'Festival' | 'Institutional';
}

interface CalendarEvent {
  period: string;
  event: string;
  category: 'Instruction' | 'Examination' | 'Vacation' | 'Evaluation';
  details: string;
}

export const StudentAcademic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'holidays'>('calendar');

  const holidays: Holiday[] = [
    { date: '14 Jan 2026', day: 'Wednesday', occasion: 'Bhogi / Sankranti Festival', type: 'Festival' },
    { date: '15 Jan 2026', day: 'Thursday', occasion: 'Makara Sankranti', type: 'Festival' },
    { date: '26 Jan 2026', day: 'Monday', occasion: 'Republic Day Celebration', type: 'National' },
    { date: '16 Feb 2026', day: 'Monday', occasion: 'Maha Shivaratri', type: 'Festival' },
    { date: '04 Mar 2026', day: 'Wednesday', occasion: 'Holi Festival', type: 'Festival' },
    { date: '20 Mar 2026', day: 'Friday', occasion: 'Ugadi (Telugu New Year)', type: 'Festival' },
    { date: '31 Mar 2026', day: 'Tuesday', occasion: 'Eid-ul-Fitr (Ramzan)', type: 'Festival' },
    { date: '05 Apr 2026', day: 'Sunday', occasion: 'Babu Jagjivan Ram Birthday', type: 'National' },
    { date: '14 Apr 2026', day: 'Tuesday', occasion: 'Dr. B.R. Ambedkar Jayanti', type: 'National' },
    { date: '15 Aug 2026', day: 'Saturday', occasion: 'Independence Day', type: 'National' },
    { date: '04 Sep 2026', day: 'Friday', occasion: 'Ganesh Chaturthi', type: 'Festival' },
    { date: '02 Oct 2026', day: 'Friday', occasion: 'Mahatma Gandhi Jayanti', type: 'National' },
    { date: '20 Oct 2026', day: 'Tuesday', occasion: 'Vijaya Dasami / Dussehra', type: 'Festival' },
    { date: '08 Nov 2026', day: 'Sunday', occasion: 'Diwali (Deepavali)', type: 'Festival' },
    { date: '25 Dec 2026', day: 'Friday', occasion: 'Christmas Day', type: 'Festival' },
  ];

  const academicCalendar: CalendarEvent[] = [
    {
      period: '01 Aug 2026 – 20 Sep 2026',
      event: '1st Spell of Instructions',
      category: 'Instruction',
      details: 'Regular offline classes, LMS course modules rollout, lab sessions.',
    },
    {
      period: '21 Sep 2026 – 26 Sep 2026',
      event: 'Mid-Term Examinations - I (Mid-1)',
      category: 'Examination',
      details: 'Descriptive and Objective CIA-1 for all autonomous B.Tech departments.',
    },
    {
      period: '28 Sep 2026 – 14 Nov 2026',
      event: '2nd Spell of Instructions',
      category: 'Instruction',
      details: 'Advanced syllabus, mini projects, technical seminar presentations.',
    },
    {
      period: '16 Nov 2026 – 21 Nov 2026',
      event: 'Mid-Term Examinations - II (Mid-2)',
      category: 'Examination',
      details: 'Descriptive & Objective CIA-2. Best of two averages computed.',
    },
    {
      period: '23 Nov 2026 – 28 Nov 2026',
      event: 'Practical / Lab End Examinations & Preparation Holidays',
      category: 'Evaluation',
      details: 'External viva voce, lab records verification, code reviews.',
    },
    {
      period: '30 Nov 2026 – 19 Dec 2026',
      event: 'End Semester Theory Examinations (Regular & Supply)',
      category: 'Examination',
      details: 'JNTUH Autonomous external theory exams in designated halls.',
    },
    {
      period: '21 Dec 2026 – 02 Jan 2027',
      event: 'Winter Vacation / Semester Break',
      category: 'Vacation',
      details: 'Faculty evaluation camp and student semester recess.',
    },
    {
      period: '04 Jan 2027',
      event: 'Commencement of Even Semester Class Work (2026-27)',
      category: 'Instruction',
      details: 'Registration for Sem 4 / Sem 6 courses and orientation.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
              Academic Affairs
            </span>
            <span className="text-xs text-slate-500 font-medium">B.Tech Autonomous Academic Year 2026-27</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Academic Information &amp; Schedule
          </h1>
          <p className="text-sm text-slate-500">
            Official academic calendar, instructional spells, examination schedules, and institutional holiday list.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'calendar'
                ? 'bg-white text-[#1e40af] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Calendar
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'holidays'
                ? 'bg-white text-[#1e40af] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List of Holidays ({holidays.length})
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        /* Academic Calendar Timeline */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <CalendarCheck className="w-5 h-5 mr-2 text-[#1e40af]" />
              MLRIT Autonomous Academic Schedule (Odd Semester 2026-27)
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Approved by Academic Council
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-[#1e40af]/30 space-y-8">
            {academicCalendar.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#1e40af] ring-4 ring-white" />

                <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl p-4 border border-slate-100 transition space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1e40af] font-mono">
                      {item.period}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.category === 'Examination'
                          ? 'bg-rose-100 text-rose-800'
                          : item.category === 'Vacation'
                          ? 'bg-blue-100 text-blue-800'
                          : item.category === 'Evaluation'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.event}</h3>
                  <p className="text-xs text-slate-600">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Holidays List */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-sky-500" />
              General &amp; Institutional Holidays (Calendar Year 2026)
            </h2>
            <span className="text-xs text-slate-500">Government of Telangana &amp; MLRIT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">S.No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Occasion / Festival</th>
                  <th className="py-3 px-4">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {holidays.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">{h.date}</td>
                    <td className="py-3 px-4 text-slate-600">{h.day}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{h.occasion}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          h.type === 'National'
                            ? 'bg-blue-100 text-blue-800'
                            : h.type === 'Festival'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {h.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAcademic;
