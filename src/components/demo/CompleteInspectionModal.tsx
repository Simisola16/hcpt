import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Building,
  UserCheck
} from 'lucide-react';
import { InspectionRecord } from '../../types/certification';
import { demoStore } from '../../services/demoStore';

interface CompleteInspectionModalProps {
  inspection: InspectionRecord | null;
  onClose: () => void;
  onCompleted: () => void;
}

export const CompleteInspectionModal: React.FC<CompleteInspectionModalProps> = ({
  inspection,
  onClose,
  onCompleted
}) => {
  const [outcome, setOutcome] = useState<InspectionRecord['outcome']>('Compliant / Recommended');
  const [findings, setFindings] = useState(
    'Physical segregation of certified lines confirmed. CIP sanitation logs examined and validated compliant with halal standards. Traceability sample batch passed reconciliation test.'
  );
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      inspection?.checklist.forEach(c => {
        initial[c.id] = true;
      });
      return initial;
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!inspection) return null;

  const toggleCheck = (id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      demoStore.completeInspection(inspection.id, outcome, findings);
      onCompleted();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Record Field Inspection Findings & Outcome
              </h3>
              <p className="text-xs text-slate-400">
                Audit Ref: {inspection.inspectionRef} | Facility: {inspection.facilityName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Facility Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-800 font-semibold">
              <span>{inspection.organizationName}</span>
              <span className="font-mono text-slate-500">{inspection.applicationRef}</span>
            </div>
            <div className="text-slate-600">
              Facility: {inspection.facilityName} ({inspection.facilityAddress})
            </div>
            <div className="text-emerald-800 font-medium">
              Lead Auditor: {inspection.assignedInspector} ({inspection.scheduledDate})
            </div>
          </div>

          {/* Checklist Verification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              On-Site Audit Checklist Verification
            </label>
            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto">
              {inspection.checklist.map((item) => {
                const verified = checklistState[item.id] ?? false;
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-colors text-xs ${
                      verified ? 'bg-white border border-emerald-200 text-slate-900' : 'text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={verified}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 leading-snug">
                      <span>{item.criterion}</span>
                      <span className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {item.severity}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Outcome Radio Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Formal Audit Recommendation Outcome
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              <label
                className={`p-3 rounded-lg border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  outcome === 'Compliant / Recommended'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Compliant</span>
                </div>
                <span className="text-[11px] font-normal text-slate-600">
                  Recommended for full committee approval.
                </span>
                <input
                  type="radio"
                  name="outcome"
                  value="Compliant / Recommended"
                  checked={outcome === 'Compliant / Recommended'}
                  onChange={() => setOutcome('Compliant / Recommended')}
                  className="sr-only"
                />
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  outcome === 'Conditional Approval (Minor Non-Conformance)'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conditional</span>
                </div>
                <span className="text-[11px] font-normal text-slate-600">
                  Minor corrective actions required within 30 days.
                </span>
                <input
                  type="radio"
                  name="outcome"
                  value="Conditional Approval (Minor Non-Conformance)"
                  checked={outcome === 'Conditional Approval (Minor Non-Conformance)'}
                  onChange={() => setOutcome('Conditional Approval (Minor Non-Conformance)')}
                  className="sr-only"
                />
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  outcome === 'Non-Compliant'
                    ? 'border-red-600 bg-red-50/80 text-red-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span>Non-Compliant</span>
                </div>
                <span className="text-[11px] font-normal text-slate-600">
                  Critical failure. Return to applicant or reject.
                </span>
                <input
                  type="radio"
                  name="outcome"
                  value="Non-Compliant"
                  checked={outcome === 'Non-Compliant'}
                  onChange={() => setOutcome('Non-Compliant')}
                  className="sr-only"
                />
              </label>

            </div>
          </div>

          {/* Findings Summary Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Auditor Findings & Observations Summary
            </label>
            <textarea
              rows={3}
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit & Conclude Audit</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
