import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Modal } from '../../components/Modal';
import { ShieldAlert, Search, Filter, Eye, RefreshCw, ArrowRight } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Diff viewer modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const openDiffViewer = (log: any) => {
    setSelectedLog(log);
    setDiffModalOpen(true);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesEntity = selectedEntity === 'ALL' || log.entityType === selectedEntity;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      log.actorUsername.toLowerCase().includes(q) ||
      log.reason?.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q);
    return matchesEntity && matchesQuery;
  });

  const getEntityBadgeStyle = (entity: string) => {
    switch (entity) {
      case 'MARKS': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'FEE_PAYMENT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FEE_STRUCTURE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESULT_PUBLISH': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'USER_MANAGEMENT': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Security &amp; Institutional Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident system log tracking every mark entry, grade change, and financial transaction.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Logs
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex space-x-1.5 overflow-x-auto pb-1">
          {['ALL', 'MARKS', 'FEE_PAYMENT', 'FEE_STRUCTURE', 'RESULT_PUBLISH', 'USER_MANAGEMENT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedEntity(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedEntity === tab
                  ? 'bg-[#1e40af] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-purple-700" />
            Audit Records ({filteredLogs.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e40af]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor (ID &amp; Role)</th>
                  <th className="px-6 py-3">Entity Domain</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Reason / Justification</th>
                  <th className="px-6 py-3">Client IP</th>
                  <th className="px-6 py-3 text-right">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No audit events match your selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{log.actorUsername}</div>
                        <span className="text-[10px] font-semibold uppercase text-slate-500">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getEntityBadgeStyle(log.entityType)}`}>
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {log.action} (ID: #{log.entityId})
                      </td>
                      <td className="px-6 py-4 max-w-xs text-slate-600 truncate italic">
                        "{log.reason}"
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDiffViewer(log)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-purple-600 hover:text-purple-700 text-xs font-semibold text-slate-700 inline-flex items-center transition"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Diff
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diff Inspector Modal */}
      <Modal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        title={`Audit Entry #${selectedLog?.id} Details`}
        maxWidth="xl"
      >
        {selectedLog && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">ACTOR</span>
                <span className="font-bold text-slate-800">
                  {selectedLog.actorUsername} ({selectedLog.actorRole})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">ENTITY &amp; TARGET ID</span>
                <span className="font-bold text-slate-800">
                  {selectedLog.entityType} (Record #{selectedLog.entityId})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">ACTION</span>
                <span className="font-bold text-slate-800">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">CLIENT IP &amp; DATE</span>
                <span className="font-mono text-slate-700">
                  {selectedLog.ipAddress} • {selectedLog.createdAt}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold">Logged Rationale:</span> "{selectedLog.reason}"
            </div>

            {/* Before vs After Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Previous State (Before Change)
                </h4>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
                  {selectedLog.oldValue || 'null (Creation)'}
                </pre>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  New State (After Change)
                </h4>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
                  {selectedLog.newValue || 'null'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDiffModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
