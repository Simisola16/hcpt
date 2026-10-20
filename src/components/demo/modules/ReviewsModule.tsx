import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageSquare,
  Award,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { CertificationApplication } from '../../../types/certification';
import { demoStore } from '../../../services/demoStore';

interface ReviewsModuleProps {
  applications: CertificationApplication[];
  onSelectApplication: (id: string) => void;
}

export const ReviewsModule: React.FC<ReviewsModuleProps> = ({
  applications,
  onSelectApplication
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [decisionType, setDecisionType] = useState<'Approve' | 'RFI' | 'Reject'>('Approve');
  const [decisionComments, setDecisionComments] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handleRecordComplianceDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;

    if (decisionType === 'Approve') {
      const res = demoStore.updateApplicationStatus(
        activeApp.id,
        'Approved',
        `Compliance approval recorded by Supervisory Committee: ${decisionComments || 'All statutory requirements satisfied.'}`,
        'Supervisory Review Committee'
      );
      if (res.success) {
        setFeedback(`Compliance Approval recorded for ${activeApp.referenceNumber}. Application is now eligible for certificate issuance.`);
      } else {
        setFeedback(res.message);
      }
    } else if (decisionType === 'RFI') {
      demoStore.requestMissingInfo(
        activeApp.id,
        ['Assessor Correction Notice'],
        decisionComments || 'Applicant clarification required prior to technical signoff.',
        'Technical Committee'
      );
      setFeedback(`Deficiency notice dispatched for ${activeApp.referenceNumber}. Status set to Awaiting Applicant Information.`);
    } else {
      demoStore.updateApplicationStatus(
        activeApp.id,
        'Rejected',
        `Application rejected by committee: ${decisionComments || 'Non-compliance with halal critical control points.'}`,
        'Supervisory Review Committee'
      );
      setFeedback(`Application ${activeApp.referenceNumber} has been rejected.`);
    }

    setDecisionComments('');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Review & Compliance Approval Committee Gate
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute preliminary triage, technical Shariah/scientific evaluation, and formal compliance decisions.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Triage Queue & Formal Decision Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Applications in Review */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-200">
            Dossiers in Review Queue ({applications.length})
          </div>

          <div className="space-y-2">
            {applications.map((app) => {
              const isSelected = app.id === activeApp?.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#006837] bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {app.referenceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-900'
                          : app.status === 'Technical Review'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {app.organizationName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {app.category} • {app.products.length} products
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Dossier Decision Gate */}
        {activeApp && (
          <div className="lg:col-span-7 card-enterprise rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Dossier Under Review
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeApp.organizationName}
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  Ref: {activeApp.referenceNumber} • Status: {activeApp.status}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectApplication(activeApp.id)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Inspect Full Dossier
              </button>
            </div>

            {/* Checklist items summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Pre-Decision Verification Checklist
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ingredient bills of materials verified ({activeApp.products.length} items)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mandatory documents attached ({activeApp.documents.length} exhibits approved or reviewed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Field inspection status: {activeApp.inspectionId ? 'Scheduled / Concluded' : 'Pending Scheduling'}
                  </span>
                </div>
              </div>
            </div>

            {/* Formal Decision Form */}
            <form onSubmit={handleRecordComplianceDecision} className="space-y-4 pt-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Record Formal Compliance Decision
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                    decisionType === 'Approve'
                      ? 'border-[#006837] bg-emerald-50 text-[#006837] font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="Approve"
                    checked={decisionType === 'Approve'}
                    onChange={() => setDecisionType('Approve')}
                    className="sr-only"
                  />
                  <div className="text-xs">Approve Compliance</div>
                </label>

                <label
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                    decisionType === 'RFI'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="RFI"
                    checked={decisionType === 'RFI'}
                    onChange={() => setDecisionType('RFI')}
                    className="sr-only"
                  />
                  <div className="text-xs">Request Info (RFI)</div>
                </label>

                <label
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                    decisionType === 'Reject'
                      ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="Reject"
                    checked={decisionType === 'Reject'}
                    onChange={() => setDecisionType('Reject')}
                    className="sr-only"
                  />
                  <div className="text-xs">Reject File</div>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Committee Deliberation & Justification Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={decisionComments}
                  onChange={(e) => setDecisionComments(e.target.value)}
                  placeholder="Record justification, Shariah board quorum consensus, or specific corrective actions required..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#006837] text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Commit Compliance Decision to Ledger
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
};
