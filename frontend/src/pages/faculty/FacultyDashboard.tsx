import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/MetricCard';
import {
  BookOpen,
  Users,
  FileCheck2,
  CalendarCheck2,
  Award,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, classRes] = await Promise.all([
          api.get('/faculty/profile'),
          api.get('/faculty/classes'),
        ]);
        setProfile(profRes.data);
        setClasses(classRes.data);
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl p-6 text-white shadow-md">
        <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-amber-300 mb-2">
          Faculty ID: {profile?.employeeId || user?.username}
        </span>
        <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          {profile?.designation} • Department of {profile?.department} • {profile?.qualification}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Classes"
          value={classes.length}
          subtitle="Active Course Sections"
          icon={Layers}
          color="blue"
        />

        <MetricCard
          title="Academic Year"
          value="2026-27"
          subtitle="Odd Semester Cycle"
          icon={CalendarCheck2}
          color="blue"
        />

        <MetricCard
          title="Department"
          value={profile?.department || 'CSE'}
          subtitle="School of Computing"
          icon={BookOpen}
          color="emerald"
        />

        <MetricCard
          title="Cabin Location"
          value={profile?.cabinNo || 'Ramanujan 204'}
          subtitle="Faculty Chambers"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Allocated Classes Table */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-[#1e3a8a] flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#1e40af]" />
            Assigned Teaching Subjects &amp; Sections
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Course Code</th>
                <th className="px-6 py-3">Course Title</th>
                <th className="px-6 py-3 text-center">Semester</th>
                <th className="px-6 py-3 text-center">Section</th>
                <th className="px-6 py-3 text-center">Credits</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-[#1e40af]">
                    {item.course.code}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.course.title}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    Semester {item.course.semester}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">
                    Section {item.section}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">
                    {item.course.credits}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to="/faculty/lms"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1e40af] text-xs font-semibold text-slate-700 hover:text-[#1e40af] inline-block transition"
                    >
                      LMS Modules
                    </Link>
                    <Link
                      to="/faculty/marks"
                      className="px-3 py-1.5 rounded-lg bg-[#1e40af] hover:bg-[#1d4ed8] text-xs font-semibold text-white inline-block transition"
                    >
                      Enter Marks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
