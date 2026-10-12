import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';
import {
  Users,
  GraduationCap,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, logRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/audit-logs'),
        ]);
        setStats(statRes.data);
        setAuditLogs(logRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-purple-950 via-slate-900 to-[#5c0017] rounded-2xl p-6 text-white shadow-md">
        <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-amber-300 mb-2">
          Administrator Console • System Level Access
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          MLRIT College Portal Administration
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Full management of students, faculty, academics, finance &amp; fee structures, notices, and exam results.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtitle="Enrolled Across Branches"
          icon={Users}
          color="maroon"
        />

        <MetricCard
          title="Faculty Members"
          value={stats?.totalFaculty || 0}
          subtitle="Teaching &amp; Department Leads"
          icon={GraduationCap}
          color="blue"
        />

        <MetricCard
          title="Total Fees Collected"
          value={`₹${(stats?.totalFeesCollected || 0).toLocaleString()}`}
          subtitle="Current Academic Cycle"
          icon={CreditCard}
          color="emerald"
        />

        <MetricCard
          title="Audit Trail Logs"
          value={stats?.totalAuditLogs || 0}
          subtitle="Immutable Security Events"
          icon={ShieldAlert}
          color="purple"
        />
      </div>

      {/* Quick Administration Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Administrative Workflows &amp; Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/fees"
            className="p-4 rounded-xl border border-slate-200 hover:border-[#800020] bg-slate-50/50 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-[#800020]/10 text-[#800020]">
                <CreditCard className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#800020] transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fee Collection &amp; Structure</h3>
            <p className="text-xs text-slate-500 mt-1">
              Record bank/counter payments, generate receipts, and manage departmental fee schedules.
            </p>
          </Link>

          <Link
            to="/admin/results"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-700 bg-slate-50/50 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Publish Examination Results</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review and toggle public release of Mid-1, Mid-2, or Semester End evaluation sheets.
            </p>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-700 bg-slate-50/50 hover:bg-slate-50 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Audit Trail Explorer</h3>
            <p className="text-xs text-slate-500 mt-1">
              Inspect before/after diffs of every marks revision and financial transaction.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Audit Activities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-purple-700" />
            Live Audit Stream (Latest Modifications)
          </h2>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-[#800020] hover:underline"
          >
            View Full Trail &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                    {log.entityType}
                  </span>
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    By {log.actorUsername} ({log.actorRole})
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic">
                  "{log.reason}"
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-mono block">
                  IP: {log.ipAddress}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
