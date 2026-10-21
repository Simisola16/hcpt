import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  FileText,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck2,
  TrendingUp,
  Building,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  Search,
  Lock,
  RefreshCw,
  Eye,
  Server,
  Workflow,
  QrCode
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2);

  const workflowSteps = [
    {
      step: 1,
      title: 'Application Intake',
      subtitle: 'Electronic Lodgement',
      description: 'Applicant submits digital dossier, production facility parameters, formula bills of materials, and supplier halal attestations.',
      details: 'Automatic pre-validation checks required files, generates unique tracking identifier, and issues instant receipt.',
      exceptions: 'Applicant may save progress as Draft or amend prior to formal lodgement.'
    },
    {
      step: 2,
      title: 'Initial Review',
      subtitle: 'Completeness & Triage',
      description: 'Lead assessor evaluates administrative completeness, scope alignment, and fee payment verification.',
      details: 'Assessor flags missing items or routes to specialized sector desk.',
      exceptions: 'Can trigger Return for Additional Information (RFI) with automated portal notification.'
    },
    {
      step: 3,
      title: 'Technical Review',
      subtitle: 'Shariah & Science Evaluation',
      description: 'Specialists examine ingredient biochemical sourcing (e.g., E-numbers, enzymes, gelatin, ethanol thresholds) and critical control points.',
      details: 'Reviewers record timestamped findings and formulate on-site audit objectives.',
      exceptions: 'Applications with non-compliant ingredients can be paused, returned for reformulation, or rejected.'
    },
    {
      step: 4,
      title: 'Inspection Coordination',
      subtitle: 'On-Site Field Audit',
      description: 'Dispatches accredited auditors to verify physical segregation, cleaning protocols (CIP), slaughter rituals, and traceability.',
      details: 'Auditor completes standardized compliance checklist with evidence uploads and corrective action requests.',
      exceptions: 'Follow-up inspection can be triggered if major non-conformances are detected.'
    },
    {
      step: 5,
      title: 'Compliance Decision',
      subtitle: 'Supervisory Committee Gate',
      description: 'Independent Certification Committee reviews complete audit file, lab assays, and auditor recommendation.',
      details: 'Formal quorum decision recorded with voting signatures and regulatory rationale.',
      exceptions: 'Committee may request targeted re-audit or reject application with full legal justification.'
    },
    {
      step: 6,
      title: 'Certificate Issuance',
      subtitle: 'Cryptographic Sealing',
      description: 'Generates tamper-proof digital certificate with embedded SHA-256 hash, X.509 signature, and public QR verification link.',
      details: 'Automatically registers with central database and schedules recurring surveillance cycle.',
      exceptions: 'Annual renewal notices automatically dispatched 90, 60, and 30 days prior to expiry.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative pt-4 pb-14 lg:pt-6 lg:pb-20 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Messaging */}
            <div className="lg:col-span-7 space-y-6 text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>From Application to certification. All Digital.</span>
              </div>

              {/* Primary Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Modernize Halal Certification. <br className="hidden sm:inline" />
                <span className="text-[#006837]">From Application to Issuance.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                HCPT provides purpose-built digital infrastructure for Halal Certification Bodies (HCBs) and regulatory authorities. Replace fragmented paperwork with automated intake, technical evaluation, inspection dispatch, and cryptographically verified certificate management.
              </p>

              {/* Value metrics pill */}
              <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-slate-200/80 max-w-xl">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Digital Workflow Intake</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#006837]">Zero</div>
                  <div className="text-xs text-slate-500 font-medium">Paper Tracking Gaps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F2C59]">SHA-256</div>
                  <div className="text-xs text-slate-500 font-medium">Tamper-Proof Sealing</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/platform-demo"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#006837] text-white text-base font-semibold hover:bg-[#00502b] transition-all shadow-md shadow-emerald-900/15 group"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span>Explore the Platform</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-slate-800 text-base font-semibold hover:bg-slate-50 transition-colors border border-slate-300 shadow-xs"
                >
                  <span>Discuss Your Requirements</span>
                </Link>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Full Audit Traceability
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Role-Based Security
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  International Standard Mappings
                </span>
              </div>
            </div>

            {/* Right Column: Realistic Enterprise Software Interface Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-lg lg:max-w-none">

                {/* Enterprise Dashboard Preview Frame */}
                <div className="rounded-xl border border-slate-300 bg-white shadow-2xl overflow-hidden text-left">

                  {/* Window Bar */}
                  <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-xs font-mono text-slate-300 font-medium">
                        hcpt-console // authority-v2.4
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Live Assessor View
                    </span>
                  </div>

                  {/* Mock Console Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Current Application File</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">HCPT-APP-2026-0814</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Technical Review
                    </span>
                  </div>

                  {/* Console Body Preview */}
                  <div className="p-4 space-y-4 text-xs">

                    {/* Organization card */}
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Applicant Enterprise</span>
                        <span className="font-mono text-[11px] text-slate-400">CR-882910-DXB</span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">Crescent Foods International Ltd</div>
                      <div className="text-slate-600">Facility: Jebel Ali Central Processing #4 (Dubai, UAE)</div>
                    </div>

                    {/* Progress Checklist */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Evaluation Gates</div>

                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Formula Bill of Materials (23 Ingredients)
                        </span>
                        <span className="text-emerald-700 font-semibold">Verified</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="flex items-center gap-2 text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Eurofins PCR Porcine DNA & Ethanol Assay
                        </span>
                        <span className="text-emerald-700 font-semibold">&lt; 0.05% Safe</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-amber-50/60 border border-amber-200">
                        <span className="flex items-center gap-2 text-slate-900 font-medium">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Cleaning-In-Place (CIP) Sanitization Log
                        </span>
                        <span className="text-amber-800 font-semibold">Assessor Queue</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                      <Link
                        to="/platform-demo"
                        className="flex-1 text-center py-2 px-3 bg-[#006837] text-white rounded font-semibold text-xs hover:bg-[#00502b] transition-colors"
                      >
                        Inspect Application File
                      </Link>
                      <Link
                        to="/platform-demo"
                        className="py-2 px-3 bg-slate-100 text-slate-700 rounded font-semibold text-xs hover:bg-slate-200 transition-colors"
                      >
                        Schedule Audit
                      </Link>
                    </div>

                  </div>

                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg border border-slate-200 shadow-lg hidden sm:flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Configurable Rule Engine</div>
                    <div className="text-[11px] text-slate-500">Adapts to SMIIC, GSO, MS 1500 & BPJPH</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. SOLUTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Enterprise Solutions Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Digital Capabilities for Certification Bodies
          </h2>
          <p className="text-base text-slate-600">
            Engineered to resolve structural bottlenecks across the entire lifecycle of halal assurance, compliance governance, and international trade certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* 1. Halal Certification Portals */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-[#006837] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Halal Certification Portals
              </h3>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Applicants frequently submit incomplete documents via email or fragmented forms, causing weeks of back-and-forth triage and administrative burden.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Self-service applicant portals with guided document checklists, batch ingredient upload, fee reconciliation, and real-time application tracking.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/solutions/halal-certification-portals"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>Explore Portals Solution</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 2. Electronic Application Processing */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0F2C59] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Electronic Application Processing
              </h3>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manual review of complex chemical formulas and raw material supplier certificates creates major risks of human oversight and delays.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated electronic intake engine that verifies supplier certificate validity dates, parses ingredients against halal control databases, and flags discrepancies.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/solutions/electronic-processing"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>Explore Electronic Processing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3. Certification Workflow Management */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Certification Workflow Management
              </h3>
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lack of structured state transitions leads to bypassed audit gates, unrecorded Shariah scholar inputs, and lost accountability.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enforced finite-state workflow engine requiring verified transitions: initial review, technical review, inspection signoff, and committee quorum decision.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/solutions/certification-management"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>Explore Workflow Management</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 4. Document & Evidence Management */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Document & Evidence Management
              </h3>
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scattered laboratory test reports, facility floorplans, and CIP sanitization logs make compliance audits difficult to defend or verify.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Categorized central repository with immutable revision histories, document approval stamps, expiration tracking, and missing-evidence alerts.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/solutions"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>View Evidence Features</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 5. Certificate Issuance & Renewal Tracking */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Certificate Issuance & Renewals
              </h3>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fraudulent paper certificates harm organizational credibility, while unmanaged renewal dates result in expired manufacturer shipments at customs.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cryptographically sealed certificates with public QR verification URLs, SHA-256 hashes, and automated multi-stage renewal workflows.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/solutions"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>View Issuance Protocols</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 6. Reporting and Operational Visibility */}
          <div className="card-enterprise rounded-xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Reporting & Operational Visibility
              </h3>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                The Business Problem
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Executive directors lack real-time visibility into assessor bottlenecks, auditor utilization, pending expirations, and regulatory compliance status.
              </p>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider pt-2 border-t border-slate-100">
                The Digital Solution
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Executive dashboards tracking application velocity, audit workloads, upcoming expirations by territory, and tamper-proof event logs.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/platform-demo"
                className="text-sm font-semibold text-[#006837] hover:text-emerald-800 flex items-center gap-1.5"
              >
                <span>View Live Dashboard Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* 3. DIGITAL WORKFLOW LIFECYCLE SECTION */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">

          <div className="max-w-3xl space-y-3 mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
              End-to-End Governance Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Digital Halal Certification Lifecycle
            </h2>
            <p className="text-base text-slate-400">
              Every certification application transitions through strict, verifiable state checkpoints with built-in provisions for additional information requests, return-for-corrections, and supervisory decisions.
            </p>
          </div>

          {/* Workflow Stepper Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
            {workflowSteps.map((ws, idx) => (
              <button
                key={ws.step}
                type="button"
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-3 text-left rounded-lg transition-all border ${activeWorkflowStep === idx
                    ? 'bg-emerald-950 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/70 text-slate-400 border-slate-700/80 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <div className="text-xs font-mono font-bold text-emerald-400 mb-1">
                  0{ws.step}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {ws.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Deep-Dive Card */}
          <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    STAGE 0{workflowSteps[activeWorkflowStep].step}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    {workflowSteps[activeWorkflowStep].subtitle}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  {workflowSteps[activeWorkflowStep].title}
                </h3>

                <p className="text-base text-slate-300 leading-relaxed">
                  {workflowSteps[activeWorkflowStep].description}
                </p>

                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Standard System Execution
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {workflowSteps[activeWorkflowStep].details}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Permitted Exceptions & Return Loops
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {workflowSteps[activeWorkflowStep].exceptions}
                  </p>
                </div>
              </div>

              {/* State Machine Diagram Visualizer */}
              <div className="lg:col-span-5 bg-slate-900 p-6 rounded-lg border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>State Machine Logic</span>
                  <Workflow className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-800 flex items-center justify-between">
                    <span>Prior State:</span>
                    <span className="text-emerald-400 font-bold">
                      {activeWorkflowStep === 0 ? 'Draft' : workflowSteps[activeWorkflowStep - 1].title}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-emerald-950 text-emerald-200 border border-emerald-700/60 flex items-center justify-between">
                    <span>Active Checkpoint:</span>
                    <span className="font-bold underline">{workflowSteps[activeWorkflowStep].title}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-800 flex items-center justify-between">
                    <span>Forward Gate:</span>
                    <span className="text-slate-400">
                      {activeWorkflowStep === workflowSteps.length - 1 ? 'Closed / Renewal' : workflowSteps[activeWorkflowStep + 1].title}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800">
                  Business Rule: Status changes require authenticated role permissions. No arbitrary bypasses are permitted.
                </div>

                <Link
                  to="/platform-demo"
                  className="block text-center py-2.5 px-4 rounded bg-[#006837] text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Test Status Transitions in Demo
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 4. INDUSTRIES SERVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sector Deployments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for the Global Halal Economy
          </h2>
          <p className="text-base text-slate-600">
            HCPT software infrastructure is designed to accommodate the distinct compliance requirements of diverse industrial manufacturing and oversight organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Food & Beverage Manufacturers
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Batch formulation checks, seasonal recipe updates, clean-in-place sanitation records, and packaging line segregation protocols.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: Recipe bills of materials & cross-contact prevention
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Ingredient & Raw-Material Suppliers
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Management of complex upstream supply chains, bio-fermentation documentation, emulsifier origin tracing, and solvent residual analyses.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: E-number derivation & supplier certificate validation
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Exporters & International Traders
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rapid cross-border customs certificate verification, mutual recognition alignment (GCC, SMIIC, ASEAN), and shipment consignment QR validation.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: Customs clearance velocity & digital seal checks
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Accredited Certification Bodies (HCBs)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete digital agency ERP: applicant intake, assessor assignment, field audit scheduling, committee quorum voting, and certificate lifecycle management.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: Agency productivity, ISO 17065 compliance & audit trails
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Contract Manufacturers (OEM/ODM)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-brand client segregation, private-label scope extensions, dedicated facility lines, and client-specific certificate sub-registrations.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: Facility multi-tenancy & scope extensions
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Pharmaceuticals & Cosmetics
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rigorous cleanroom validations, animal-free gelatin substitution tracking, solvent alcohol threshold verification, and laboratory assay integration.
            </p>
            <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              Focus: Scientific lab verification & strict purity criteria
            </div>
          </div>

        </div>

        <div className="text-center pt-8">
          <Link
            to="/industries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#006837] hover:underline"
          >
            <span>Learn more about industry-specific configurations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>


      {/* 5. TECHNOLOGY & GOVERNANCE */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Institutional Software Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Built for Audit Integrity and Enterprise Reliability
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                HCPT emphasizes verifiable process control rather than decorative features. Every state transition is recorded in an immutable audit ledger, with granular role-based access control protecting sensitive formulations and business trade secrets.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-emerald-100 text-emerald-800 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</div>
                    <div className="text-xs text-slate-500">Applicant QA, Lead Assessor, Shariah Scholar, Field Inspector, and Directorate roles.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-100 text-blue-800 mt-0.5">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Cryptographic Seal Generation</div>
                    <div className="text-xs text-slate-500">SHA-256 digital document digests ensure that issued certificates cannot be altered post-decision.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-amber-100 text-amber-800 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Surveillance & Renewal Automation</div>
                    <div className="text-xs text-slate-500">Scheduled reminders and automated audit triggers ensure recertifications never lapse.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/technology"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#006837] hover:underline"
                >
                  <span>Explore full technical architecture specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Governance Implementation Highlights
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Audit Ledger Immutability</div>
                  <div className="text-slate-600">All actions record user ID, timestamp, entity target, and justification. Records cannot be overwritten or deleted.</div>
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Standardized Checklists (SMIIC, GSO, HAS 23000)</div>
                  <div className="text-slate-600">Field inspectors record compliance against pre-configured criteria with severity weightings (Critical, Major, Minor).</div>
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Separation of Commercial & Religious Authority</div>
                  <div className="text-slate-600">Financial status checks are strictly segregated from independent Shariah compliance review gates.</div>
                </div>
              </div>

              <div className="p-3 rounded bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900">
                <strong>Deployment Note:</strong> HCPT supports on-premises sovereign cloud deployments as well as private regional cloud hosting to satisfy national data residency regulations.
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 6. ENGAGEMENT PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Delivery Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional Deployment Process
          </h2>
          <p className="text-base text-slate-600">
            A structured, disciplined engineering engagement model designed to integrate with existing certification body operations without service interruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              01
            </div>
            <div className="text-sm font-bold text-slate-900">Discovery</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assessment of current forms, standards, fee structures, and regulatory jurisdiction.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              02
            </div>
            <div className="text-sm font-bold text-slate-900">Requirements</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Specification of review gates, sector categories, audit checklists, and roles.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              03
            </div>
            <div className="text-sm font-bold text-slate-900">Solution Design</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Branded portal layout, certificate layout templates, and state machine configuration.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              04
            </div>
            <div className="text-sm font-bold text-slate-900">Implementation</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Database provisioning, data migration from legacy spreadsheets, and integration testing.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              05
            </div>
            <div className="text-sm font-bold text-slate-900">Testing & Training</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Staff assessor workshops, field auditor mobile simulations, and UAT signoff.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
              06
            </div>
            <div className="text-sm font-bold text-slate-900">Deployment</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Production rollout, SLA-backed support, security patches, and regulatory updates.
            </p>
          </div>

        </div>
      </section>


      {/* 7. CLOSING CONVERSION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F2C59] to-slate-900 p-8 sm:p-12 text-white text-left relative overflow-hidden shadow-xl border border-slate-800">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60">
              Interactive System Evaluation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience the Full Certification Workflow
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore how sample applications move from intake to cryptographic certificate issuance in our navigable platform demonstration. Test reviewer decisions, schedule on-site inspections, and inspect tamper-proof records.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/platform-demo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#006837] text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-950/50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Launch Interactive Platform Demo</span>
              </Link>
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-950/80 text-emerald-300 text-sm font-semibold hover:bg-emerald-900 transition-colors border border-emerald-700/60"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Test Certificate Ledger</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                <span>Schedule Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
