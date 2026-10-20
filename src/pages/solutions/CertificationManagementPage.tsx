import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  ArrowRight,
  UserCheck,
  CalendarCheck,
  FileBadge,
  GitBranch,
  Layers
} from 'lucide-react';

export const CertificationManagementPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* 1. Header & Headline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
            <Sliders className="w-4 h-4" />
            <span>Digital Solution Spotlight</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Certification Workflow Management
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Orchestrate technical evaluations, field inspections, and supervisory committee quorum approvals through an enforced, auditable digital state machine.
          </p>
        </div>
      </section>

      {/* 2. Business Problem & Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="card-enterprise rounded-xl p-8 bg-white border border-rose-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-rose-700 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5" />
              <span>The Business Problem</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Departmental Silos & Unenforced Process Gates
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Certification organizations coordinate multiple distinct disciplines: food scientists, technical assessors, field auditors, financial controllers, and Shariah supervisory scholars. Without enforced workflow software, vital steps are easily skipped.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Certificates generated before formal supervisory committee quorum signoff
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Lack of clear handover when applications require revisions or re-audit
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                No centralized audit ledger when ISO 17065 accreditation auditors inspect the agency
              </li>
            </ul>
          </div>

          <div className="card-enterprise rounded-xl p-8 bg-white border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" />
              <span>The Digital Solution</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Enforced Finite-State Machine Architecture
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              HCPT encodes the certification body’s standard operating procedures into an immutable software state machine. No user—regardless of role—can force an application into "Certificate Issued" without satisfying prerequisite evaluation gates.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Permitted status transitions validated strictly on backend and client
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Automated assignment of lead assessors and field inspection specialists
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Formal decision recording with digital signatures and justification logging
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Representative Workflow */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              State Transition Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Enforced Workflow Progression
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-700">GATE 01</div>
              <div className="text-sm font-bold text-slate-900">Technical Triage</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assessor confirms raw material eligibility and formulates key inspection objectives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-700">GATE 02</div>
              <div className="text-sm font-bold text-slate-900">Field Audit Sign-Off</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assigned inspector executes on-site checklist, logs evidence, and submits audit outcome.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-700">GATE 03</div>
              <div className="text-sm font-bold text-slate-900">Committee Decision</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervisory board votes on compliance, recording legal rationale and any conditional stipulations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-700">GATE 04</div>
              <div className="text-sm font-bold text-slate-900">Cryptographic Issuance</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Digital certificate with SHA-256 seal is generated, logged to public registry, and published to client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interface Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-enterprise rounded-2xl p-8 bg-white border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Software Interface Preview
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Application Detail & State Transition Workspace
              </h3>
            </div>
            <Link
              to="/platform-demo"
              className="px-4 py-2 bg-[#006837] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Test in Interactive Demo
            </Link>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-bold">WORKFLOW_ENGINE // APPLICATION_AUDIT_TIMELINE</span>
              </div>
              <span className="text-amber-400 font-sans text-[11px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Audit Trail Recorded
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-sm">HCPT-APP-2026-0814</div>
                  <div className="text-xs text-slate-400">Crescent Foods International • Jebel Ali Plant #4</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-400">Current: Technical Review</div>
                  <div className="text-[10px] text-slate-400">Assigned: Dr. Mona Al-Saeed</div>
                </div>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  Permitted Forward Transitions from This State:
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                    → Schedule On-Site Inspection
                  </span>
                  <span className="px-3 py-1.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-medium">
                    → Advance to Decision Pending
                  </span>
                  <span className="px-3 py-1.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                    → Request Applicant Information (RFI)
                  </span>
                  <span className="px-3 py-1.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-medium">
                    → Reject Application
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong className="text-slate-300">Protected Rule:</strong> "Certificate Issued" is disabled until formal compliance approval is recorded.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Implementation Considerations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Implementation & Governance Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div>
              <strong className="block text-slate-900 mb-1">Configurable State Logic</strong>
              Certification organizations can adjust review gates to include regional religious requirements, multi-assessor sign-offs, or laboratory pre-screens.
            </div>
            <div>
              <strong className="block text-slate-900 mb-1">ISO 17065 Compliance</strong>
              Designed to satisfy Clause 7 (Process Requirements) of ISO/IEC 17065 for bodies operating conformity assessment of products, processes, and services.
            </div>
            <div>
              <strong className="block text-slate-900 mb-1">Non-Interference Assurance</strong>
              The software governs procedural workflow and evidence completeness. It does not replace the religious or scientific judgment of qualified scholars and auditors.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold">Experience the workflow state machine</h4>
            <p className="text-xs text-slate-400">Navigate live status transitions and inspect validation messages in our interactive demo.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/platform-demo"
              className="px-5 py-2.5 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Open Interactive Demo
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Discuss Your Process
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
