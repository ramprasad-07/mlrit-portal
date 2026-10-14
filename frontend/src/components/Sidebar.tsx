import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  CalendarCheck2,
  GraduationCap,
  CreditCard,
  CalendarDays,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  Megaphone,
  CheckCircle2,
  X,
  Target,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Download,
  Phone,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { to: '/student', label: '1. Basic Info & Home', icon: LayoutDashboard, end: true },
          { to: '/student/academic', label: '2. Academic Info', icon: Calendar },
          { to: '/student/timetable', label: '3. Exam Timetable', icon: CalendarDays },
          { to: '/student/fees', label: '4. Online Fees & Receipts', icon: CreditCard },
          { to: '/student/marks', label: '5. Mark Details & CGPA', icon: GraduationCap },
          { to: '/student/downloads', label: '6. Document Downloads', icon: Download },
          { to: '/student/contact', label: '7. Contact Us Helpline', icon: Phone },
          { to: '/student/courses', label: 'Courses & LMS Notes', icon: BookOpen },
          { to: '/student/assignments', label: 'Assignments', icon: FileCheck2 },
          { to: '/student/attendance', label: 'Attendance Record', icon: CalendarCheck2 },
        ];
      case 'FACULTY':
        return [
          { to: '/faculty', label: 'Faculty Overview', icon: LayoutDashboard, end: true },
          { to: '/faculty/attendance', label: '1. Mark Attendance', icon: CalendarCheck2 },
          { to: '/faculty/marks', label: '2. Internal Marks & CIA', icon: FileSpreadsheet },
          { to: '/faculty/timetable', label: '3. Timetable & Workload', icon: CalendarDays },
          { to: '/faculty/leaves', label: '4. Leave Management', icon: Calendar },
          { to: '/faculty/students', label: '5. Student Profiles', icon: Users },
          { to: '/faculty/lms', label: '6. Course Materials & Notes', icon: BookOpen },
          { to: '/faculty/assignments', label: 'Assignments & Grading', icon: FileCheck2 },
        ];
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard, end: true },
          { to: '/admin/students', label: '1. SIS Students Provisioning', icon: Users },
          { to: '/admin/faculty', label: '2. Faculty Directory', icon: GraduationCap },
          { to: '/admin/obe', label: '3. Academic OBE & NBA', icon: Target },
          { to: '/admin/attendance', label: '4. Defaulters Tracking', icon: CalendarCheck2 },
          { to: '/admin/fees', label: '5. Fee & Finance Desk', icon: CreditCard },
          { to: '/admin/compliance', label: '6. Accreditations & NAAC', icon: Award },
          { to: '/admin/placements', label: '7. PAT Placements Cell', icon: Briefcase },
          { to: '/admin/campus', label: 'Campus Operations', icon: Building2 },
          { to: '/admin/leaves', label: 'Staff Leaves Approval', icon: CalendarDays },
          { to: '/admin/results', label: 'Publish Results', icon: CheckCircle2 },
          { to: '/admin/notices', label: 'College Notices', icon: Megaphone },
          { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-700 border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-sm flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-[#1e40af] text-white flex items-center justify-center font-bold text-sm">
              M
            </span>
            <span className="font-bold text-[#1e40af] text-sm">MLRIT Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tag */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e40af]">
              {user?.role} PORTAL
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {user?.fullName}
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#1e40af] border-l-4 border-[#1e40af] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#1e40af]'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 text-center">
          MLRIT Autonomous • JNTUH Affiliated
        </div>
      </aside>
    </>
  );
};
