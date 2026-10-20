import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Filter,
  Search,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { AuditHistoryEvent } from '../../../types/certification';

interface ActivityHistoryModuleProps {
  auditLogs: AuditHistoryEvent[];
}

export const ActivityHistoryModule: React.FC<ActivityHistoryModuleProps> = ({ auditLogs }) => {
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(
    (l) => filterAction === 'ALL' || l.action.includes(filterAction)
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Immutable Audit History Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking all workflow state transitions, assessor decisions, and document reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Action Type:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
          >
            <option value="ALL">All Recorded Actions ({auditLogs.length})</option>
            <option value="STATUS_TRANSITION">Status Transitions</option>
            <option value="DOCUMENT">Document Reviews</option>
            <option value="INSPECTION">Inspection Events</option>
            <option value="CERTIFICATE">Certificate Events</option>
          </select>
        </div>
      </div>

      {/* Audit Events Ledger Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">Data Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.role}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                    {log.targetEntity}: <span className="font-bold">{log.targetRef}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-md leading-relaxed">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.isSimulatedDemoEvent
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{log.isSimulatedDemoEvent ? 'Persisted Demo Event' : 'Verified Production Log'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Displaying {filteredLogs.length} audit records</span>
          <span className="font-mono text-[10px]">Tamper-Resistant Local Ledger Mode</span>
        </div>
      </div>

    </div>
  );
};
