import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Home,
  Bell,
  Building2,
  Calendar,
  ChevronUp,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'BULLETIN' | 'PLACEMENT' | 'EXAM' | 'JNTUH';
  package?: string;
  role?: string;
  description: string;
  refNo?: string;
}

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [username, setUsername] = useState('21R21A0501');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'STUDENT') {
      setUsername('21R21A0501');
      setPassword('Student@123');
    } else {
      setUsername('MLRIT-FAC-101');
      setPassword('Faculty@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();
      const user = await login(trimmedUser, trimmedPass, selectedRole);
      if (user.role === 'STUDENT') navigate('/student');
      else if (user.role === 'FACULTY') navigate('/faculty');
      else if (user.role === 'ADMIN') navigate('/admin');
    } catch (err: any) {
      if (!err.response) {
        setError(
          '⚠️ Backend server is not running on port 8080! Please run "start-portal.bat" or start the Spring Boot backend (`.\\mvnw.cmd spring-boot:run` in backend folder).'
        );
      } else {
        const msg =
          err.response?.data?.error ||
          'Invalid credentials. Please verify your ID and password.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sample notices matching the user's screenshots
  const bulletinNotices: NoticeItem[] = [
    {
      id: 'b1',
      title: 'BTECH VI SEM R16 SUPPLY / SPECIAL SUPPLY / REVALUATION / RECOUNTING NOTIFICATION',
      date: '05-OCT-2026',
      category: 'BULLETIN',
      refNo: 'MLRIT/EB/2026/NOTIF-142',
      description:
        'Online registration and fee payment module is open for eligible B.Tech VI Semester (R16 Regulations) students for Special Supplementary examinations. Last date to submit without late fine is 15-Oct-2026.'
    },
    {
      id: 'b2',
      title: 'ACADEMIC CALENDAR FOR B.TECH III & IV YEAR I & II SEMESTERS (A.Y. 2026-27)',
      date: '28-SEP-2026',
      category: 'BULLETIN',
      refNo: 'MLRIT/ACAD/CAL-08',
      description:
        'Approved academic calendar notifying commencement of class work, schedule for Midterm Examinations (Mid-I & Mid-II), preparation holidays, practical examinations, and semester end theory exams.'
    },
    {
      id: 'b3',
      title: 'COMMENCEMENT OF CLASSWORK FOR B.TECH II YEAR I SEMESTER',
      date: '20-SEP-2026',
      category: 'BULLETIN',
      refNo: 'MLRIT/DEAN/2026/089',
      description:
        'Orientation program and formal class commencement scheduled. Students are instructed to verify course allocations and mentor allotments on the portal.'
    },
    {
      id: 'b4',
      title: 'INSPECTION & ACCREDITATION COMPLIANCE UPDATE - NBA / NAAC A++ TIER-1',
      date: '15-SEP-2026',
      category: 'BULLETIN',
      refNo: 'MLRIT/IQAC/2026/021',
      description:
        'Outcome Based Education (OBE) course outcome attainment and faculty course file submission directives in compliance with NBA Tier-1 accreditation norms.'
    }
  ];

  const placementNotices: NoticeItem[] = [
    {
      id: 'p1',
      title: 'JUSPAY Notification || 11 LPA',
      date: '08-OCT-2026',
      category: 'PLACEMENT',
      package: '11.00 LPA',
      role: 'Full Stack SDE-1 / Product Intern',
      refNo: 'TPO/2026/JUSPAY-01',
      description:
        'Juspay recruitment drive for 2027 graduating batch. Eligible branches: CSE, CSE-AIML, IT. CGPA >= 7.50 with zero standing arrears. Online assessment starts on college coding lab.'
    },
    {
      id: 'p2',
      title: 'JPMorgan Chase & Co || 19.75 LPA',
      date: '02-OCT-2026',
      category: 'PLACEMENT',
      package: '19.75 LPA',
      role: 'Software Engineer Program (SEP) - Code For Good',
      refNo: 'TPO/2026/JPMC-04',
      description:
        'Shortlisted candidates for Technical Interview Rounds. Reporting time: 09:00 AM at Training & Placement Auditorium. Carry two hard copies of updated resume.'
    },
    {
      id: 'p3',
      title: 'IBM Technology Expert Labs || 9 LPA',
      date: '25-SEP-2026',
      category: 'PLACEMENT',
      package: '9.00 LPA',
      role: 'Associate Technical Consultant - Cloud & AI Architecture',
      refNo: 'TPO/2026/IBM-11',
      description:
        'Pre-placement talk and cloud architecture aptitude assessment schedule for eligible final-year candidates in B.Tech CSE, AIML, and ECE.'
    },
    {
      id: 'p4',
      title: 'SERVICENOW Recruitment Drive || 16 LPA',
      date: '18-SEP-2026',
      category: 'PLACEMENT',
      package: '16.00 LPA',
      role: 'Associate Quality & Systems Engineer',
      refNo: 'TPO/2026/SNOW-07',
      description:
        'ServiceNow campus hiring process commenced. Registered applicants must review slot allotments and complete system test verification.'
    }
  ];

  const examNotices: NoticeItem[] = [
    {
      id: 'e1',
      title:
        'B.Tech IV Year II Semester (R20) Advanced Supplementary Examinations Timetable - October 2026',
      date: '10-OCT-2026',
      category: 'EXAM',
      refNo: 'EB/TIMETABLE/2026/102',
      description:
        'Comprehensive examination timetable for regular and supplementary students. Hall tickets are available in Downloads section.'
    },
    {
      id: 'e2',
      title:
        'B.Tech III Year I Semester (R22) Regular & Supplementary Practical Examination Schedule',
      date: '06-OCT-2026',
      category: 'EXAM',
      refNo: 'EB/LAB/2026/044',
      description:
        'External laboratory examinations will commence as per batch allotment. Contact department HOD office for specific lab batch timings.'
    },
    {
      id: 'e3',
      title:
        'Examination Fee Notification: B.Tech II, III, IV Year I Semester Regular & Supply Exams',
      date: '01-OCT-2026',
      category: 'EXAM',
      refNo: 'EB/FEE/2026/019',
      description:
        'Pay online examination fees without late fine up to 15-Oct-2026. Online payment receipt available immediately in Student Portal.'
    },
    {
      id: 'e4',
      title:
        'Revaluation & Recounting Results for B.Tech II Year II Semester (R22) Regular Examinations',
      date: '24-SEP-2026',
      category: 'EXAM',
      refNo: 'EB/RESULTS/2026/088',
      description:
        'Updated grade sheets reflect under Student Portal -> Marks Details -> Grade Sheets. Contact Examination Branch for any discrepancies.'
    }
  ];

  const jntuhCirculars: NoticeItem[] = [
    {
      id: 'j1',
      title:
        'JNTUH - Academic & Planning - Guidelines for Grant of Condonation of Attendance Shortage',
      date: '09-OCT-2026',
      category: 'JNTUH',
      refNo: 'JNTUH/DAP/CONDONATION/2026',
      description:
        'Statutory directives to affiliated autonomous colleges regarding student condonation eligibility between 65% and 75% on certified medical grounds.'
    },
    {
      id: 'j2',
      title:
        'JNTUH Computer Based Test (CBT) for Internal Marks Improvement - B.Tech Regular Students',
      date: '04-OCT-2026',
      category: 'JNTUH',
      refNo: 'JNTUH/EB/CBT/2026/02',
      description:
        'Circular regarding registration guidelines and eligibility criteria for CBT internal marks betterment examination.'
    },
    {
      id: 'j3',
      title:
        'JNTUH One-Time Chance Examination for Autonomous College Students (Pre-R16 Regulations)',
      date: '29-SEP-2026',
      category: 'JNTUH',
      refNo: 'JNTUH/EB/MERCY/2026',
      description:
        'Special one-time mercy chance notification for students who exceeded maximum permissible course completion duration.'
    },
    {
      id: 'j4',
      title:
        'JNTUH Directives on APAAR ID (Automated Permanent Academic Account Registry) Generation',
      date: '22-SEP-2026',
      category: 'JNTUH',
      refNo: 'JNTUH/REG/APAAR/2026',
      description:
        'Mandatory submission and verification of 12-digit APAAR ID in basic student profile in alignment with National Education Policy (NEP 2020).'
    }
  ];

  return (
    <div id="top" className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Header Navigation Bar (Screenshot Style) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1e40af] text-white flex items-center justify-center font-black text-xl shadow-xs">
              M
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-[#1e40af] tracking-wide block leading-tight">
                MLRIT STUDENT MANAGEMENT PORTAL
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Marri Laxman Reddy Institute of Technology • Autonomous JNTUH
              </span>
            </div>
          </div>

          {/* Right Nav Links */}
          <nav className="flex items-center space-x-1 sm:space-x-4 text-xs sm:text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="flex items-center px-2 py-1.5 rounded-md hover:text-[#1e40af] hover:bg-slate-50 transition"
              title="Home"
            >
              <Home className="w-4 h-4 sm:mr-1 text-[#1e40af]" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('bulletin-board')}
              className="px-2 py-1.5 rounded-md hover:text-[#1e40af] hover:bg-slate-50 transition"
            >
              Bulletin Board
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('exam-notifications')}
              className="px-2 py-1.5 rounded-md hover:text-[#1e40af] hover:bg-slate-50 transition"
            >
              Examination Notifications
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('placement-notifications')}
              className="px-2 py-1.5 rounded-md hover:text-[#1e40af] hover:bg-slate-50 transition"
            >
              Placements
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Login Section (Screenshot 3 style) */}
        <section className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-md p-6 sm:p-8">
            {/* Title */}
            <h2 className="text-2xl font-serif font-bold text-[#1e3a8a] text-center mb-6">
              Faculty / Student Login
            </h2>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`flex items-center justify-center py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('FACULTY')}
                className={`flex items-center justify-center py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  selectedRole === 'FACULTY'
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-1.5" />
                Faculty Portal
              </button>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  User Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      selectedRole === 'STUDENT'
                        ? 'Hall Ticket Number (e.g. 21R21A0501)'
                        : 'Employee ID (e.g. MLRIT-FAC-101)'
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button (Vivid Blue matching screenshot) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-md shadow-sm transition flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </button>

              {/* Forgot Password Link (Magenta/Pink matching screenshot) */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#db2777] hover:text-[#be185d] font-medium hover:underline transition"
                >
                  I forgot my password
                </button>
              </div>
            </form>

            {/* Quick Demo Credentials Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
                Quick Test Credentials (Click to Auto-Fill)
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('STUDENT');
                    setUsername('21R21A0501');
                    setPassword('Student@123');
                    setError(null);
                  }}
                  className="text-[11px] py-1.5 px-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 font-medium text-center transition"
                >
                  Rahul (CSE)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('STUDENT');
                    setUsername('24R21A05B7');
                    setPassword('Student@123');
                    setError(null);
                  }}
                  className="text-[11px] py-1.5 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 font-medium text-center transition"
                >
                  Ram (24R..)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('FACULTY');
                    setUsername('MLRIT-FAC-101');
                    setPassword('Faculty@123');
                    setError(null);
                  }}
                  className="text-[11px] py-1.5 px-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded border border-purple-200 font-medium text-center transition"
                >
                  Faculty HOD
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Bulletin Board & Placement Notifications (Side by Side - Screenshot 2 style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Bulletin Board */}
          <div
            id="bulletin-board"
            className="bg-white rounded-lg border-t-4 border-t-sky-400 border-x border-b border-slate-200 shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-serif font-bold text-[#1e3a8a] tracking-tight">
                Bulletin Board
              </h3>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Official Updates
              </span>
            </div>

            <div className="space-y-5 flex-1">
              {bulletinNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="flex items-start space-x-3.5 group cursor-pointer"
                >
                  {/* Sky blue bullet dot */}
                  <span className="mt-1.5 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-sky-100 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#1e40af] transition leading-snug">
                      {notice.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[11px] font-bold text-slate-500">
                        {notice.date}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-[#db2777] font-medium hover:underline">
                        View Notice
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Placement Notifications */}
          <div
            id="placement-notifications"
            className="bg-white rounded-lg border-t-4 border-t-sky-400 border-x border-b border-slate-200 shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-serif font-bold text-[#1e3a8a] tracking-tight">
                Placement Notifications
              </h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                T&amp;P Drives
              </span>
            </div>

            <div className="space-y-5 flex-1">
              {placementNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="flex items-start space-x-3.5 group cursor-pointer"
                >
                  {/* Sky blue bullet dot */}
                  <span className="mt-1.5 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-sky-100 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#1e40af] transition leading-snug">
                        {notice.title}
                      </p>
                    </div>
                    {notice.role && (
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {notice.role}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[11px] font-bold text-slate-500">
                        {notice.date}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-[#db2777] font-medium hover:underline">
                        Eligibility Details
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Examination Notifications & JNTUH Circulars (Two Columns - Screenshot 1 style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Column 1: Examination Notifications */}
          <div id="exam-notifications" className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#1e3a8a] tracking-tight border-b-2 border-slate-200 pb-2">
              Examination Notifications
            </h3>

            <div className="space-y-5">
              {examNotices.map((notice) => (
                <div key={notice.id} className="group">
                  {/* Date Stamp */}
                  <div className="text-xs font-bold text-slate-700 tracking-wide mb-1">
                    {notice.date}
                  </div>
                  {/* Magenta/Pink Clickable Title Link */}
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="text-left text-sm font-semibold text-[#db2777] hover:text-[#be185d] hover:underline leading-relaxed block transition"
                  >
                    {notice.title}
                  </button>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: JNTUH Circulars */}
          <div id="jntuh-circulars" className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[#1e3a8a] tracking-tight border-b-2 border-slate-200 pb-2">
              JNTUH Circulars
            </h3>

            <div className="space-y-5">
              {jntuhCirculars.map((notice) => (
                <div key={notice.id} className="group">
                  {/* Date Stamp */}
                  <div className="text-xs font-bold text-slate-700 tracking-wide mb-1">
                    {notice.date}
                  </div>
                  {/* Magenta/Pink Clickable Title Link */}
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="text-left text-sm font-semibold text-[#db2777] hover:text-[#be185d] hover:underline leading-relaxed block transition"
                  >
                    {notice.title}
                  </button>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Amber Back to Top Button (Screenshot 1) */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => scrollToSection('top')}
          className="fixed bottom-22 right-6 z-40 p-3 bg-sky-400 hover:bg-sky-300 text-slate-900 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </button>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-[#db2777] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Password Recovery Support
                </h3>
                <p className="text-xs text-slate-500">
                  MLRIT Portal Credentials Assistance
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p>
                <strong>For Students:</strong> Please visit the Examination Branch or
                Department HOD Office in person with your Student ID Card to reset your
                password.
              </p>
              <p>
                <strong>For Faculty:</strong> Contact the IT Cell &amp; Portal Administrator
                at{' '}
                <a
                  href="mailto:admin@mlrit.ac.in"
                  className="text-blue-600 underline font-medium"
                >
                  admin@mlrit.ac.in
                </a>
                .
              </p>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Preloaded Demo Passwords:</span>
                <ul className="mt-1 list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                  <li>Student default password: <code className="bg-white px-1 py-0.5 rounded border">Student@123</code></li>
                  <li>Faculty default password: <code className="bg-white px-1 py-0.5 rounded border">Faculty@123</code></li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-md hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 mb-1">
                <span>{selectedNotice.category}</span>
                <span>•</span>
                <span>{selectedNotice.date}</span>
                {selectedNotice.refNo && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">{selectedNotice.refNo}</span>
                  </>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1e3a8a] leading-snug">
                {selectedNotice.title}
              </h3>
              {selectedNotice.package && (
                <div className="mt-2 inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-800">
                  CTC Package: {selectedNotice.package}
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p>{selectedNotice.description}</p>
            </div>

            <div className="mt-5 flex justify-between items-center text-xs">
              <span className="text-slate-400 italic">
                Office of the Principal, MLRIT Dundigal
              </span>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-[#1e40af] text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional College Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-700 text-sm">
                Marri Laxman Reddy Institute of Technology (MLRIT)
              </p>
              <p className="text-slate-500 mt-0.5">
                Autonomous Institution • Affiliated to JNTUH • Approved by AICTE • Accredited by NBA (Tier-1) &amp; NAAC A++ Grade
              </p>
              <p className="text-slate-400 mt-0.5">
                Dundigal, Gandimaisamma Mandal, Hyderabad - 500043, Telangana, India
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-slate-400">
                Administrative Gateway:{' '}
                <a
                  href="/admin"
                  className="font-semibold text-slate-600 hover:text-[#1e40af] underline"
                >
                  Executive Admin Portal
                </a>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Portal Helpdesk: support@mlrit.ac.in | Phone: +91 08418-204066
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} MLR Institute of Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
