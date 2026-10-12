import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { CreditCard, Receipt, CheckCircle2, Clock, Printer, Download } from 'lucide-react';

export const StudentFees: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
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
    fetchFees();
  }, []);

  const openReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#800020]" />
      </div>
    );
  }

  const isCleared = data?.isCleared;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Fee Dues &amp; Payment Receipts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Annual institutional fee balances, bank transaction records, and official e-receipts.
        </p>
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
          <p className="text-xs text-slate-500 mt-1">Govt. Convener Quota Fee Schedule</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Amount Paid
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            ₹{(data?.amountPaid || 0).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Verified via Accounts Department</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Outstanding Fee Balance
          </span>
          <div className={`text-3xl font-extrabold mt-2 ${
            isCleared ? 'text-emerald-700' : 'text-amber-600'
          }`}>
            ₹{(data?.feeDues || 0).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center">
            {isCleared ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1" /> All Dues Cleared
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700">
                <Clock className="w-4 h-4 mr-1" /> Pending Clearance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[#800020]" />
            Official Payment History &amp; Receipts
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Receipt Number</th>
                <th className="px-6 py-3">Payment Date</th>
                <th className="px-6 py-3">Description / Fee Type</th>
                <th className="px-6 py-3">Payment Mode</th>
                <th className="px-6 py-3 text-right">Amount Paid</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.receipts?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                data?.receipts?.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#800020]">
                      {rec.receiptNo}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(rec.paymentDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {rec.feeType}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {rec.paymentMode} ({rec.referenceId || 'N/A'})
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{rec.amountPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={rec.status} type="fee" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openReceipt(rec)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#800020] text-xs font-semibold text-slate-700 hover:text-[#800020] inline-flex items-center transition"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="MLR Institute of Technology - E-Receipt"
        maxWidth="lg"
      >
        {selectedReceipt && (
          <div className="space-y-6 text-slate-800">
            {/* Institution Letterhead */}
            <div className="text-center border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-[#800020] uppercase tracking-wide">
                MLR Institute of Technology
              </h2>
              <p className="text-xs text-slate-500">
                Dundigal, Hyderabad - 500043, Telangana • Autonomous Institution
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                FEE PAYMENT ACKNOWLEDGEMENT RECEIPT
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">RECEIPT NO</span>
                <span className="font-mono font-bold text-[#800020] text-sm">
                  {selectedReceipt.receiptNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold block">PAYMENT DATE</span>
                <span className="font-bold text-slate-800">
                  {selectedReceipt.paymentDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">HALL TICKET NO</span>
                <span className="font-bold text-slate-800 font-mono">
                  {data?.hallTicketNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold block">PAYMENT METHOD</span>
                <span className="font-bold text-slate-800">
                  {selectedReceipt.paymentMode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">FEE DESCRIPTION</span>
                <span className="font-medium text-slate-800">
                  {selectedReceipt.feeType}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-semibold block">TRANSACTION REF</span>
                <span className="font-mono text-slate-600">
                  {selectedReceipt.referenceId}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Total Amount Paid
              </span>
              <span className="text-2xl font-black text-[#800020]">
                ₹{selectedReceipt.amountPaid.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              <span>Status: Verified &amp; Cleared</span>
              <span>Computer Generated E-Receipt</span>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#800020] text-white rounded-lg text-xs font-semibold flex items-center hover:bg-[#66001a] transition"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
