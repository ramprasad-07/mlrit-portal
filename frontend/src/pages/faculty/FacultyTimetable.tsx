import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const FacultyTimetable: React.FC = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, profRes] = await Promise.all([
          api.get('/faculty/timetable'),
          api.get('/faculty/profile'),
        ]);
        setTimetable(ttRes.data);
        setProfile(profRes.data);
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

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const groupedByDay = days.reduce((acc: any, day) => {
    acc[day] = timetable.filter((slot) => slot.dayOfWeek === day);
    return acc;
  }, {});

  const totalWeeklyPeriods = timetable.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Academic Workload &amp; Class Schedule
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Faculty Teaching Timetable &amp; Room Allotment
          </h1>
          <p className="text-sm text-slate-500">
            Personal daily and weekly lecture schedule, laboratory batches, assigned courses, and classroom rooms.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Weekly Teaching Load</span>
            <span className="text-sm font-black text-[#1e40af] font-mono">{totalWeeklyPeriods} Periods / Week</span>
          </div>
          <span className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Faculty Cabin</span>
            <span className="text-xs font-bold text-slate-800">{profile?.cabinNo || 'Ramanujan 204'}</span>
          </div>
        </div>
      </div>

      {/* Day by Day Cards */}
      <div className="space-y-4">
        {days.map((day) => {
          const slots = groupedByDay[day] || [];
          if (slots.length === 0) return null;

          return (
            <div
              key={day}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-[#1e40af]" />
                  {day}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {slots.length} Lectures &amp; Labs Scheduled
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1e40af] border border-blue-200 text-xs font-mono font-bold">
                        {slot.course?.code}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {slot.course?.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-200/60">
                      <span className="flex items-center font-bold text-slate-700">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {slot.department} • Sem {slot.semester} (Sec {slot.section})
                      </span>
                      <span className="flex items-center font-bold text-[#1e40af]">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#1e40af]" />
                        {slot.roomNo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyTimetable;
