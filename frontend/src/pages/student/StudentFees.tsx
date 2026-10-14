import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Wallet,
} from 'lucide-react';

interface FeeGatewayItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  badge: string;
  category: string;
}

export const StudentFees: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState<FeeGatewayItem | null>(null);
  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI');
  const [upiId, setUpiId] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  // Receipt Filter Tab
  const [receiptFilter, setReceiptFilter] = useState<'ALL' | 'REGULAR' | 'REVALUATION' | 'CONDONATION' | 'TRANSCRIPT'>('ALL');

  const feeGateways: FeeGatewayItem[] = [
    {
      id: 'regular',
      title: 'Regular Institutional Fee Payment',
      description: 'Annual tuition fee, library, and examination autonomous fee installment clearance.',
      amount: 25000,
      badge: 'Tuition & Special',
      category: 'REGULAR',
    },
    {
      id: 'supply',
      title: 'Supply (Backlog) Fee Payment',
      description: 'Supplementary examination fee per backlog course as prescribed by Examination Cell.',
      amount: 1200,
      badge: 'Backlog Exam',
      category: 'SUPPLY',
    },
    {
      id: 'reval',
      title: 'Revaluation Fee Payment',
      description: 'Evaluation recount and digital script scrutiny fee per theory course.',
      amount: 1000,
      badge: 'Scrutiny',
      category: 'REVALUATION',
    },
    {
      id: 'betterment',
      title: 'Betterment Fee Payment',
      description: 'Internal CIA and external mark betterment examination registration fee.',
      amount: 1500,
      badge: 'Marks Improvement',
      category: 'BETTERMENT',
    },
    {
      id: 'condonation',
      title: 'Condonation Fee Payment',
      description: 'Attendance shortage condonation (65%–74.9%) sanctioned on medical / OD grounds.',
      amount: 3000,
      badge: 'Attendance Condonation',
      category: 'CONDONATION',
    },
    {
      id: 'transcript',
      title: 'Official Transcript Fee Payment',
      description: 'Consolidated marks memos and official JNTUH autonomous transcripts issuance.',
      amount: 800,
      badge: 'Credential Transcripts',
      category: 'TRANSCRIPT',
    },
    {
      id: 'combined',
      title: 'Regular / Supply Combined Fee Payment',
      description: 'Simultaneous registration for regular current semester and pending backlog exams.',
      amount: 3700,
      badge: 'Combined Session',
      category: 'REGULAR',
    },
  ];

  const fetchFees = async () => {
    try {
      const res = await api.get('/student/fees');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const openReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
  };

  const initiatePayment = (item: FeeGatewayItem) => {
    setActivePaymentItem(item);
    setPaymentSuccess(null);
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentItem) return;

    setProcessingPayment(true);
    try {
      const payload = {
        feeType: activePaymentItem.title,
        amount: activePaymentItem.amount,
        paymentMode: paymentMode,
        referenceId: 'UPI-TXN-' + Math.floor(10000000 + Math.random() * 90000000),
      };

      const res = await api.post('/student/fees/pay', payload);
      setPaymentSuccess(res.data);
      // Refresh fee statistics and receipts
      await fetchFees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment processing failed. Please retry.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  const isCleared = data?.isCleared;
  const receiptsList: any[] = data?.receipts || [];

  const filteredReceipts = receiptsList.filter((r) => {
    if (receiptFilter === 'ALL') return true;
    if (receiptFilter === 'REGULAR') return r.feeType?.toLowerCase().includes('regular') || r.feeType?.toLowerCase().includes('tuition');
    if (receiptFilter === 'REVALUATION') return r.feeType?.toLowerCase().includes('revaluation');
    if (receiptFilter === 'CONDONATION') return r.feeType?.toLowerCase().includes('condonation');
    if (receiptFilter === 'TRANSCRIPT') return r.feeType?.toLowerCase().includes('transcript');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-t-4 border-t-sky-400 border-x border-b border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
            Finance &amp; Accounts Branch
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1e3a8a] mt-1">
            Online Fee Section &amp; E-Receipts
          </h1>
          <p className="text-sm text-slate-500">
            Secure multi-gateway payment processing for tuition, exam backlogs, revaluations, and condonations.
          </p>
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Annual Fee
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            ₹{(data?.totalFee || 0).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Institutional Fee Schedule (Autonomous)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Amount Paid
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            ₹{(data?.amountPaid || 0).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Reconciled via Supabase Cloud PostgreSQL</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Outstanding Fee Balance
          </span>
          <div className={`text-3xl font-extrabold mt-2 ${
            isCleared ? 'text-emerald-700' : 'text-sky-600'
          }`}>
            ₹{(data?.feeDues || 0).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center">
            {isCleared ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1" /> All Dues Cleared
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-sky-700">
                <Clock className="w-4 h-4 mr-1" /> Pending Clearance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MODULE 4 PART A: Official Payment Instructions */}
      <div className="p-5 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs space-y-2 text-sky-900">
        <div className="flex items-center space-x-2 font-bold text-sky-950 text-sm">
          <AlertCircle className="w-4 h-4 text-sky-600" />
          <span>Online Fee Payment Guidelines &amp; Statutory Instructions</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>Ensure stable internet connectivity while interacting with payment gateways. Do not refresh or press back during transaction execution.</li>
          <li>Payments processed via UPI (PhonePe, Google Pay, Paytm, BHIM) and Net Banking are credited instantaneously with digital receipt generation.</li>
          <li>For Revaluation and Condonation fees, download and submit the generated e-receipt copy to the Examination Cell within 3 days.</li>
          <li>In case of double deduction, bank reconciliation happens automatically within 48 bank working hours.</li>
        </ul>
      </div>

      {/* MODULE 4 PART B: 7 Online Payment Gateways */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#1e40af]" />
            Select Fee Category to Pay Online
          </h2>
          <span className="text-xs text-slate-500 font-medium">7 Active Payment Portals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeGateways.map((gw) => (
            <div
              key={gw.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#1e40af] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#1e40af] border border-blue-200">
                    {gw.badge}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{gw.amount.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {gw.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {gw.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => initiatePayment(gw)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center justify-center shadow-xs"
                >
                  <Wallet className="w-3.5 h-3.5 mr-1.5" /> Pay ₹{gw.amount.toLocaleString()} Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODULE 4 PART C: Printable E-Receipts Section with 4 Category Views */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-[#1e40af]" />
              Printable E-Receipts Archive
            </h2>
            <p className="text-xs text-slate-500">Official digital receipts verified by MLRIT Finance Department.</p>
          </div>

          {/* 4 Category Receipt Filters */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
            <button
              onClick={() => setReceiptFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${receiptFilter === 'ALL' ? 'bg-white text-[#1e40af] shadow-xs font-bold' : 'text-slate-600'}`}
            >
              All Receipts
            </button>
            <button
              onClick={() => setReceiptFilter('REGULAR')}
              className={`px-3 py-1.5 rounded-lg transition ${receiptFilter === 'REGULAR' ? 'bg-white text-[#1e40af] shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Fee Receipts
            </button>
            <button
              onClick={() => setReceiptFilter('REVALUATION')}
              className={`px-3 py-1.5 rounded-lg transition ${receiptFilter === 'REVALUATION' ? 'bg-white text-[#1e40af] shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Revaluation Receipts
            </button>
            <button
              onClick={() => setReceiptFilter('CONDONATION')}
              className={`px-3 py-1.5 rounded-lg transition ${receiptFilter === 'CONDONATION' ? 'bg-white text-[#1e40af] shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Condonation Receipts
            </button>
            <button
              onClick={() => setReceiptFilter('TRANSCRIPT')}
              className={`px-3 py-1.5 rounded-lg transition ${receiptFilter === 'TRANSCRIPT' ? 'bg-white text-[#1e40af] shadow-xs font-bold' : 'text-slate-600'}`}
            >
              Transcript Receipts
            </button>
          </div>
        </div>

        {filteredReceipts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No receipts found under &quot;{receiptFilter}&quot; category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Receipt Number</th>
                  <th className="py-3 px-4">Fee Category</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Mode / Channel</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">E-Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReceipts.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1e40af]">
                      {rec.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {rec.feeType}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {rec.paymentDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {rec.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{parseFloat(rec.amountPaid).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rec.status || 'SUCCESS'} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openReceipt(rec)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#1e40af] hover:border-[#1e40af] transition inline-flex items-center text-xs font-bold"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" /> View &amp; Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Online Payment Modal */}
      {paymentModalOpen && activePaymentItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#1e40af]" />
              MLRIT Online Payment Gateway
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure 256-bit SSL encrypted academic payment gateway.
            </p>

            {paymentSuccess ? (
              <div className="mt-5 space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">Payment Successful!</h3>
                  <p className="text-xs text-emerald-700">
                    Receipt Generated: <span className="font-mono font-bold">{paymentSuccess.receiptNo}</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Amount: <span className="font-bold">₹{activePaymentItem.amount.toLocaleString()}</span> has been recorded and credited to your account.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setPaymentModalOpen(false);
                      openReceipt(paymentSuccess);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#1e40af] text-white font-bold text-xs flex items-center justify-center"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" /> View Official E-Receipt
                  </button>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="mt-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Payment Category</span>
                  <div className="text-sm font-bold text-slate-900">{activePaymentItem.title}</div>
                  <div className="text-xl font-extrabold text-[#1e40af] font-mono">
                    ₹{activePaymentItem.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Payment Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('ONLINE_UPI')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        paymentMode === 'ONLINE_UPI' ? 'border-[#1e40af] bg-blue-50 text-[#1e40af] border border-blue-200' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('CARD')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        paymentMode === 'CARD' ? 'border-[#1e40af] bg-blue-50 text-[#1e40af] border border-blue-200' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Debit / Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('NET_BANKING')}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        paymentMode === 'NET_BANKING' ? 'border-[#1e40af] bg-blue-50 text-[#1e40af] border border-blue-200' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Net Banking
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI ID / Virtual Payment Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9849012345@paytm or student@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1e40af] focus:border-transparent outline-none font-mono"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="px-5 py-2 rounded-xl bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-bold transition shadow-xs flex items-center"
                  >
                    {processingPayment ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Authorizing...
                      </>
                    ) : (
                      `Confirm & Pay ₹${activePaymentItem.amount.toLocaleString()}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Printable E-Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Official Academic Fee E-Receipt"
        maxWidth="xl"
      >
        {selectedReceipt && (
          <div className="space-y-6 text-xs text-slate-800">
            {/* College Header */}
            <div className="text-center border-b pb-4 border-slate-200">
              <div className="text-lg font-extrabold text-[#1e40af] uppercase tracking-wide">
                MLR Institute of Technology
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Autonomous JNTUH • Dundigal, Hyderabad - 500043
              </div>
              <div className="text-xs font-bold uppercase mt-2 px-3 py-1 bg-slate-100 inline-block rounded-md text-slate-700">
                Official E-Receipt for Fee Clearance
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Receipt Number</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{selectedReceipt.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Payment Date</span>
                <span className="font-bold text-slate-900 font-mono">{selectedReceipt.paymentDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Hall Ticket No</span>
                <span className="font-bold text-slate-900 font-mono">{data?.hallTicketNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Fee Type</span>
                <span className="font-bold text-slate-900">{selectedReceipt.feeType}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Payment Mode</span>
                <span className="font-bold text-slate-900">{selectedReceipt.paymentMode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Transaction Ref</span>
                <span className="font-bold text-slate-900 font-mono">{selectedReceipt.referenceId || 'BANK-REF-9921'}</span>
              </div>
            </div>

            {/* Total Paid Row */}
            <div className="p-4 bg-[#1e40af]/10 border border-[#1e40af]/20 rounded-xl flex items-center justify-between">
              <span className="font-bold text-[#1e40af] text-sm">Total Amount Received</span>
              <span className="font-black text-xl font-mono text-[#1e40af]">
                ₹{parseFloat(selectedReceipt.amountPaid).toLocaleString()}
              </span>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Digitally Verified &amp; Reconciled
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">Finance Officer</span>
                <span>MLRIT Accounts Desk</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#1e40af] text-white hover:bg-[#1d4ed8] font-bold text-xs flex items-center"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print E-Receipt
              </button>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentFees;
