import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Building2,
  Award,
  CheckCircle2,
  Users,
  Search,
  Download,
} from 'lucide-react';

export const AdminPlacements: React.FC = () => {
  const [selectedDriveYear, setSelectedDriveYear] = useState('2025-26');

  const topRecruiters = [
    { company: 'Amazon AWS', offers: 24, highestPackage: '₹44.0 LPA', avgPackage: '₹28.5 LPA', role: 'Software Development Engineer (SDE-1)' },
    { company: 'EPAM Systems', offers: 68, highestPackage: '₹14.5 LPA', avgPackage: '₹12.0 LPA', role: 'Junior Software Engineer' },
    { company: 'Virtusa Consulting', offers: 142, highestPackage: '₹12.0 LPA', avgPackage: '₹8.5 LPA', role: 'Associate Engineer - Full Stack' },
    { company: 'Tata Consultancy Services (TCS)', offers: 210, highestPackage: '₹9.0 LPA', avgPackage: '₹7.2 LPA', role: 'Digital & Ninja Cadre' },
    { company: 'Cognizant (CTS)', offers: 125, highestPackage: '₹8.5 LPA', avgPackage: '₹6.5 LPA', role: 'Programmer Analyst Trainee' },
    { company: 'Capgemini', offers: 94, highestPackage: '₹7.5 LPA', avgPackage: '₹5.5 LPA', role: 'Senior Analyst' },
  ];

  const branchPlacements = [
    { branch: 'Computer Science & Engineering (CSE)', eligible: 240, placed: 228, percentage: '95.0%', highest: '₹44.0 LPA', avg: '₹8.8 LPA' },
    { branch: 'CSE (AI & Machine Learning)', eligible: 120, placed: 114, percentage: '95.0%', highest: '₹32.0 LPA', avg: '₹9.2 LPA' },
    { branch: 'Electronics & Communication (ECE)', eligible: 180, placed: 158, percentage: '87.8%', highest: '₹18.0 LPA', avg: '₹6.8 LPA' },
    { branch: 'Mechanical Engineering (MECH)', eligible: 60, placed: 48, percentage: '80.0%', highest: '₹9.5 LPA', avg: '₹5.2 LPA' },
    { branch: 'Civil Engineering (CIVIL)', eligible: 60, placed: 44, percentage: '73.3%', highest: '₹7.0 LPA', avg: '₹4.8 LPA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Career Development &amp; Corporate Relations
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Placement &amp; Training Cell (PAT) Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Campus recruitment drives, offer letters, package distributions, and marquee hiring partners.
          </p>
        </div>

        <select
          value={selectedDriveYear}
          onChange={(e) => setSelectedDriveYear(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 self-start md:self-auto outline-none"
        >
          <option value="2025-26">Academic Batch 2025-26</option>
          <option value="2024-25">Academic Batch 2024-25</option>
        </select>
      </div>

      {/* Highlights Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Offers Issued</span>
          <div className="text-3xl font-extrabold text-[#1e40af] mt-1 font-mono">
            860+ <span className="text-xs text-slate-400 font-normal">Offers</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">91.4% Overall Campus Placed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Highest Package</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
            ₹44.0 <span className="text-xs text-slate-400 font-normal">LPA (Amazon)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">International / Tier-1 MNC</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Package</span>
          <div className="text-3xl font-extrabold text-blue-700 mt-1 font-mono">
            ₹7.8 <span className="text-xs text-slate-400 font-normal">LPA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">18% YoY Growth over 2024</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Recruiters</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            140+ <span className="text-xs text-slate-400 font-normal">Companies</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Product, Fintech &amp; IT Service</p>
        </div>
      </div>

      {/* Top Recruiters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-[#1e40af]" />
            Marquee Recruiters &amp; Drive Statistics (Amazon, Virtusa, TCS, Epam)
          </h2>
          <span className="text-xs text-slate-500 font-medium">Campus Drives</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Recruiting Organization</th>
                <th className="py-3 px-4">Job Designation</th>
                <th className="py-3 px-3 text-center">Offers Issued</th>
                <th className="py-3 px-3 text-center">Highest Package</th>
                <th className="py-3 px-3 text-center">Average Package</th>
                <th className="py-3 px-4">Offer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {topRecruiters.map((rec, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{rec.company}</td>
                  <td className="py-3.5 px-4 text-slate-600">{rec.role}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">{rec.offers}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-black text-[#1e40af]">{rec.highestPackage}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">{rec.avgPackage}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      LOI Dispatched
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Wise Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#1e40af]" />
            Department-Wise Placement Conversion Summary
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-3 text-center">Eligible</th>
                <th className="py-3 px-3 text-center">Placed</th>
                <th className="py-3 px-3 text-center">Conversion %</th>
                <th className="py-3 px-3 text-center">Highest Package</th>
                <th className="py-3 px-3 text-center">Average Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {branchPlacements.map((bp, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{bp.branch}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-600">{bp.eligible}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">{bp.placed}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-700 text-sm">{bp.percentage}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-[#1e40af]">{bp.highest}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-700">{bp.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlacements;
