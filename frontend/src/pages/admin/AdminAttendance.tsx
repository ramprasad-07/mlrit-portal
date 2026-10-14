import React, { useState } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  Phone,
  Users,
  Search,
  FileSpreadsheet,
} from 'lucide-react';

interface DefaulterStudent {
  rollNo: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  attendancePercentage: number;
  attended: number;
  total: number;
  parentPhone: string;
  status: 'CONDONATION_BAND' | 'DETENTION_RISK';
}

export const AdminAttendance: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'CONDONATION' | 'DETENTION'>('ALL');
  const [sentAlerts, setSentAlerts] = useState<Record<string, boolean>>({});
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState<string | null>(null);

  const defaulters: DefaulterStudent[] = [
    {
      rollNo: '23R21A0301',
      name: 'Karthik Naidu',
      department: 'MECH',
      semester: 3,
      section: 'A',
      attendancePercentage: 68.5,
      attended: 164,
      total: 240,
      parentPhone: '9848011223',
      status: 'CONDONATION_BAND',
    },
    {
      rollNo: '23R21A0302',
      name: 'Rohit Goud',
      department: 'MECH',
      semester: 3,
      section: 'B',
      attendancePercentage: 71.2,
      attended: 171,
      total: 240,
      parentPhone: '9848022334',
      status: 'CONDONATION_BAND',
    },
    {
      rollNo: '24R21A0599',
      name: 'P. Sai Teja',
      department: 'CSE',
      semester: 3,
      section: 'C',
      attendancePercentage: 61.5,
      attended: 147,
      total: 240,
      parentPhone: '9848033445',
      status: 'DETENTION_RISK',
    },
    {
      rollNo: '22R21A0419',
      name: 'V. Rithvik',
      department: 'ECE',
      semester: 5,
      section: 'A',
      attendancePercentage: 58.0,
      attended: 139,
      total: 240,
      parentPhone: '9848044556',
      status: 'DETENTION_RISK',
    },
  ];

  const handleSendSms = (roll: string) => {
    setSentAlerts((prev) => ({ ...prev, [roll]: true }));
  };

  const handleBroadcastAll = () => {
    setBroadcasting(true);
    setTimeout(() => {
      const all: Record<string, boolean> = {};
      defaulters.forEach((d) => (all[d.rollNo] = true));
      setSentAlerts(all);
      setBroadcasting(false);
      setBroadcastMsg('Automated SMS & Portal Circular dispatched to parents of all short attendance defaulters!');
      setTimeout(() => setBroadcastMsg(null), 5000);
    }, 1200);
  };

  const filtered = defaulters.filter((d) => {
    if (filter === 'CONDONATION') return d.status === 'CONDONATION_BAND';
    if (filter === 'DETENTION') return d.status === 'DETENTION_RISK';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-sky-100 text-sky-800">
            Attendance Monitoring &amp; Defaulter Cell
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Defaulters &amp; Condonation Band Tracking (&lt;75%)
          </h1>
          <p className="text-sm text-slate-500">
            Identifies students below mandatory attendance threshold with automated parent SMS notifications.
          </p>
        </div>

        <button
          onClick={handleBroadcastAll}
          disabled={broadcasting}
          className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center shadow-xs self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {broadcasting ? 'Dispatching SMS...' : 'Broadcast SMS Alert to All Parents'}
        </button>
      </div>

      {broadcastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{broadcastMsg}</span>
        </div>
      )}

      {/* Threshold Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Total Defaulters (&lt;75%)</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2 font-mono">
            {defaulters.length} <span className="text-xs text-slate-400 font-normal">Students</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across all B.Tech branches</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Condonation Band (65% – 74.9%)</span>
          <div className="text-3xl font-extrabold text-blue-700 mt-2 font-mono">
            {defaulters.filter((d) => d.status === 'CONDONATION_BAND').length} <span className="text-xs text-slate-400 font-normal">Eligible</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Eligible for condonation on medical / OD fee</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Critical Detention Risk (&lt;65%)</span>
          <div className="text-3xl font-extrabold text-rose-700 mt-2 font-mono">
            {defaulters.filter((d) => d.status === 'DETENTION_RISK').length} <span className="text-xs text-slate-400 font-normal">Students</span>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-1">Detention warning issued</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === 'ALL' ? 'bg-[#1e40af] text-white' : 'bg-white border text-slate-700'}`}
        >
          All Defaulters ({defaulters.length})
        </button>
        <button
          onClick={() => setFilter('CONDONATION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === 'CONDONATION' ? 'bg-[#1e40af] text-white' : 'bg-white border text-slate-700'}`}
        >
          Condonation Band (65%–74.9%)
        </button>
        <button
          onClick={() => setFilter('DETENTION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filter === 'DETENTION' ? 'bg-[#1e40af] text-white' : 'bg-white border text-slate-700'}`}
        >
          Detention Risk (&lt;65%)
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hall Ticket</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Branch &amp; Section</th>
                <th className="py-3 px-3 text-center">Classes Attended</th>
                <th className="py-3 px-3 text-center">Attendance %</th>
                <th className="py-3 px-4">Action Status</th>
                <th className="py-3 px-4">Parent Phone</th>
                <th className="py-3 px-4 text-right">SMS Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((d) => (
                <tr key={d.rollNo} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1e40af]">{d.rollNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3.5 px-4 text-slate-700">{d.department} • Sem {d.semester} ({d.section})</td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-600">{d.attended} / {d.total}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-black text-rose-700 text-sm">
                    {d.attendancePercentage}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'CONDONATION_BAND'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {d.status === 'CONDONATION_BAND' ? 'Condonation Fee Applicable' : 'Detained / Not Eligible'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{d.parentPhone}</td>
                  <td className="py-3.5 px-4 text-right">
                    {sentAlerts[d.rollNo] ? (
                      <span className="text-emerald-700 font-bold inline-flex items-center text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SMS Dispatched
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendSms(d.rollNo)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition shadow-2xs"
                      >
                        Send Parent SMS
                      </button>
                    )}
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

export default AdminAttendance;
