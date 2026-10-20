import React, { useState } from 'react';
import {
  Compass,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  LayoutDashboard,
  FileText,
  Building2,
  FolderOpen,
  UserCheck,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';
import { DemoTab } from './DemoSidebar';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: DemoTab) => void;
  onSelectApplication: (appId: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectApplication
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      targetTab: 'overview' as DemoTab,
      title: 'Step 1: The Executive Overview',
      subtitle: 'Macro Operational Health & Compliance Dashboard',
      description:
        'Start at the Executive Overview. Here, certification directors monitor macro KPIs: total active files, applications awaiting technical triage, upcoming inspection dates, issued certificates, and expiring files approaching the 90-day renewal threshold.',
      actionLabel: 'Navigate to Overview',
      actionPayload: () => setActiveTab('overview')
    },
    {
      step: 2,
      targetTab: 'applications' as DemoTab,
      title: 'Step 2: Inspecting a Certification Application',
      subtitle: 'Detailed Dossier & State Machine Timeline',
      description:
        'Open the Applications module and click on "HCPT-APP-2026-0814" (Crescent Foods International). You can inspect registered manufacturing facilities, raw material ingredient tables, and the auditable state timeline.',
      actionLabel: 'Open Sample Application',
      actionPayload: () => {
        setActiveTab('applications');
        onSelectApplication('app-814');
      }
    },
    {
      step: 3,
      targetTab: 'organizations' as DemoTab,
      title: 'Step 3: Enterprise Organization & Facility Profiles',
      subtitle: 'Production Lines, Wet/Dry Areas & Audit History',
      description:
        'Switch to the Organizations module. See how multi-facility enterprises (such as Crescent Foods or Atlas Dairy) are profiled with distinct physical plant addresses, production line counts, and associated active certificates.',
      actionLabel: 'View Organizations',
      actionPayload: () => setActiveTab('organizations')
    },
    {
      step: 4,
      targetTab: 'documents' as DemoTab,
      title: 'Step 4: Document & Evidence Repository',
      subtitle: 'Lab Assays, Floorplans & Supplier Attestation Stamping',
      description:
        'Explore the Document Management module. Notice categorized evidentiary exhibits: PCR Pork DNA assays, GC-MS residual ethanol reports, and CIP sanitization SOPs with version control and assessor approval stamps.',
      actionLabel: 'Inspect Evidence Vault',
      actionPayload: () => setActiveTab('documents')
    },
    {
      step: 5,
      targetTab: 'reviews' as DemoTab,
      title: 'Step 5: Recording a Review Decision',
      subtitle: 'Technical Review, Deficiency Notices (RFIs) & Committee Gate',
      description:
        'Visit the Review & Approval workspace. Experience how assessors record internal scientific notes, generate structured RFI notices for missing items, or record a formal compliance approval decision for committee sign-off.',
      actionLabel: 'Go to Reviews Module',
      actionPayload: () => setActiveTab('reviews')
    },
    {
      step: 6,
      targetTab: 'inspections' as DemoTab,
      title: 'Step 6: Field Inspection Coordination',
      subtitle: 'Auditor Scheduling, Checklists & Outcome Logging',
      description:
        'In the Inspection Scheduling module, examine on-site audit schedules. Checklists mapped to SMIIC and GSO standards allow auditors to verify physical segregation, review pest management, and record non-conformance remediation.',
      actionLabel: 'Examine Field Inspections',
      actionPayload: () => setActiveTab('inspections')
    },
    {
      step: 7,
      targetTab: 'certificates' as DemoTab,
      title: 'Step 7: Certificate Issuance & Renewal Tracking',
      subtitle: 'Cryptographic Seals, QR Verification & Surveillance',
      description:
        'Conclude in the Issued Certificates and Renewals modules. Inspect high-resolution certificate previews, verify SHA-256 cryptographic digests, test the public verification simulator, and view upcoming annual expiration schedules.',
      actionLabel: 'View Certificates & Complete Tour',
      actionPayload: () => setActiveTab('certificates')
    }
  ];

  const stepData = tourSteps[currentStep];

  const handleNext = () => {
    stepData.actionPayload();
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = tourSteps[currentStep - 1];
      prevStep.actionPayload();
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs text-left animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Interactive Guided Walkthrough
              </div>
              <div className="text-sm font-bold text-white">
                Step {stepData.step} of 7: {stepData.title.split(': ')[1]}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Tour Progress</span>
              <span className="text-emerald-700">{Math.round(((currentStep + 1) / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#006837] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              {stepData.title}
            </h3>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {stepData.subtitle}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {stepData.description}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Automated Guided Action:</strong>
              Clicking "{stepData.actionLabel}" will automatically navigate you to the appropriate screen and highlight relevant records.
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Exit Tour
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006837] text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span>{stepData.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
