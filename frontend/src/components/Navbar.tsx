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
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FACULTY': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STUDENT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#800020] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & Institutional Branding */}
          <div className="flex items-center space-x-3">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-[#800020] text-lg shadow-sm border border-amber-300">
                M
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold tracking-tight leading-tight">
                  MLR INSTITUTE OF TECHNOLOGY
                </h1>
                <p className="text-xs text-amber-200 font-medium tracking-wide">
                  Autonomous Institution • NAAC 'A' Grade • NBA Accredited
                </p>
              </div>
              <div className="sm:hidden font-bold text-sm tracking-tight">
                MLRIT PORTAL
              </div>
            </div>
          </div>

          {/* Right: Academic Year, User Info, Notifications & Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-amber-200 border border-white/20">
              AY 2026-27
            </span>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold leading-none">{user.fullName}</div>
                  <div className="text-xs text-slate-200 mt-1 flex items-center justify-end space-x-1.5">
                    <span>{user.username}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${getRoleBadgeColor()}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                  <UserIcon className="w-5 h-5" />
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="flex items-center space-x-1 p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline text-xs font-medium">Logout</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
