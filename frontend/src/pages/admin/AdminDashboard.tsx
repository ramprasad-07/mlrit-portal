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
  Target,
  CalendarCheck,
  Award,
  Briefcase,
  Building2,
  CalendarDays,
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const executiveModules = [
    {
      to: '/admin/students',
      title: '1. Student Information System (SIS)',
      description: 'Provision student accounts with Hall Ticket & Password. Real-time Supabase directory.',
      icon: Users,
      badge: '10 Enrolled',
      color: 'border-l-4 border-l-[#1e40af]',
    },
    {
      to: '/admin/faculty',
      title: '2. Faculty Directory & Staffing',
      description: 'Provision faculty accounts with Employee ID & Password. Manage cabins and designations.',
      icon: GraduationCap,
      badge: '10 Faculty',
      color: 'border-l-4 border-l-blue-600',
    },
    {
      to: '/admin/obe',
      title: '3. Academic OBE Management',
      description: 'Program Outcomes (POs), Course Outcomes (COs), and Bloom\'s Taxonomy attainment.',
      icon: Target,
      badge: 'Tier-1 NBA',
      color: 'border-l-4 border-l-purple-600',
    },
    {
      to: '/admin/attendance',
      title: '4. Attendance Tracking & Defaulters',
      description: 'Defaulters list (<75%), condonation band (65-75%), and automated SMS dispatch.',
      icon: CalendarCheck,
      badge: 'Defaulter Alerts',
      color: 'border-l-4 border-l-amber-600',
    },
    {
      to: '/admin/fees',
      title: '5. Fee & Finance Operations',
      description: 'Reconcile institutional fee collection, outstanding dues, and departmental breakdowns.',
      icon: CreditCard,
      badge: 'Fee Dues Matrix',
      color: 'border-l-4 border-l-emerald-600',
    },
    {
      to: '/admin/compliance',
      title: '6. Accreditations & Compliance',
      description: 'NAAC A Grade criteria scores, NBA Tier-1 status, AICTE EoA approvals, and NIRF.',
      icon: Award,
      badge: 'NAAC / NBA',
      color: 'border-l-4 border-l-rose-600',
    },
    {
      to: '/admin/placements',
      title: '7. Placement & Training Cell (PAT)',
      description: 'Drive conversion stats, top recruiters (Amazon, Virtusa, TCS, Epam), and salary packages.',
      icon: Briefcase,
      badge: '860+ Offers',
      color: 'border-l-4 border-l-teal-600',
    },
    {
      to: '/admin/campus',
      title: 'Campus Operations & Estate',
      description: 'Academic block capacity, student hostels (1500 beds), bus fleets, and lab audits.',
      icon: Building2,
      badge: '5 Academic Blocks',
      color: 'border-l-4 border-l-indigo-600',
    },
    {
      to: '/admin/leaves',
      title: 'Faculty Leave Sanctioning',
      description: 'Review and approve/reject Casual, Medical, and On-Duty leaves with audit comments.',
      icon: CalendarDays,
      badge: 'Dean Cell',
      color: 'border-l-4 border-l-sky-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-amber-200 mb-2">
              Executive Administrator Console • Secret Route URL Gateway
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              MLRIT College Portal Central Administration
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Complete autonomous governance across ERP Student Information System, OBE accreditation, Finance, PAT Placements, and Supabase Cloud database.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/admin/students"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center border border-white/20 transition"
            >
              + Provision Student
            </Link>
            <Link
              to="/admin/faculty"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-xs transition"
            >
              + Provision Faculty
            </Link>
          </div>
        </div>
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

      {/* 7 Mandatory Modules Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-[#1e40af]" />
              Executive ERP &amp; Governance Modules
            </h2>
            <p className="text-xs text-slate-500">
              One-click access to all enterprise administrative sub-systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executiveModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                to={mod.to}
                className={`p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition shadow-2xs hover:shadow-xs flex flex-col justify-between ${mod.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      <Icon className="w-4 h-4 text-[#1e40af]" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#1e40af]">
                  <span>Access Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
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
            className="text-xs font-semibold text-[#1e40af] hover:underline"
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
                  &quot;{log.reason}&quot;
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

export default AdminDashboard;
