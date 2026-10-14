import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';
import {
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Megaphone,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Phone,
  FileText,
  User,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [feeStatus, setFeeStatus] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, attRes, feeRes, courseRes, notRes] = await Promise.all([
          api.get('/student/profile'),
          api.get('/student/attendance'),
          api.get('/student/fees'),
          api.get('/student/courses'),
          api.get('/notices'),
        ]);
        setProfile(profRes.data);
        setAttendance(attRes.data);
        setFeeStatus(feeRes.data);
        setCourses(courseRes.data);
        setNotices(notRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const isLowAttendance = attendance?.overallPercentage < 75.0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wide text-sky-200">
                Hall Ticket: {profile?.hallTicketNo || user?.username}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-sky-400 text-slate-900">
                {profile?.feeCategory || 'CONVENER'} QUOTA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              Welcome, {user?.fullName}!
            </h1>
            <p className="text-sm text-slate-200 mt-1 max-w-2xl">
              {profile?.branch} • Semester {profile?.currentSemester} (Sec {profile?.section}) • Batch {profile?.batchYear}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/student/downloads"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center border border-white/20 transition"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Get Hall Ticket
            </Link>
            <Link
              to="/student/fees"
              className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold text-xs shadow-xs transition"
            >
              Pay Online Fees
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Mandatory Modules Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <a
          href="#basic-info"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <User className="w-5 h-5 mx-auto text-[#1e40af] group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Basic Info</span>
        </a>
        <Link
          to="/student/academic"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <Calendar className="w-5 h-5 mx-auto text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Academic Info</span>
        </Link>
        <Link
          to="/student/timetable"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <Clock className="w-5 h-5 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Exam Timetable</span>
        </Link>
        <Link
          to="/student/fees"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <CreditCard className="w-5 h-5 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Online Fees</span>
        </Link>
        <Link
          to="/student/marks"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <GraduationCap className="w-5 h-5 mx-auto text-sky-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Marks &amp; CGPA</span>
        </Link>
        <Link
          to="/student/downloads"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <Download className="w-5 h-5 mx-auto text-rose-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Downloads</span>
        </Link>
        <Link
          to="/student/contact"
          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#1e40af] text-center shadow-2xs hover:shadow-xs transition group"
        >
          <Phone className="w-5 h-5 mx-auto text-teal-600 group-hover:scale-110 transition-transform" />
          <span className="block text-[11px] font-bold text-slate-800 mt-1.5">Contact Us</span>
        </Link>
      </div>

      {/* Attendance Warning if < 75% */}
      {isLowAttendance && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start space-x-3 text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">Attendance Alert:</span> Your current cumulative attendance is{' '}
            <span className="font-bold underline">{attendance?.overallPercentage}%</span>, which is below the mandatory
            75% threshold required for semester end examinations. Please consult your faculty mentor.
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current CGPA"
          value={profile?.currentCgpa ? `${profile.currentCgpa}` : '8.45'}
          subtitle={`Credits Earned: ${profile?.totalCredits || 96}`}
          icon={GraduationCap}
          color="blue"
          badge="Dean's List"
          badgeColor="bg-sky-100 text-sky-800"
        />

        <MetricCard
          title="Cumulative Attendance"
          value={`${attendance?.overallPercentage || 0}%`}
          subtitle={`${attendance?.attendedClasses || 0} attended of ${attendance?.totalClasses || 0} classes`}
          icon={CalendarCheck}
          color={isLowAttendance ? 'amber' : 'emerald'}
          badge={isLowAttendance ? 'Below 75%' : 'Eligible'}
          badgeColor={isLowAttendance ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}
        />

        <MetricCard
          title="Outstanding Fee Dues"
          value={`₹${(feeStatus?.feeDues || 0).toLocaleString()}`}
          subtitle={`Total: ₹${(feeStatus?.totalFee || 0).toLocaleString()} • Paid: ₹${(feeStatus?.amountPaid || 0).toLocaleString()}`}
          icon={CreditCard}
          color={feeStatus?.feeDues > 0 ? 'amber' : 'emerald'}
          badge={feeStatus?.feeDues === 0 ? 'Cleared' : 'Pending'}
          badgeColor={feeStatus?.feeDues === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}
        />

        <MetricCard
          title="Enrolled Courses"
          value={courses.length}
          subtitle={`Semester ${profile?.currentSemester || 5} Curriculum`}
          icon={BookOpen}
          color="blue"
          badge="Active"
          badgeColor="bg-blue-100 text-blue-800"
        />
      </div>

      {/* MODULE 1: Official Student Basic Information Dossier */}
      <div id="basic-info" className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-serif font-bold text-[#1e3a8a] flex items-center">
              <User className="w-5 h-5 mr-2 text-[#1e40af]" />
              Basic Information &amp; Official Identity Dossier
            </h2>
            <p className="text-xs text-slate-500">
              Verified ERP records linked with JNTUH Autonomous Registry and Digilocker Upper ID.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Active Record
          </span>
        </div>

        {/* 13 ERP Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Hall Ticket Number</span>
            <span className="font-bold text-[#1e40af] font-mono text-sm mt-0.5 block">{profile?.hallTicketNo}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Student Full Name</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.fullName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Admission Date</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.admitDate || '18-Aug-2022'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Batch Period</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.batchYear}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Date of Birth (DOB)</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.dateOfBirth || '15-Jun-2004'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Caste / Reservation</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.caste || 'BC-B'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Admission Category</span>
            <span className="font-bold text-[#1e40af] mt-0.5 block">{profile?.feeCategory || 'CONVENER'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Father Name</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.fatherName || 'K. Ramesh'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Mother Name</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.motherName || 'K. Saraswathi Devi'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Student College Email</span>
            <span className="font-bold text-slate-900 truncate mt-0.5 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Parent Mobile Number</span>
            <span className="font-bold text-slate-900 font-mono mt-0.5 block">{profile?.parentMobile || '9848098765'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Aadhaar Number</span>
            <span className="font-bold text-slate-900 font-mono mt-0.5 block">{profile?.aadhaarNo || '7849 2039 1102'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 sm:col-span-2">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">APAAR ID (Upper ID / Digilocker)</span>
            <span className="font-bold text-[#1e40af] font-mono text-sm mt-0.5 block">{profile?.apaarId || `APAAR-2024-${profile?.hallTicketNo}`}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 sm:col-span-2">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Department &amp; Branch</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{profile?.branch} ({profile?.department})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & College Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrolled Courses (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif font-bold text-[#1e3a8a] flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#1e40af]" />
              Enrolled LMS Courses &amp; Notes
            </h2>
            <Link
              to="/student/courses"
              className="text-xs font-semibold text-[#db2777] hover:underline flex items-center"
            >
              View All LMS Courses <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1e40af] text-xs font-bold font-mono">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-1">
                    {course.title}
                  </h3>
                </div>

                <Link
                  to={`/student/courses?courseId=${course.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#1e40af] hover:bg-blue-50 hover:border-blue-300 transition shadow-2xs"
                >
                  Enter Course
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Announcements (1 col - Bulletin Style) */}
        <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-base font-serif font-bold text-[#1e3a8a] flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-sky-500" />
              Notices &amp; Circulars
            </h2>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Official
            </span>
          </div>

          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-start space-x-2.5 text-xs group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-100 mt-1.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold text-[#db2777]">★ Pinned</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-[#1e40af] transition leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2">
                    {notice.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
