import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Building,
  UserCheck,
  Shield,
  HelpCircle,
  Clock,
  Send,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface ContactOfficer {
  role: string;
  name: string;
  designation: string;
  cabin: string;
  email: string;
  phone: string;
  timings: string;
  department?: string;
}

export const StudentContact: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Academic Grievance');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const officers: ContactOfficer[] = [
    {
      role: 'Principal & Head of Institution',
      name: 'Dr. K. Srinivas Rao',
      designation: 'Principal & Professor of CSE, Ph.D. IIT Madras',
      cabin: 'Administrative Block, Ground Floor, Room 101',
      email: 'principal@mlrit.ac.in',
      phone: '+91 98490 12345',
      timings: '10:00 AM – 04:30 PM (Mon - Sat)',
    },
    {
      role: 'Dean of Academic Affairs',
      name: 'Dr. M. Suresh',
      designation: 'Dean Academics & OBE Chairman, Ph.D. NIT Warangal',
      cabin: 'Ramanujan Block, 2nd Floor, Room 204',
      email: 'dean.academics@mlrit.ac.in',
      phone: '+91 98490 23456',
      timings: '10:30 AM – 04:00 PM (Mon - Sat)',
    },
    {
      role: 'Controller of Examinations (COE)',
      name: 'Dr. B. Ramanjaneyulu',
      designation: 'Controller of Examinations & Autonomous Cell Chief',
      cabin: 'Examination Branch, Visvesvaraya Block, 1st Floor',
      email: 'coe@mlrit.ac.in',
      phone: '+91 98490 34567',
      timings: '09:30 AM – 05:00 PM (Mon - Sat)',
    },
    {
      role: 'Head of Computer Science & Engineering (HOD)',
      name: 'Dr. Ch. Anusha',
      designation: 'Professor & HOD (CSE & CSE-AIML)',
      cabin: 'Aryabhata Block, 3rd Floor, HOD Chamber',
      email: 'hod.cse@mlrit.ac.in',
      phone: '+91 98490 45678',
      timings: '10:00 AM – 04:30 PM (Mon - Sat)',
    },
    {
      role: 'Chief Accounts Officer & Fee Section',
      name: 'Sri. P. Venkat Reddy',
      designation: 'Finance Controller & Fee Reconciliation Desk',
      cabin: 'Accounts Section, Admin Block, Counter 3',
      email: 'accounts@mlrit.ac.in',
      phone: '+91 98490 56789',
      timings: '09:00 AM – 04:00 PM (Bank Working Days)',
    },
    {
      role: 'Student Grievance & Anti-Ragging Cell',
      name: 'Dr. T. Vijay Kumar',
      designation: 'Nodal Grievance Officer & Student Welfare Dean',
      cabin: 'Student Welfare Center, Kalam Block, Room 102',
      email: 'grievance@mlrit.ac.in',
      phone: '+91 98490 67890',
      timings: '24x7 Emergency Helpline / 10 AM – 5 PM',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Helpdesk &amp; Institution Leadership
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Contact College Authorities &amp; Grievance Redressal
          </h1>
          <p className="text-sm text-slate-500">
            Reach out directly to MLRIT executive leadership, department chiefs, examination officials, and student support helplines.
          </p>
        </div>
      </div>

      {/* Authority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((officer, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
                  {officer.role}
                </span>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {officer.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {officer.designation}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-start text-slate-600">
                  <MapPin className="w-3.5 h-3.5 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span>{officer.cabin}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Clock className="w-3.5 h-3.5 mr-2 text-slate-400 flex-shrink-0" />
                  <span>{officer.timings}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`mailto:${officer.email}`}
                className="flex-1 flex items-center justify-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#1e40af] hover:text-white text-slate-700 text-xs font-bold transition border border-slate-200"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
              </a>
              <a
                href={`tel:${officer.phone}`}
                className="flex-1 flex items-center justify-center py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Online Grievance Submission Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e40af] border border-blue-200 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Submit Direct Grievance / In-Portal Query
            </h2>
            <p className="text-xs text-slate-500">
              Official institutional ticket logged directly into the Dean &amp; Grievance Cell tracking portal.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Grievance Ticket Submitted Successfully!</span>
              <p className="text-xs text-emerald-700 mt-0.5">
                Ticket #GRV-2026-8812 has been dispatched to Dean Academics &amp; HOD. Resolution will be sent to your registered college email.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grievance Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none"
                >
                  <option value="Academic Grievance">Academic &amp; Evaluation Inquiry</option>
                  <option value="Attendance Discrepancy">Attendance Calculation Discrepancy</option>
                  <option value="Fee & Payment Clearance">Online Fee &amp; E-Receipt Clearance</option>
                  <option value="Hall Ticket & Exam Hall">Hall Ticket &amp; Room Seating Issue</option>
                  <option value="Hostel & Transport">Campus Bus &amp; Hostel Facilities</option>
                  <option value="General Administration">General Administrative Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-1 marks discrepancy in CS503PC"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Grievance Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide specific details, course codes, dates, and prior faculty interactions..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5 mr-2" /> Submit Grievance Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentContact;
