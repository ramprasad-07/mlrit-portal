import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { CalendarDays, Clock, MapPin, User as UserIcon } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/student/timetable');
        setTimetable(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const groupedByDay = days.reduce((acc: any, day) => {
    acc[day] = timetable.filter((slot) => slot.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Weekly Academic Timetable
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lecture schedules, laboratory periods, classroom locations, and course instructors.
        </p>
      </div>

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
                  <CalendarDays className="w-4 h-4 mr-2 text-[#800020]" />
                  {day}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {slots.length} Classes Scheduled
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020] text-xs font-mono font-bold">
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

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center truncate">
                        <UserIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {slot.faculty?.user?.fullName || 'Faculty'}
                      </span>
                      <span className="flex items-center font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#800020]" />
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
