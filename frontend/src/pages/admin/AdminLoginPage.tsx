import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Building2,
  Home,
  CheckCircle2,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(username.trim(), password.trim(), 'ADMIN');
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        setError('Access denied: Admin privileges required.');
      }
    } catch (err: any) {
      if (!err.response) {
        setError(
          '⚠️ Backend server is not running on port 8080! Please run "start-portal.bat" or start Spring Boot backend.'
        );
      } else {
        const msg =
          err.response?.data?.error ||
          'Invalid administrator credentials. Access restricted.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1e40af] text-white flex items-center justify-center font-black text-xl shadow-xs">
              M
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-[#1e40af] tracking-wide block leading-tight">
                MLRIT STUDENT MANAGEMENT PORTAL
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Executive Administration &amp; Academic ERP Gateway
              </span>
            </div>
          </div>

          <a
            href="/login"
            className="flex items-center text-xs font-semibold text-slate-600 hover:text-[#1e40af] bg-slate-50 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-lg transition"
          >
            <Home className="w-4 h-4 mr-1.5 text-[#1e40af]" />
            <span>Public Login</span>
          </a>
        </div>
      </header>

      {/* Main Admin Login Card Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg border-t-4 border-t-sky-400 border-x border-b border-slate-200 shadow-md p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 mb-3 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1e3a8a] tracking-tight">
              Executive Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Restricted Officer Gateway • Dean &amp; Controller of Examinations
            </p>
          </div>

          <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center font-medium">
              <Building2 className="w-4 h-4 mr-1 text-[#1e40af]" />
              Institutional Management
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[10px] font-bold">
              ROLE: ADMIN
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Administrator Identifier / Email
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
                  placeholder="admin or admin@mlrit.ac.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Executive Security Key / Password
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
                  placeholder="Enter administrator password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#1e40af] hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-md shadow-sm transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </form>

          {/* Helper Preload link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('Admin@123');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              Auto-Fill Demo Admin Credentials (admin / Admin@123)
            </button>
            <div>
              <a
                href="/login"
                className="text-xs text-slate-500 hover:text-[#1e40af] hover:underline transition"
              >
                ← Return to Student &amp; Faculty Portal
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        MLRIT Autonomous JNTUH • Executive Administration Security Gateway
      </footer>
    </div>
  );
};
