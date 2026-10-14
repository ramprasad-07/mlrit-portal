import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  CalendarDays,
  Clock,
  MapPin,
  User as UserIcon,
  GraduationCap,
  CalendarCheck2,
  Building,
  CheckCircle2,
  FileText,
  AlertCircle,
  Printer,
  Grid3X3,
  List,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Coffee,
  Utensils,
  Award,
  BookOpen,
} from 'lucide-react';

interface ExternalExam {
  subjectName: string;
  courseCode: string;
  fromDate: string;
  toDate: string;
  session: 'Morning (10:00 AM – 01:00 PM)' | 'Afternoon (02:00 PM – 05:00 PM)';
  examHall: string;
  credits: number;
  type: 'THEORY' | 'LAB';
}

interface TimetableSlot {
  id: number;
  course: {
    id: number;
    code: string;
    title: string;
    credits: number;
  };
  faculty: {
    user: {
      fullName: string;
    };
  };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNo: string;
  type?: 'THEORY' | 'LAB';
}

export const StudentTimetable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly-grid' | 'day-view' | 'external'>('weekly-grid');
  const [selectedDay, setSelectedDay] = useState<string>('MONDAY');
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBellScheduleModal, setShowBellScheduleModal] = useState(false);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const externalExams: ExternalExam[] = [
    {
      subjectName: 'Software Engineering & Agile Methodologies',
      courseCode: 'CS501PC',
      fromDate: '30-Nov-2026',
      toDate: '30-Nov-2026',
      session: 'Morning (10:00 AM – 01:00 PM)',
      examHall: 'Newton Hall 301 (Visvesvaraya Block, 3rd Floor)',
      credits: 3,
      type: 'THEORY',
    },
    {
      subjectName: 'Computer Networks & Protocols',
      courseCode: 'CS502PC',
      fromDate: '03-Dec-2026',
      toDate: '03-Dec-2026',
      session: 'Morning (10:00 AM – 01:00 PM)',
      examHall: 'Newton Hall 302 (Visvesvaraya Block, 3rd Floor)',
      credits: 4,
      type: 'THEORY',
    },
    {
      subjectName: 'Full-Stack Web Technologies',
      courseCode: 'CS503PC',
      fromDate: '07-Dec-2026',
      toDate: '07-Dec-2026',
      session: 'Morning (10:00 AM – 01:00 PM)',
      examHall: 'Aryabhata Hall 204 (Aryabhata Block, 2nd Floor)',
      credits: 3,
      type: 'THEORY',
    },
    {
      subjectName: 'Machine Learning & Neural Networks',
      courseCode: 'CS504PE',
      fromDate: '11-Dec-2026',
      toDate: '11-Dec-2026',
      session: 'Morning (10:00 AM – 01:00 PM)',
      examHall: 'Aryabhata Hall 205 (Aryabhata Block, 2nd Floor)',
      credits: 3,
      type: 'THEORY',
    },
    {
      subjectName: 'Full-Stack Web Development Practical Lab',
      courseCode: 'CS505PC',
      fromDate: '15-Dec-2026',
      toDate: '16-Dec-2026',
      session: 'Afternoon (02:00 PM – 05:00 PM)',
      examHall: 'Turing Computer Lab 4 (Ground Floor, Admin Block)',
      credits: 2,
      type: 'LAB',
    },
  ];

  // Complete comprehensive weekly timetable seed for fallback and matrix view
  const defaultWeeklySlots: TimetableSlot[] = [
    // MONDAY
    {
      id: 101,
      dayOfWeek: 'MONDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'L-201',
      course: { id: 1, code: 'CS501PC', title: 'Software Engineering & Agile Methodologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 102,
      dayOfWeek: 'MONDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'L-201',
      course: { id: 2, code: 'CS502PC', title: 'Computer Networks & Protocols', credits: 4 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 103,
      dayOfWeek: 'MONDAY',
      startTime: '11:45:00',
      endTime: '12:45:00',
      roomNo: 'Computer Lab 4',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Web Technologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 104,
      dayOfWeek: 'MONDAY',
      startTime: '13:30:00',
      endTime: '15:30:00',
      roomNo: 'AI & ML Lab',
      course: { id: 4, code: 'CS504PE', title: 'Machine Learning & Neural Networks Lab', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'LAB',
    },

    // TUESDAY
    {
      id: 105,
      dayOfWeek: 'TUESDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'L-201',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Web Technologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 106,
      dayOfWeek: 'TUESDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'L-201',
      course: { id: 4, code: 'CS504PE', title: 'Machine Learning & Neural Networks', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 107,
      dayOfWeek: 'TUESDAY',
      startTime: '11:45:00',
      endTime: '12:45:00',
      roomNo: 'L-201',
      course: { id: 1, code: 'CS501PC', title: 'Software Engineering & Agile Methodologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 108,
      dayOfWeek: 'TUESDAY',
      startTime: '13:30:00',
      endTime: '15:30:00',
      roomNo: 'Systems Lab 2',
      course: { id: 2, code: 'CS502PC', title: 'Computer Networks Lab', credits: 4 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'LAB',
    },

    // WEDNESDAY
    {
      id: 109,
      dayOfWeek: 'WEDNESDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'L-201',
      course: { id: 2, code: 'CS502PC', title: 'Computer Networks & Protocols', credits: 4 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 110,
      dayOfWeek: 'WEDNESDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'L-201',
      course: { id: 1, code: 'CS501PC', title: 'Software Engineering & Agile Methodologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 111,
      dayOfWeek: 'WEDNESDAY',
      startTime: '11:45:00',
      endTime: '12:45:00',
      roomNo: 'L-201',
      course: { id: 4, code: 'CS504PE', title: 'Machine Learning & Neural Networks', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 112,
      dayOfWeek: 'WEDNESDAY',
      startTime: '13:30:00',
      endTime: '15:30:00',
      roomNo: 'Web Tech Lab 3',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Web Technologies Lab', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'LAB',
    },

    // THURSDAY
    {
      id: 113,
      dayOfWeek: 'THURSDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'L-201',
      course: { id: 4, code: 'CS504PE', title: 'Machine Learning & Neural Networks', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 114,
      dayOfWeek: 'THURSDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'L-201',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Web Technologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 115,
      dayOfWeek: 'THURSDAY',
      startTime: '11:45:00',
      endTime: '12:45:00',
      roomNo: 'L-201',
      course: { id: 2, code: 'CS502PC', title: 'Computer Networks & Protocols', credits: 4 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 116,
      dayOfWeek: 'THURSDAY',
      startTime: '13:30:00',
      endTime: '14:30:00',
      roomNo: 'L-201',
      course: { id: 1, code: 'CS501PC', title: 'Software Engineering Tutorial', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },

    // FRIDAY
    {
      id: 117,
      dayOfWeek: 'FRIDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'L-201',
      course: { id: 1, code: 'CS501PC', title: 'Software Engineering & Agile Methodologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 118,
      dayOfWeek: 'FRIDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'L-201',
      course: { id: 2, code: 'CS502PC', title: 'Computer Networks & Protocols', credits: 4 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
    {
      id: 119,
      dayOfWeek: 'FRIDAY',
      startTime: '11:45:00',
      endTime: '12:45:00',
      roomNo: 'L-201',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Web Technologies', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 120,
      dayOfWeek: 'FRIDAY',
      startTime: '13:30:00',
      endTime: '15:30:00',
      roomNo: 'Center of Excellence Lab',
      course: { id: 4, code: 'CS504PE', title: 'AI & Deep Learning Hands-on', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'LAB',
    },

    // SATURDAY
    {
      id: 121,
      dayOfWeek: 'SATURDAY',
      startTime: '09:30:00',
      endTime: '10:30:00',
      roomNo: 'Innovation Hub',
      course: { id: 3, code: 'CS503PC', title: 'Full-Stack Project Mentorship', credits: 3 },
      faculty: { user: { fullName: 'Dr. K. Srinivas Rao' } },
      type: 'THEORY',
    },
    {
      id: 122,
      dayOfWeek: 'SATURDAY',
      startTime: '10:30:00',
      endTime: '11:30:00',
      roomNo: 'Seminar Hall 1',
      course: { id: 4, code: 'CS504PE', title: 'Research Seminar & Technical Paper Discussion', credits: 3 },
      faculty: { user: { fullName: 'Prof. P. Radhika' } },
      type: 'THEORY',
    },
  ];

  // Format "09:30:00" to "09:30 AM"
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = hours < 10 ? `0${hours}` : `${hours}`;
      return `${strHours}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/student/timetable');
        if (res.data && res.data.length > 0) {
          // If backend only has Monday & Tuesday, merge with full week default for complete experience
          const hasMidWeek = res.data.some((s: any) => s.dayOfWeek === 'WEDNESDAY' || s.dayOfWeek === 'THURSDAY');
          if (hasMidWeek) {
            setTimetable(res.data);
          } else {
            // merge backend records with rest of week
            const combined = [...res.data, ...defaultWeeklySlots.filter((d) => d.dayOfWeek !== 'MONDAY' && d.dayOfWeek !== 'TUESDAY')];
            setTimetable(combined);
          }
        } else {
          setTimetable(defaultWeeklySlots);
        }
      } catch (err) {
        console.error(err);
        setTimetable(defaultWeeklySlots);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-28">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            Loading MLRIT Class &amp; Examination Schedule...
          </p>
        </div>
      </div>
    );
  }

  // Group slots by day
  const effectiveSlots = timetable.length > 0 ? timetable : defaultWeeklySlots;
  const groupedByDay = days.reduce((acc: Record<string, TimetableSlot[]>, day) => {
    acc[day] = effectiveSlots.filter((slot) => slot.dayOfWeek === day);
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  // Matrix periods headers
  const matrixPeriods = [
    { id: 'p1', label: 'Period 1', time: '09:30 AM – 10:30 AM' },
    { id: 'p2', label: 'Period 2', time: '10:30 AM – 11:30 AM' },
    { id: 'tea', label: 'Short Break', time: '11:30 AM – 11:45 AM', isBreak: true },
    { id: 'p3', label: 'Period 3', time: '11:45 AM – 12:45 PM' },
    { id: 'lunch', label: 'Lunch Recess', time: '12:45 PM – 01:30 PM', isBreak: true },
    { id: 'p4', label: 'Period 4 & 5 (Lab / Theory)', time: '01:30 PM – 03:30 PM' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Branded Institutional Header Card */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200 tracking-wide">
              Academic Scheduling &amp; Exam Center
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              B.Tech CSE • Semester 5 • Section A (Autonomous)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1.5 tracking-tight">
            Class Timetable &amp; Examination Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional lecture periods, lab allocations, room numbers, and semester-end external examinations.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowBellScheduleModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Clock className="w-3.5 h-3.5 text-[#1e40af]" />
            <span>Bell Timings</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-[#1e40af] border border-blue-200 shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#1e40af]" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs (Matrix Grid / Day View / External SEE Exams) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('weekly-grid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'weekly-grid'
                ? 'bg-[#1e40af] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Master Weekly Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('day-view')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'day-view'
                ? 'bg-[#1e40af] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Day-by-Day Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('external')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'external'
                ? 'bg-[#1e40af] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Semester Exams (SEE)</span>
          </button>
        </div>

        {/* Status Chip */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 font-medium pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AY 2026-27 Odd Semester Active</span>
        </div>
      </div>

      {/* 3. "Today's Live Class" Highlight Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-[#1e40af] to-sky-700 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              Live Campus Schedule
            </span>
            <span className="text-xs text-sky-200">
              Department of Computer Science &amp; Engineering
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold">
            Today: Thursday Schedule • 4 Lectures &amp; 1 Tutorial Active
          </h2>
          <p className="text-xs text-blue-100">
            Next Session: <strong className="text-white">CS504PE • Machine Learning &amp; Neural Networks</strong> at 09:30 AM in Room L-201
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto shrink-0">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xs text-center min-w-[110px]">
            <span className="block text-[10px] uppercase font-bold text-sky-200 tracking-wider">Weekly Hours</span>
            <span className="text-lg font-bold font-mono">24 Hours</span>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xs text-center min-w-[110px]">
            <span className="block text-[10px] uppercase font-bold text-sky-200 tracking-wider">Working Days</span>
            <span className="text-lg font-bold font-mono">6 Days / Wk</span>
          </div>
        </div>
      </div>

      {/* TAB 1: MASTER WEEKLY MATRIX (Grid View) */}
      {activeTab === 'weekly-grid' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <Grid3X3 className="w-5 h-5 mr-2 text-[#1e40af]" />
                Institutional Master Timetable Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Weekly master departmental layout for B.Tech CSE V Semester (Section A)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Theory Lecture
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-50 border border-purple-200" /> Laboratory Block
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold uppercase text-[11px] w-28 bg-slate-100/70 border-r border-slate-200">
                    Day / Time
                  </th>
                  <th className="py-3 px-3 font-semibold text-center w-36 border-r border-slate-200">
                    <span className="block font-bold text-slate-900">Period 1</span>
                    <span className="text-[10px] text-slate-500 font-mono">09:30 AM – 10:30 AM</span>
                  </th>
                  <th className="py-3 px-3 font-semibold text-center w-36 border-r border-slate-200">
                    <span className="block font-bold text-slate-900">Period 2</span>
                    <span className="text-[10px] text-slate-500 font-mono">10:30 AM – 11:30 AM</span>
                  </th>
                  <th className="py-3 px-1.5 font-bold text-center w-14 bg-amber-50/50 border-r border-slate-200 text-amber-900 text-[10px] tracking-wider uppercase">
                    Tea Break
                  </th>
                  <th className="py-3 px-3 font-semibold text-center w-36 border-r border-slate-200">
                    <span className="block font-bold text-slate-900">Period 3</span>
                    <span className="text-[10px] text-slate-500 font-mono">11:45 AM – 12:45 PM</span>
                  </th>
                  <th className="py-3 px-1.5 font-bold text-center w-14 bg-emerald-50/50 border-r border-slate-200 text-emerald-900 text-[10px] tracking-wider uppercase">
                    Lunch Recess
                  </th>
                  <th className="py-3 px-3 font-semibold text-center w-48">
                    <span className="block font-bold text-slate-900">Period 4 &amp; 5 (Lab / Theory)</span>
                    <span className="text-[10px] text-slate-500 font-mono">01:30 PM – 03:30 PM</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {days.map((day) => {
                  const daySlots = groupedByDay[day] || [];
                  const slot1 = daySlots.find((s) => s.startTime.startsWith('09:30'));
                  const slot2 = daySlots.find((s) => s.startTime.startsWith('10:30'));
                  const slot3 = daySlots.find((s) => s.startTime.startsWith('11:45'));
                  const slot4 = daySlots.find((s) => s.startTime.startsWith('13:30'));

                  return (
                    <tr key={day} className="hover:bg-slate-50/50 transition">
                      {/* Day Label */}
                      <td className="py-4 px-4 font-bold text-slate-900 bg-slate-50/60 border-r border-slate-200 font-mono uppercase text-xs">
                        {day}
                      </td>

                      {/* Period 1 */}
                      <td className="p-2 border-r border-slate-200 align-top">
                        {slot1 ? (
                          <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e40af] text-white">
                              {slot1.course.code}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {slot1.course.title}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span className="truncate">{slot1.faculty.user.fullName}</span>
                              <span className="font-bold text-[#1e40af] shrink-0">{slot1.roomNo}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-slate-300 text-[11px] italic">Free Slot</div>
                        )}
                      </td>

                      {/* Period 2 */}
                      <td className="p-2 border-r border-slate-200 align-top">
                        {slot2 ? (
                          <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e40af] text-white">
                              {slot2.course.code}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {slot2.course.title}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span className="truncate">{slot2.faculty.user.fullName}</span>
                              <span className="font-bold text-[#1e40af] shrink-0">{slot2.roomNo}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-slate-300 text-[11px] italic">Free Slot</div>
                        )}
                      </td>

                      {/* Short Break Divider */}
                      <td className="p-1 bg-amber-50/40 border-r border-slate-200 text-center align-middle">
                        <div className="flex flex-col items-center justify-center text-[10px] text-amber-800 font-bold py-2">
                          <Coffee className="w-3.5 h-3.5 mb-1 text-amber-600" />
                          <span>15M</span>
                        </div>
                      </td>

                      {/* Period 3 */}
                      <td className="p-2 border-r border-slate-200 align-top">
                        {slot3 ? (
                          <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e40af] text-white">
                              {slot3.course.code}
                            </span>
                            <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {slot3.course.title}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span className="truncate">{slot3.faculty.user.fullName}</span>
                              <span className="font-bold text-[#1e40af] shrink-0">{slot3.roomNo}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-slate-300 text-[11px] italic">Library / Study</div>
                        )}
                      </td>

                      {/* Lunch Recess Divider */}
                      <td className="p-1 bg-emerald-50/40 border-r border-slate-200 text-center align-middle">
                        <div className="flex flex-col items-center justify-center text-[10px] text-emerald-800 font-bold py-2">
                          <Utensils className="w-3.5 h-3.5 mb-1 text-emerald-600" />
                          <span>45M</span>
                        </div>
                      </td>

                      {/* Period 4 & 5 (Lab / Afternoon block) */}
                      <td className="p-2 align-top">
                        {slot4 ? (
                          <div className={`p-2.5 rounded-xl border transition space-y-1 ${
                            slot4.roomNo.toLowerCase().includes('lab')
                              ? 'bg-purple-50/70 border-purple-200 hover:bg-purple-50'
                              : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                slot4.roomNo.toLowerCase().includes('lab')
                                  ? 'bg-purple-700 text-white'
                                  : 'bg-[#1e40af] text-white'
                              }`}>
                                {slot4.course.code}
                              </span>
                              {slot4.roomNo.toLowerCase().includes('lab') && (
                                <span className="text-[9px] font-bold uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                  2-Hour Lab
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {slot4.course.title}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span className="truncate">{slot4.faculty.user.fullName}</span>
                              <span className="font-bold text-slate-700 shrink-0">{slot4.roomNo}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-slate-300 text-[11px] italic">Mentorship / Sports</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DAY-BY-DAY INTERACTIVE TIMELINE */}
      {activeTab === 'day-view' && (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center overflow-x-auto gap-1.5">
            {days.map((day) => {
              const count = groupedByDay[day]?.length || 0;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#1e40af] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Chronological Lecture Cards for Selected Day */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-[#1e40af]" />
                  {selectedDay} Schedule • Lecture Periods &amp; Venues
                </h3>
                <p className="text-xs text-slate-500">
                  Total {groupedByDay[selectedDay]?.length || 0} instructional sessions scheduled
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1e40af] border border-blue-200">
                College Hours: 09:30 AM – 03:30 PM
              </span>
            </div>

            <div className="space-y-3">
              {(groupedByDay[selectedDay] || []).map((slot, sIdx) => {
                const isLab = slot.roomNo.toLowerCase().includes('lab');

                return (
                  <React.Fragment key={slot.id || sIdx}>
                    {/* Insert Lunch Break divider before the 01:30 PM afternoon session */}
                    {slot.startTime.startsWith('13:30') && (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-900 my-2">
                        <div className="flex items-center space-x-2">
                          <Utensils className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">Campus Lunch Recess &amp; Dining Hall</span>
                        </div>
                        <span className="font-mono font-semibold text-emerald-800">
                          12:45 PM – 01:30 PM (45 Mins)
                        </span>
                      </div>
                    )}

                    <div className={`p-4 rounded-xl border transition-all hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isLab
                        ? 'bg-purple-50/50 border-purple-200 hover:border-purple-300'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}>
                      <div className="flex items-start space-x-3.5">
                        {/* Period Number Pill */}
                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                          isLab ? 'bg-purple-600 text-white' : 'bg-[#1e40af] text-white'
                        }`}>
                          <span className="text-[10px] leading-none uppercase">P{sIdx + 1}</span>
                          <span className="text-[8px] font-normal leading-none mt-0.5">
                            {isLab ? 'LAB' : 'TH'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-[#1e40af] border border-blue-200">
                              {slot.course.code}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {isLab ? 'Practical Laboratory' : 'Core Theory'} • {slot.course.credits} Credits
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-serif font-bold text-[#1e3a8a]">
                            {slot.course.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                            <span className="flex items-center text-slate-700 font-medium">
                              <UserIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {slot.faculty.user.fullName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center text-slate-700 font-medium">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-[#1e40af]" />
                              {slot.roomNo}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time Badge */}
                      <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#1e40af]" />
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          {isLab ? '120 Minutes Duration' : '60 Minutes Duration'}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEMESTER END EXAMS (SEE) */}
      {activeTab === 'external' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  SEE Examination Cell
                </span>
                <span className="text-xs text-slate-500">Autonomous Regulations R22</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1 flex items-center">
                <CalendarCheck2 className="w-5 h-5 mr-2 text-[#1e40af]" />
                JNTUH Autonomous Semester End External Examination Schedule
              </h2>
              <p className="text-xs text-slate-500">
                November / December 2026 Regular &amp; Supplementary Examinations
              </p>
            </div>

            <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Exam Clearance Granted (95.1% Attendance)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4">Session Timing</th>
                  <th className="py-3 px-4">Examination Hall &amp; Floor</th>
                  <th className="py-3 px-3 text-center">Credits</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {externalExams.map((exam, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1e40af]">
                      {exam.courseCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {exam.subjectName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-800 font-mono font-semibold whitespace-nowrap">
                      {exam.fromDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        {exam.session}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#1e40af] shrink-0" />
                        <span>{exam.examHall}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                      {exam.credits}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Admit Card OK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exam Instructions Banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#1e40af] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">
                Statutory Examination Center Code of Conduct:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Candidates must be seated inside the assigned examination hall at least <strong>30 minutes prior</strong> to the scheduled commencement.</li>
                <li>Carrying physical MLRIT Identity Card and printed Barcoded Hall Ticket is mandatory for biometric invigilator entry.</li>
                <li>Programmable calculators, electronic gadgets, smartwatches, and cell phones are strictly prohibited inside the examination halls.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bell Schedule Modal */}
      {showBellScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-[#1e3a8a] flex items-center">
                <Clock className="w-5 h-5 mr-2 text-sky-600" />
                MLRIT Official Bell Schedule
              </h3>
              <button
                type="button"
                onClick={() => setShowBellScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800">First Warning Bell</span>
                <span className="font-mono font-bold text-[#1e40af]">09:25 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Period 1 (Instruction)</span>
                <span className="font-mono font-bold text-slate-900">09:30 AM – 10:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Period 2 (Instruction)</span>
                <span className="font-mono font-bold text-slate-900">10:30 AM – 11:30 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex justify-between items-center">
                <span className="font-bold">Short Tea Break</span>
                <span className="font-mono font-bold">11:30 AM – 11:45 AM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Period 3 (Instruction)</span>
                <span className="font-mono font-bold text-slate-900">11:45 AM – 12:45 PM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex justify-between items-center">
                <span className="font-bold">Lunch Recess</span>
                <span className="font-mono font-bold">12:45 PM – 01:30 PM</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Period 4 &amp; 5 (Lab / Theory)</span>
                <span className="font-mono font-bold text-slate-900">01:30 PM – 03:30 PM</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBellScheduleModal(false)}
                className="px-4 py-2 bg-[#1e40af] text-white text-xs font-bold rounded-xl hover:bg-[#1e3a8a] transition"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
