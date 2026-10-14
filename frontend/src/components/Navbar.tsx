import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FACULTY':
        return 'bg-blue-50 text-[#1e40af] border-blue-200';
      case 'STUDENT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white text-slate-800 border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Institutional Branding */}
          <div className="flex items-center space-x-3">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#1e40af] text-white flex items-center justify-center font-black text-xl shadow-xs">
                M
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm sm:text-base font-bold text-[#1e40af] tracking-wide leading-tight">
                  MLRIT STUDENT MANAGEMENT PORTAL
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Marri Laxman Reddy Institute of Technology • Autonomous JNTUH
                </p>
              </div>
              <div className="sm:hidden font-bold text-sm text-[#1e40af] tracking-tight">
                MLRIT PORTAL
              </div>
            </div>
          </div>

          {/* Right: Academic Year, User Info, Notifications & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
              AY 2026-27
            </span>

            {user && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 leading-none">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-end space-x-1.5">
                    <span className="font-mono text-[11px]">{user.username}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadgeColor()}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1e40af] flex items-center justify-center border border-blue-200 shadow-xs">
                  <UserIcon className="w-5 h-5" />
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors focus:outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline text-xs font-semibold">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
