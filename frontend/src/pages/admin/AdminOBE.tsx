import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Target,
  BarChart3,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const AdminOBE: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('CSE');

  const programOutcomes = [
    { id: 'PO1', title: 'Engineering Knowledge', target: 2.5, attainment: 2.68, status: 'ATTAINED' },
    { id: 'PO2', title: 'Problem Analysis', target: 2.5, attainment: 2.54, status: 'ATTAINED' },
    { id: 'PO3', title: 'Design/Development of Solutions', target: 2.5, attainment: 2.62, status: 'ATTAINED' },
    { id: 'PO4', title: 'Conduct Investigations of Complex Problems', target: 2.5, attainment: 2.45, status: 'NEAR_TARGET' },
    { id: 'PO5', title: 'Modern Tool Usage', target: 2.5, attainment: 2.85, status: 'ATTAINED' },
    { id: 'PO6', title: 'The Engineer and Society', target: 2.5, attainment: 2.51, status: 'ATTAINED' },
    { id: 'PO7', title: 'Environment and Sustainability', target: 2.5, attainment: 2.60, status: 'ATTAINED' },
    { id: 'PO8', title: 'Ethics', target: 2.5, attainment: 2.90, status: 'ATTAINED' },
    { id: 'PO9', title: 'Individual and Team Work', target: 2.5, attainment: 2.75, status: 'ATTAINED' },
    { id: 'PO10', title: 'Communication', target: 2.5, attainment: 2.80, status: 'ATTAINED' },
    { id: 'PO11', title: 'Project Management and Finance', target: 2.5, attainment: 2.58, status: 'ATTAINED' },
    { id: 'PO12', title: 'Life-long Learning', target: 2.5, attainment: 2.70, status: 'ATTAINED' },
  ];

  const bloomsTaxonomy = [
    { level: 'L1: Remember', share: '15%', color: 'bg-blue-500' },
    { level: 'L2: Understand', share: '25%', color: 'bg-emerald-500' },
    { level: 'L3: Apply', share: '30%', color: 'bg-amber-500' },
    { level: 'L4: Analyze', share: '18%', color: 'bg-purple-500' },
    { level: 'L5: Evaluate', share: '8%', color: 'bg-indigo-500' },
    { level: 'L6: Create', share: '4%', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            NBA Accreditation &amp; Academic OBE Cell
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Outcome-Based Education (OBE) Management
          </h1>
          <p className="text-sm text-slate-500">
            Mapping Program Outcomes (POs), Course Outcomes (COs), and Bloom&apos;s Taxonomy attainments.
          </p>
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 self-start md:self-auto outline-none"
        >
          <option value="CSE">Department of CSE</option>
          <option value="CSE-AIML">Department of CSE-AIML</option>
          <option value="ECE">Department of ECE</option>
          <option value="MECH">Department of MECH</option>
          <option value="CIVIL">Department of CIVIL</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Overall PO Attainment</span>
          <div className="text-3xl font-extrabold text-[#1e40af] mt-2 font-mono">
            88.4% <span className="text-xs text-slate-400 font-normal">/ 100%</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">11 of 12 POs Met Target (&gt;2.5 / 3.0)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">NBA SAR Status</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2 flex items-center">
            <CheckCircle2 className="w-6 h-6 mr-1.5" /> Compliant (Tier-1)
          </div>
          <p className="text-xs text-slate-500 mt-1">Accredited for 6 Years cycle</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500">Course Articulation Matrix</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            100% <span className="text-xs text-slate-400 font-normal">Mapped</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">All 48 autonomous courses verified</p>
        </div>
      </div>

      {/* Program Outcomes Attainment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-[#1e40af]" />
            Program Outcomes (POs) Attainment Status ({selectedDept})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Criterion 3 (NBA)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO Code</th>
                <th className="py-3 px-4">Graduate Attribute / Description</th>
                <th className="py-3 px-3 text-center">Target (3.0)</th>
                <th className="py-3 px-3 text-center">Achieved Attainment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {programOutcomes.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#1e40af]">{po.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{po.title}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">{po.target}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{po.attainment}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        po.status === 'ATTAINED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bloom's Taxonomy Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-[#1e40af]" />
          Question Paper Cognitive Levels (Bloom&apos;s Taxonomy Distribution)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {bloomsTaxonomy.map((b, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-center">
              <span className="text-[11px] font-bold text-slate-600 block">{b.level}</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">{b.share}</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`${b.color} h-full`} style={{ width: b.share }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOBE;
