import React, { useState } from 'react';
import {
  Building2,
  Bus,
  Home,
  Cpu,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const AdminCampus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'hostels' | 'transport' | 'labs'>('infrastructure');

  const blocks = [
    { name: 'Ramanujan Academic Block', floors: 'G + 4 Floors', departments: 'CSE & Information Technology', classrooms: 32, labs: 8, status: 'OPERATIONAL' },
    { name: 'Aryabhata Computing Block', floors: 'G + 4 Floors', departments: 'CSE (AI & Machine Learning), Data Science', classrooms: 24, labs: 6, status: 'OPERATIONAL' },
    { name: 'Visvesvaraya Engineering Block', floors: 'G + 4 Floors', departments: 'Electronics & Communication (ECE)', classrooms: 28, labs: 10, status: 'OPERATIONAL' },
    { name: 'Kalam Mechanical & Civil Block', floors: 'G + 3 Floors', departments: 'Mechanical & Civil Engineering, Workshop', classrooms: 20, labs: 12, status: 'OPERATIONAL' },
    { name: 'Dr. C.V. Raman Auditorium & Innovation Arena', floors: '2 Floors', departments: 'Central Convention, Incubation Cell, Hackathon Labs', classrooms: 4, labs: 4, status: 'OPERATIONAL' },
  ];

  const hostels = [
    { hostel: 'Boys Hostel Block - A (Visvesvaraya)', capacity: 450, occupied: 412, warden: 'Prof. K. Sandeep', phone: '+91 98480 88901', status: 'AVAILABLE' },
    { hostel: 'Boys Hostel Block - B (Kalam)', capacity: 350, occupied: 340, warden: 'Prof. V. Mahesh', phone: '+91 98480 88902', status: 'AVAILABLE' },
    { hostel: 'Girls Hostel Block - A (Gargi)', capacity: 400, occupied: 388, warden: 'Prof. P. Radhika', phone: '+91 98480 88903', status: 'AVAILABLE' },
    { hostel: 'Girls Hostel Block - B (Maitreyi)', capacity: 300, occupied: 295, warden: 'Prof. S. Lavanya', phone: '+91 98480 88904', status: 'AVAILABLE' },
  ];

  const busRoutes = [
    { routeNo: 'Route 1', fromLocation: 'Kukatpally / KPHB', stops: 'JNTU, Nizampet X Roads, Pragathi Nagar, Gandimaisamma', busNumber: 'TS 08 UB 4501', driverName: 'M. Yadagiri', driverPhone: '9848055001' },
    { routeNo: 'Route 2', fromLocation: 'Secunderabad / ECIL', stops: 'Tarnaka, Habsiguda, Balanagar, Jeedimetla, Dundigal', busNumber: 'TS 08 UB 4502', driverName: 'K. Narsing Rao', driverPhone: '9848055002' },
    { routeNo: 'Route 3', fromLocation: 'Dilsukhnagar / LB Nagar', stops: 'Malakpet, Koti, Lakdikapul, Moosapet, MLRIT', busNumber: 'TS 08 UB 4503', driverName: 'P. Srinivas', driverPhone: '9848055003' },
    { routeNo: 'Route 4', fromLocation: 'Mehdipatnam / Gachibowli', stops: 'Tolichowki, Kondapur, Miyapur, Bachupally, Dundigal', busNumber: 'TS 08 UB 4504', driverName: 'S. Ramulu', driverPhone: '9848055004' },
    { routeNo: 'Route 5', fromLocation: 'Medchal / Kompally', stops: 'Suchitra, Dulapally, Bahadurpally, MLRIT Campus', busNumber: 'TS 08 UB 4505', driverName: 'B. Krishna', driverPhone: '9848055005' },
  ];

  const labsAudit = [
    { labName: 'Advanced Cloud & Full-Stack Lab', location: 'Ramanujan 301', systems: 70, configuration: 'Core i7, 32GB RAM, 1TB NVMe, Dual Displays', lastAudit: '12-Sep-2026', safetyStatus: 'PASSED' },
    { labName: 'AI & GPU Deep Learning Lab', location: 'Aryabhata 204', systems: 60, configuration: 'NVIDIA RTX 4080 GPUs, 64GB RAM, Linux OS', lastAudit: '18-Sep-2026', safetyStatus: 'PASSED' },
    { labName: 'VLSI & Embedded Systems Design Lab', location: 'Visvesvaraya 108', systems: 45, configuration: 'Cadence EDA Suite, Xilinx FPGA Kits', lastAudit: '05-Sep-2026', safetyStatus: 'PASSED' },
    { labName: 'Robotics & CNC Machining Workshop', location: 'Kalam Ground Floor', systems: 30, configuration: 'KUKA Industrial Robotic Arm, 3-Axis CNC', lastAudit: '20-Sep-2026', safetyStatus: 'PASSED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Estate Management &amp; Campus Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Campus Operations &amp; Infrastructure
          </h1>
          <p className="text-sm text-slate-500">
            Academic block capacities, residential hostels, college bus fleets, and laboratory safety compliance.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl gap-1 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'infrastructure' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setActiveTab('hostels')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'hostels' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            Hostels (1500 Beds)
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'transport' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            Bus Fleet (5 Routes)
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'labs' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            Lab Safety Audits
          </button>
        </div>
      </div>

      {activeTab === 'infrastructure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blocks.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1e40af] font-mono">{b.floors}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {b.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{b.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{b.departments}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{b.classrooms} Smart Classrooms</span>
                <span>{b.labs} Specialized Laboratories</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'hostels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hostels.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                  Residential Hall
                </span>
                <span className="text-xs font-bold text-emerald-700">{h.status}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{h.hostel}</h3>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Occupancy</span>
                  <span className="font-bold text-slate-900">{h.occupied} / {h.capacity} Residents</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Chief Warden</span>
                  <span className="font-bold text-slate-900">{h.warden}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono">Warden Helpline: {h.phone}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transport' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Bus className="w-5 h-5 mr-2 text-[#1e40af]" />
              MLRIT College Transit Fleet &amp; Metropolitan Routes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Route ID</th>
                  <th className="py-3 px-4">Origin Hub</th>
                  <th className="py-3 px-4">Key Boarding Stages</th>
                  <th className="py-3 px-4">Vehicle Number</th>
                  <th className="py-3 px-4">Driver &amp; Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {busRoutes.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1e40af]">{r.routeNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.fromLocation}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{r.stops}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{r.busNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{r.driverName}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{r.driverPhone}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-[#1e40af]" />
            Laboratories Audit &amp; Technical Equipment Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {labsAudit.map((lab, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1e40af]">{lab.location}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {lab.safetyStatus}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{lab.labName}</h3>
                <p className="text-slate-600 font-mono text-[11px]">{lab.configuration}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500">
                  <span>Capacity: {lab.systems} Workstations</span>
                  <span>Audited on: {lab.lastAudit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampus;
