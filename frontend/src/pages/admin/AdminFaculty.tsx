import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export const AdminFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await api.get('/admin/faculty');
        setFaculty(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Faculty Directory &amp; Academic Staff
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registered faculty profiles, departments, teaching designations, and office cabin locations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-[#800020]" />
            Faculty Members ({faculty.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Faculty Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Qualification</th>
                <th className="px-6 py-3">Cabin Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faculty.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                    {item.employeeId}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>{item.user?.fullName}</div>
                    <div className="text-xs text-slate-400 font-normal flex items-center mt-0.5">
                      <Mail className="w-3 h-3 mr-1" />
                      {item.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Dept of {item.department}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.designation}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.qualification}
                  </td>
                  <td className="px-6 py-4 text-slate-600 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#800020]" />
                    {item.cabinNo || 'Ramanujan Block'}
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
