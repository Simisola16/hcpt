import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  MapPin,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  Award
} from 'lucide-react';
import { InspectionRecord, CertificationApplication } from '../../../types/certification';
import { demoStore } from '../../../services/demoStore';
import { ScheduleInspectionModal } from '../ScheduleInspectionModal';

interface InspectionsModuleProps {
  inspections: InspectionRecord[];
  applications: CertificationApplication[];
  onSelectApplication: (id: string) => void;
}

export const InspectionsModule: React.FC<InspectionsModuleProps> = ({
  inspections,
  applications,
  onSelectApplication
}) => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(inspections[0]?.id || '');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeInspection = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];

  const handleRecordOutcome = (outcome: InspectionRecord['outcome']) => {
    if (!activeInspection) return;

    demoStore.completeInspection(
      activeInspection.id,
      outcome,
      outcomeNotes || 'On-site audit completed. Compliance checklist fully executed.'
    );

    setFeedback(`Inspection outcome recorded as "${outcome}". Application state updated.`);
    setOutcomeNotes('');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            On-Site Field Inspection Coordination
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit scheduling, auditor credentials, standardized checklists, and non-conformance remediation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScheduleModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006837] text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Field Audit</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Master / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Inspections List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-200">
            Inspection Schedules ({inspections.length})
          </div>

          <div className="space-y-2">
            {inspections.map((insp) => {
              const isSelected = insp.id === activeInspection?.id;
              return (
                <div
                  key={insp.id}
                  onClick={() => setSelectedInspectionId(insp.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#006837] bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {insp.inspectionRef}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        insp.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {insp.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {insp.organizationName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {insp.facilityName}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {insp.scheduledDate}
                    </span>
                    <span>{insp.assignedInspector.split(' ')[1] || insp.assignedInspector}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Inspection Detail & Checklist */}
        {activeInspection && (
          <div className="lg:col-span-7 card-enterprise rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            
            {/* Header */}
            <div className="pb-4 border-b border-slate-200 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                  Field Assessment Audit File
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeInspection.organizationName}
                </h3>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  Ref: {activeInspection.inspectionRef} • Application: {activeInspection.applicationRef}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeInspection.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-purple-100 text-purple-900'
                }`}
              >
                {activeInspection.status}
              </span>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Scheduled Window</span>
                <div className="font-bold text-slate-900">{activeInspection.scheduledDate}</div>
                <div className="text-slate-500">{activeInspection.scheduledTime}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Assessor</span>
                <div className="font-bold text-slate-900">{activeInspection.assignedInspector}</div>
                <div className="text-slate-500">{activeInspection.inspectorCredentials}</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider pb-1">
                <span>Standardized Verification Checklist</span>
                <span className="text-slate-500 text-[11px] font-normal">
                  {activeInspection.checklist.length} Gates Checked
                </span>
              </div>

              <div className="space-y-2">
                {activeInspection.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-start gap-3 text-xs"
                  >
                    {item.verified ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 leading-snug">
                        {item.criterion}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        Severity: <span className={item.severity === 'Critical' ? 'text-rose-600' : 'text-slate-600'}>{item.severity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings & Outcome Recording */}
            {activeInspection.status !== 'Completed' ? (
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Record Audit Conclusion & Recommendations
                </div>

                <textarea
                  rows={2}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="Record summary of physical observations, clean-in-place swab verification, and recommended decision..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleRecordOutcome('Compliant / Recommended')}
                    className="px-4 py-2 bg-[#006837] text-white rounded font-bold text-xs hover:bg-emerald-700"
                  >
                    Recommend Compliance Approval
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecordOutcome('Conditional Approval (Minor Non-Conformance)')}
                    className="px-4 py-2 bg-amber-700 text-white rounded font-bold text-xs hover:bg-amber-800"
                  >
                    Conditional Conformance (Fix Required)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold uppercase text-[10px] tracking-wider text-emerald-800">
                  Audit Concluded & Filed
                </div>
                <div>Outcome: <strong className="font-bold">{activeInspection.outcome}</strong></div>
                {activeInspection.findingsSummary && (
                  <div className="text-emerald-900 text-[11px] pt-1 leading-relaxed">
                    Findings: {activeInspection.findingsSummary}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Modal */}
      <ScheduleInspectionModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        applications={applications}
        onInspectionScheduled={(id) => {
          setSelectedInspectionId(id);
          setScheduleModalOpen(false);
        }}
      />

    </div>
  );
};
