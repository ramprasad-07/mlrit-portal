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
          { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
          { to: '/student/courses', label: 'Courses & LMS', icon: BookOpen },
          { to: '/student/assignments', label: 'Assignments', icon: FileCheck2 },
          { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck2 },
          { to: '/student/marks', label: 'Marks & CGPA', icon: GraduationCap },
          { to: '/student/fees', label: 'Fees & Receipts', icon: CreditCard },
          { to: '/student/timetable', label: 'Timetable', icon: CalendarDays },
        ];
      case 'FACULTY':
        return [
          { to: '/faculty', label: 'Overview', icon: LayoutDashboard, end: true },
          { to: '/faculty/lms', label: 'LMS Content & Notes', icon: BookOpen },
          { to: '/faculty/assignments', label: 'Assignments & Grading', icon: FileCheck2 },
          { to: '/faculty/marks', label: 'Enter Mid Marks', icon: FileSpreadsheet },
          { to: '/faculty/attendance', label: 'Mark Attendance', icon: CalendarCheck2 },
        ];
      case 'ADMIN':
        return [
          { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
          { to: '/admin/students', label: 'Students Directory', icon: Users },
          { to: '/admin/faculty', label: 'Faculty Directory', icon: GraduationCap },
          { to: '/admin/fees', label: 'Fee Collection', icon: CreditCard },
          { to: '/admin/results', label: 'Publish Results', icon: CheckCircle2 },
          { to: '/admin/notices', label: 'College Notices', icon: Megaphone },
          { to: '/admin/audit-logs', label: 'Audit Trail Logs', icon: ShieldAlert },
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
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0 -translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-sm">
              M
            </span>
            <span className="font-bold text-white text-sm">MLRIT Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tag */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            {user?.role} PORTAL
          </div>
          <div className="text-xs text-slate-400 truncate mt-0.5">
            {user?.fullName}
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#800020] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          MLRIT Autonomous System &copy; 2026
        </div>
      </aside>
    </>
  );
};
