import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  AlertCircle,
} from 'lucide-react';

export const AdminCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'naac' | 'nba' | 'aicte' | 'nirf'>('naac');

  const naacCriteria = [
    { criterion: 'Criterion 1', title: 'Curricular Aspects', score: '3.75 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 2', title: 'Teaching-Learning and Evaluation', score: '3.82 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 3', title: 'Research, Innovations and Extension', score: '3.60 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 4', title: 'Infrastructure and Learning Resources', score: '3.90 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 5', title: 'Student Support and Progression', score: '3.70 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 6', title: 'Governance, Leadership and Management', score: '3.65 / 4.0', status: 'COMPLETED' },
    { criterion: 'Criterion 7', title: 'Institutional Values and Best Practices', score: '3.85 / 4.0', status: 'COMPLETED' },
  ];

  const nbaPrograms = [
    { program: 'B.Tech Computer Science & Engineering', tier: 'Tier-1 (Autonomous)', validity: '2024 – 2030 (6 Years)', status: 'ACCREDITED' },
    { program: 'B.Tech Electronics & Communication Engineering', tier: 'Tier-1 (Autonomous)', validity: '2023 – 2029 (6 Years)', status: 'ACCREDITED' },
    { program: 'B.Tech Mechanical Engineering', tier: 'Tier-1 (Autonomous)', validity: '2022 – 2028 (6 Years)', status: 'ACCREDITED' },
    { program: 'B.Tech Civil Engineering', tier: 'Tier-1 (Autonomous)', validity: '2023 – 2026 (3 Years)', status: 'ACCREDITED' },
    { program: 'B.Tech Artificial Intelligence & Machine Learning', tier: 'Tier-1 (Autonomous)', validity: 'SAR Submitted', status: 'IN_EVALUATION' },
  ];

  const aicteApprovals = [
    { document: 'AICTE Extension of Approval (EoA) 2026-27', reference: 'F.No. South-Central/1-992817291/2026/EOA', sanctionedIntake: 1320, date: '15-May-2026' },
    { document: 'JNTUH Autonomous Affiliation Letter', reference: 'JNTUH/EB/Autonomous/MLRIT/2026', sanctionedIntake: 1320, date: '22-Jun-2026' },
    { document: 'UGC Autonomous Conferment Extension', reference: 'UGC/F.22-1/2024(AC)', sanctionedIntake: 1320, date: '10-Jul-2024' },
    { document: 'Mandatory Disclosure Document (AICTE)', reference: 'MLRIT-AICTE-DISCLOSURE-2026', sanctionedIntake: 1320, date: '01-Jan-2026' },
  ];

  const nirfMetrics = [
    { category: 'Teaching, Learning & Resources (TLR)', score: '68.4 / 100', weight: '30%' },
    { category: 'Research and Professional Practice (RPC)', score: '42.1 / 100', weight: '30%' },
    { category: 'Graduation Outcomes (GO)', score: '78.9 / 100', weight: '20%' },
    { category: 'Outreach and Inclusivity (OI)', score: '62.5 / 100', weight: '10%' },
    { category: 'Perception (PR)', score: '55.0 / 100', weight: '10%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Quality Assurance &amp; Statutory Accreditations
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Accreditations &amp; Institutional Compliance
          </h1>
          <p className="text-sm text-slate-500">
            NAAC Grade A status, NBA Tier-1 program accreditation, AICTE statutory sanctions, and NIRF rankings.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl gap-1 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('naac')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'naac' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            NAAC (A Grade)
          </button>
          <button
            onClick={() => setActiveTab('nba')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'nba' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            NBA Tier-1
          </button>
          <button
            onClick={() => setActiveTab('aicte')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'aicte' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            AICTE / UGC
          </button>
          <button
            onClick={() => setActiveTab('nirf')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'nirf' ? 'bg-white text-[#1e40af] shadow-xs' : 'text-slate-600'}`}
          >
            NIRF Metrics
          </button>
        </div>
      </div>

      {activeTab === 'naac' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#1e40af]" />
                National Assessment and Accreditation Council (NAAC) Grade A
              </h2>
              <p className="text-xs text-slate-500">Cumulative CGPA: 3.75 / 4.0 (Cycle-2)</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Valid until 2029
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {naacCriteria.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1e40af] uppercase block">{c.criterion}</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{c.title}</span>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  {c.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nba' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-[#1e40af]" />
              National Board of Accreditation (NBA Tier-1 Autonomous)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Undergraduate Program</th>
                  <th className="py-3 px-4">Accreditation Tier</th>
                  <th className="py-3 px-4">Validity Period</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {nbaPrograms.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.program}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.tier}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{p.validity}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'aicte' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-[#1e40af]" />
            AICTE &amp; UGC Statutory Approval Orders
          </h2>
          <div className="space-y-3 text-xs">
            {aicteApprovals.map((doc, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{doc.document}</h3>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">Ref: {doc.reference} • Date: {doc.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold font-mono">
                    Intake: {doc.sanctionedIntake} Seats
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nirf' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#1e40af]" />
            National Institutional Ranking Framework (NIRF Data Summary)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {nirfMetrics.map((m, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-slate-500 font-medium block">{m.category}</span>
                <div className="text-2xl font-black text-[#1e40af] font-mono">{m.score}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Weightage: {m.weight}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompliance;
