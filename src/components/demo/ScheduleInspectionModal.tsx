import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  UserCheck,
  CheckSquare,
  AlertCircle,
  Building,
  ShieldCheck
} from 'lucide-react';
import { CertificationApplication } from '../../types/certification';
import { demoStore } from '../../services/demoStore';

interface ScheduleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: CertificationApplication[];
  preselectedAppId?: string;
  onInspectionScheduled?: (inspectionId: string) => void;
}

const DEFAULT_CHECKLIST = [
  'Raw material receipt segregation & halal supplier certificate verification',
  'Wet/Dry production line cleaning protocols (CIP) & chemical sanitizer validation',
  'Dedicated storage, packaging, and physical barriers against cross-contamination',
  'Clean room air handling, pest exclusion, and storage segregation',
  'Finished product quarantine and end-to-end lot traceability mock recall audit'
];

export const ScheduleInspectionModal: React.FC<ScheduleInspectionModalProps> = ({
  isOpen,
  onClose,
  applications,
  preselectedAppId,
  onInspectionScheduled
}) => {
  const [selectedAppId, setSelectedAppId] = useState(preselectedAppId || (applications[0]?.id ?? ''));
  const [date, setDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
  const [time, setTime] = useState('09:30 AM');
  const [inspector, setInspector] = useState('Eng. Maryam Al-Sabah (Lead SMIIC / ISO 17065 Assessor)');
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>(DEFAULT_CHECKLIST);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentApp = applications.find(a => a.id === selectedAppId);

  const toggleChecklistItem = (item: string) => {
    if (selectedChecklist.includes(item)) {
      if (selectedChecklist.length === 1) {
        setError('At least one audit criterion must be included in the inspection scope.');
        return;
      }
      setSelectedChecklist(selectedChecklist.filter(c => c !== item));
    } else {
      setSelectedChecklist([...selectedChecklist, item]);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAppId) {
      setError('Please select an application record to inspect.');
      return;
    }
    if (!date) {
      setError('Please specify a scheduled inspection date.');
      return;
    }
    if (selectedChecklist.length === 0) {
      setError('At least one audit checklist criterion must be selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = demoStore.scheduleInspection(
        selectedAppId,
        date,
        time,
        inspector,
        selectedChecklist
      );

      if (res.success) {
        onInspectionScheduled?.(res.inspectionId);
        onClose();
      } else {
        setError('Failed to schedule inspection. Please verify the application status.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while saving inspection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Dispatch On-Site Halal Field Inspection
              </h3>
              <p className="text-xs text-slate-400">
                Coordinate facility audit, assign accredited auditor, and define compliance checklist
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Application Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Application & Facility
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.referenceNumber} — {app.organizationName} ({app.facilityName}) [{app.status}]
                </option>
              ))}
            </select>
            {currentApp && (
              <div className="mt-2 p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">{currentApp.facilityName}</strong>: {currentApp.facilityAddress}, {currentApp.country}
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Category: {currentApp.category} | Standards: {currentApp.standardsCompliance.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Audit Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Arrival Window
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="09:00 AM">09:00 AM (Morning Shift Opening)</option>
                <option value="09:30 AM">09:30 AM (Standard Shift)</option>
                <option value="01:30 PM">01:30 PM (Afternoon Production Run)</option>
                <option value="04:00 PM">04:00 PM (Sanitation & CIP Turnaround)</option>
              </select>
            </div>
          </div>

          {/* Lead Inspector Assignment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Lead Auditor
            </label>
            <select
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Eng. Maryam Al-Sabah (Lead SMIIC / ISO 17065 Assessor)">
                Eng. Maryam Al-Sabah (Lead SMIIC / ISO 17065 Assessor)
              </option>
              <option value="Dr. Tariq Al-Hashimi (Lead Technical Halal Auditor)">
                Dr. Tariq Al-Hashimi (Lead Technical Halal Auditor)
              </option>
              <option value="Ustaz Bilal Mansoor (Shariah Meat & Slaughterhouse Specialist)">
                Ustaz Bilal Mansoor (Shariah Meat & Slaughterhouse Specialist)
              </option>
              <option value="Dr. Soraya El-Khatib (Bio-Chemical Formulations Auditor)">
                Dr. Soraya El-Khatib (Bio-Chemical Formulations Auditor)
              </option>
            </select>
          </div>

          {/* Mandatory Checklist Items */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Audit Scope & Verification Criteria ({selectedChecklist.length} selected)
            </label>
            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto">
              {DEFAULT_CHECKLIST.map((item, idx) => {
                const isChecked = selectedChecklist.includes(item);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-colors text-xs ${
                      isChecked ? 'bg-white border border-emerald-200 text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecklistItem(item)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="leading-snug">{item}</span>
                  </label>
                );
              })}
            </div>
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
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Dispatch Inspection</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
