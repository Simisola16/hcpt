import React, { useState } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  ArrowRight,
  ShieldAlert,
  FileCheck2
} from 'lucide-react';
import { RenewalRecord } from '../../../types/certification';

interface RenewalsModuleProps {
  renewals: RenewalRecord[];
}

export const RenewalsModule: React.FC<RenewalsModuleProps> = ({ renewals }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDispatchNotice = (certNo: string, orgName: string) => {
    setFeedback(`Automated Surveillance Notice dispatched to ${orgName} for certificate ${certNo}. Outstanding document checklist transmitted.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Annual Surveillance & Renewal Operations
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Proactive monitoring of approaching expirations, annual surveillance audits, and outstanding evidentiary deliverables.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Expiry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
          <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
            Critical Expiry (&lt; 30 Days)
          </div>
          <div className="text-3xl font-extrabold text-rose-900">
            {renewals.filter((r) => r.daysRemaining <= 30).length}
          </div>
          <div className="text-[11px] text-rose-700">Immediate action required</div>
        </div>

        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            Surveillance Window (30 - 90 Days)
          </div>
          <div className="text-3xl font-extrabold text-amber-900">
            {renewals.filter((r) => r.daysRemaining > 30 && r.daysRemaining <= 90).length}
          </div>
          <div className="text-[11px] text-amber-700">Audit scheduling in progress</div>
        </div>

        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            Compliant & Healthy
          </div>
          <div className="text-3xl font-extrabold text-emerald-900">
            92%
          </div>
          <div className="text-[11px] text-emerald-700">Average renewal retention rate</div>
        </div>
      </div>

      {/* Renewals Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Certificates Nearing Expiry Schedule
          </span>
          <span className="text-[11px] text-slate-500">
            Automated notifications active (90, 60, 30 days)
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {renewals.map((r) => (
            <div key={r.id} className="p-5 space-y-3 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{r.organizationName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Certificate: {r.certificateNumber} • Current Expiry: <strong className="text-slate-800">{r.currentExpiryDate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.daysRemaining <= 15
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {r.daysRemaining} Days Remaining
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {r.status}
                  </span>
                </div>
              </div>

              {/* Outstanding Requirements List */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Outstanding Renewal Deliverables
                </div>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {r.outstandingRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Last Notice: {r.lastNoticeSent || 'Automated dispatch pending'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDispatchNotice(r.certificateNumber, r.organizationName)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#006837] text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Surveillance Notice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
