import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export interface TourStep {
  number: number;
  title: string;
  tab: string;
  actionText: string;
  description: string;
  targetId?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    number: 1,
    title: 'Executive Overview',
    tab: 'overview',
    actionText: 'View Dashboard Metrics',
    description: 'Inspect executive KPI summaries: intake volume, applications awaiting technical review, scheduled audits, and approaching expiries.'
  },
  {
    number: 2,
    title: 'Sample Application Intake',
    tab: 'applications',
    actionText: 'Open Application HCPT-APP-2026-814',
    description: 'Explore a live application dossier for Crescent Foods, review product schedules, formulations, and state machine transitions.',
    targetId: 'app-814'
  },
  {
    number: 3,
    title: 'Enterprise Organization Profile',
    tab: 'organizations',
    actionText: 'Inspect Crescent Foods Profile',
    description: 'Examine multi-plant facility hierarchies, registered production lines, and associated certification history.',
    targetId: 'org-101'
  },
  {
    number: 4,
    title: 'Evidentiary Document Verification',
    tab: 'documents',
    actionText: 'Review Evidentiary Dossier',
    description: 'Audit ingredient supply chain certificates, lab assays, and test simulated intake with demo disclaimer protection.'
  },
  {
    number: 5,
    title: 'Technical Review & Committee Gate',
    tab: 'reviews',
    actionText: 'Review Workbench & Decisions',
    description: 'Evaluate critical halal control points (porcine DNA, alcohol threshold, CIP) and record supervisory quorum decision.'
  },
  {
    number: 6,
    title: 'On-Site Field Audit Coordination',
    tab: 'inspections',
    actionText: 'View Inspection Coordination',
    description: 'Schedule accredited auditors, assign ISO 17065 / SMIIC checklists, and record field compliance findings.'
  },
  {
    number: 7,
    title: 'Certificates & Renewal Surveillance',
    tab: 'certificates',
    actionText: 'Preview Cryptographic Certificate',
    description: 'Inspect tamper-evident digital certificates with QR validation hashes, and monitor automated 90-day renewal surveillance.'
  }
];

interface GuidedTourWidgetProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onResetDemo: () => void;
}

export const GuidedTourWidget: React.FC<GuidedTourWidgetProps> = ({
  currentStepIndex,
  onSelectStep,
  onResetDemo
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      onSelectStep(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onSelectStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* Top bar of tour widget */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-1 rounded-md bg-emerald-600 text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                Guided Demonstration Tour
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                Step {currentStep.number} of {TOUR_STEPS.length}: <strong className="text-white font-bold">{currentStep.title}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetDemo}
              title="Reset all demo records to initial baseline"
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Data</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            >
              <span>{isExpanded ? 'Hide Guide' : 'Show Tour Guide'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded walkthrough body */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-left space-y-3">
            
            {/* Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {TOUR_STEPS.map((s, idx) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    idx === currentStepIndex
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : idx < currentStepIndex
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {idx < currentStepIndex ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-slate-700 text-[10px] flex items-center justify-center font-mono">
                      {s.number}
                    </span>
                  )}
                  <span>{s.title}</span>
                </button>
              ))}
            </div>

            {/* Current Step Description & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {currentStep.description}
              </p>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="px-2.5 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStepIndex === TOUR_STEPS.length - 1}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none rounded transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
