import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { GraduationCap, Briefcase, ShieldCheck, Lock, AlertCircle, ArrowRight, Eye, EyeOff, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [username, setUsername] = useState('21R21A0501');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'STUDENT') {
      setUsername('21R21A0501');
      setPassword('Student@123');
    } else if (role === 'FACULTY') {
      setUsername('MLRIT-FAC-101');
      setPassword('Faculty@123');
    } else {
      setUsername('admin');
      setPassword('Admin@123');
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
      const msg = err.response?.data?.error || 'Invalid credentials. Please verify your ID and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case 'STUDENT': return 'Hall Ticket Number';
      case 'FACULTY': return 'Employee ID';
      case 'ADMIN': return 'Administrator Username / Email';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (selectedRole) {
      case 'STUDENT': return 'e.g. 21R21A0501';
      case 'FACULTY': return 'e.g. MLRIT-FAC-101';
      case 'ADMIN': return 'e.g. admin or admin@mlrit.ac.in';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-[#4a0012] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* College Emblem Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-[#800020] shadow-xl border-2 border-amber-400 mb-3 font-black text-2xl">
          M
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          MLR Institute of Technology
        </h2>
        <p className="mt-1 text-sm text-amber-200/90 font-medium">
          Integrated LMS &amp; Academic ERP Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('STUDENT')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-1" />
              Student
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('FACULTY')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'FACULTY'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-1" />
              Faculty
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mb-1" />
              Admin
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {getIdentifierLabel()}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={getIdentifierPlaceholder()}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your portal password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#800020] hover:bg-[#66001a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to {selectedRole} Portal</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Footer */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
              Quick Preloaded Test Accounts (Click to Fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('STUDENT');
                  setUsername('21R21A0501');
                  setPassword('Student@123');
                  setError(null);
                }}
                className="text-[11px] py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 font-medium text-center transition"
              >
                Student 1
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('STUDENT');
                  setUsername('24R21A05B7');
                  setPassword('Student@123');
                  setError(null);
                }}
                className="text-[11px] py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 font-medium text-center transition"
              >
                Student (24R..)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('FACULTY');
                  setUsername('MLRIT-FAC-101');
                  setPassword('Faculty@123');
                  setError(null);
                }}
                className="text-[11px] py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 font-medium text-center transition"
              >
                Faculty Demo
              </button>
            </div>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setUsername('admin');
                  setPassword('Admin@123');
                  setError(null);
                }}
                className="w-full text-[11px] py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 font-medium text-center transition"
              >
                Admin Demo (admin / Admin@123)
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          MLRIT Dundigal, Hyderabad - 500043, Telangana • Autonomous JNTUH
        </div>
      </div>
    </div>
  );
};
