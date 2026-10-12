import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { CreditCard, Plus, Receipt, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminFees: React.FC = () => {
  const [structures, setStructures] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [structureModalOpen, setStructureModalOpen] = useState(false);

  // Collect form state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [amountPaid, setAmountPaid] = useState(50000);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [feeType, setFeeType] = useState('Tuition Fee (Installment 2)');
  const [referenceId, setReferenceId] = useState('');
  const [collectReason, setCollectReason] = useState('Offline fee paid at MLRIT Accounts Desk');

  // Structure form state
  const [dept, setDept] = useState('CSE');
  const [quota, setQuota] = useState('CONVENER');
  const [tuitionFee, setTuitionFee] = useState(100000);
  const [specialFee, setSpecialFee] = useState(10000);
  const [examFee, setExamFee] = useState(5000);
  const [structReason, setStructReason] = useState('Annual revision of fee structure');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFeeData = async () => {
    try {
      const [strRes, payRes, stuRes] = await Promise.all([
        api.get('/admin/fees/structures'),
        api.get('/admin/fees/payments'),
        api.get('/admin/students'),
      ]);
      setStructures(strRes.data);
      setPayments(payRes.data);
      setStudents(stuRes.data);
      if (stuRes.data.length > 0) setSelectedStudentId(stuRes.data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    setSubmitting(true);

    try {
      await api.post('/admin/fees/collect', {
        studentId: selectedStudentId,
        amountPaid: Number(amountPaid),
        paymentMode,
        feeType,
        referenceId: referenceId || 'TXN-' + Date.now(),
        reason: collectReason,
      });

      setSuccessMsg('Fee payment recorded and official receipt generated! Audit log created.');
      setCollectModalOpen(false);
      fetchFeeData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to record fee payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetupStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/admin/fees/structures', {
        academicYear: '2026-27',
        department: dept,
        category: quota,
        tuitionFee: Number(tuitionFee),
        specialFee: Number(specialFee),
        examFee: Number(examFee),
        busFee: 0,
        hostelFee: 0,
        reason: structReason,
      });

      setSuccessMsg('Fee structure updated successfully! Audit log created.');
      setStructureModalOpen(false);
      fetchFeeData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to save fee structure');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Fee Structures &amp; Collection Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure approved fee components, record offline student payments, and audit financial records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStructureModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
          >
            Configure Structure
          </button>
          <button
            onClick={() => setCollectModalOpen(true)}
            className="px-4 py-2 bg-[#800020] hover:bg-[#66001a] text-white text-xs font-semibold rounded-xl flex items-center shadow-xs transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Record Fee Payment
          </button>
        </div>
      </div>

      {/* Mandatory Audit Notice */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3 text-purple-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold">Financial Audit Enforced:</span> Every recorded payment, refund, or fee schedule adjustment
          generates a non-repudiable entry in the <span className="font-semibold underline">Central Audit Log</span> capturing administrator identity,
          transaction amounts, and payment reference numbers.
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Fee Structures Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#800020]" />
            Configured Institutional Fee Schedules (AY 2026-27)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Category Quota</th>
                <th className="px-6 py-3 text-right">Tuition Fee</th>
                <th className="px-6 py-3 text-right">Special Fee</th>
                <th className="px-6 py-3 text-right">Exam Fee</th>
                <th className="px-6 py-3 text-right font-bold">Total Annual Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {structures.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    Dept of {item.department}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">₹{item.tuitionFee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">₹{item.specialFee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">₹{item.examFee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ₹{item.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[#800020]" />
            Fee Collection Receipts Log ({payments.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Receipt No</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Hall Ticket</th>
                <th className="px-6 py-3">Fee Type</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3 text-right">Amount Paid</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                    {p.receiptNo}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {p.student?.user?.fullName}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {p.student?.hallTicketNo}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{p.feeType}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {p.paymentMode} ({p.referenceId || 'N/A'})
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ₹{p.amountPaid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={p.status} type="fee" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      <Modal
        isOpen={collectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        title="Record Student Fee Payment & Generate Receipt"
      >
        <form onSubmit={handleCollectFee} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Student
            </label>
            <select
              value={selectedStudentId || ''}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800020]"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.hallTicketNo} - {s.user?.fullName} ({s.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Amount Paid (INR)
              </label>
              <input
                type="number"
                required
                min={1}
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="NET_BANKING">Net Banking (NEFT/RTGS)</option>
                <option value="CARD">Debit / Credit Card</option>
                <option value="CASH">Cash at Counter</option>
                <option value="CHALLAN">Bank Challan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Fee Type / Description
            </label>
            <input
              type="text"
              required
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Transaction / Bank Reference No
            </label>
            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="e.g. UTR-98213876 or Challan-102"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Reason / Remarks (Mandatory for Audit Log)
            </label>
            <input
              type="text"
              required
              value={collectReason}
              onChange={(e) => setCollectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCollectModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Generate Receipt & Audit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Configure Structure Modal */}
      <Modal
        isOpen={structureModalOpen}
        onClose={() => setStructureModalOpen(false)}
        title="Configure Departmental Fee Structure"
      >
        <form onSubmit={handleSetupStructure} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Department
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <option value="CSE">CSE</option>
                <option value="CSE-AIML">CSE-AIML</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
                <option value="MECH">MECH</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Quota Category
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              >
                <option value="CONVENER">Convener Quota</option>
                <option value="MANAGEMENT">Management Quota</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tuition Fee (INR)
            </label>
            <input
              type="number"
              required
              value={tuitionFee}
              onChange={(e) => setTuitionFee(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Special Fee (INR)
              </label>
              <input
                type="number"
                value={specialFee}
                onChange={(e) => setSpecialFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Exam Fee (INR)
              </label>
              <input
                type="number"
                value={examFee}
                onChange={(e) => setExamFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Audit Reason / Revision Justification
            </label>
            <input
              type="text"
              required
              value={structReason}
              onChange={(e) => setStructReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStructureModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#800020] hover:bg-[#66001a] transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Structure & Audit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
