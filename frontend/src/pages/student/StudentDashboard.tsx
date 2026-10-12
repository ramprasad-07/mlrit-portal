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
  Clock,
  CheckCircle2,
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  const isLowAttendance = attendance?.overallPercentage < 75.0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#800020] to-[#5c0017] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wide text-amber-200 mb-2">
            Hall Ticket: {profile?.hallTicketNo || user?.username}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-2xl">
            {profile?.branch} • Semester {profile?.currentSemester} • Section {profile?.section} • Batch {profile?.batchYear}
          </p>
        </div>
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
          color="maroon"
          badge="Dean's List"
          badgeColor="bg-amber-100 text-amber-800"
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
          badgeColor={feeStatus?.feeDues === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}
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

      {/* Main Grid: Enrolled Courses & College Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrolled Courses (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#800020]" />
              Enrolled LMS Courses
            </h2>
            <Link
              to="/student/courses"
              className="text-xs font-semibold text-[#800020] hover:underline flex items-center"
            >
              View All Courses <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                    <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-xs font-bold font-mono">
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
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#800020] hover:border-[#800020] transition shadow-2xs"
                >
                  Enter Course
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Announcements (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-amber-600" />
              Notices &amp; Circulars
            </h2>
          </div>

          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                    {notice.category}
                  </span>
                  {notice.isPinned && (
                    <span className="text-[10px] font-semibold text-[#800020]">★ Pinned</span>
                  )}
                </div>
                <h4 className="font-semibold text-slate-900 leading-snug">
                  {notice.title}
                </h4>
                <p className="text-slate-600 text-[11px] line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
