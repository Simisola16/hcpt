import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FileText,
  Sliders,
  FileCheck2,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check
} from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const solutions = [
    {
      id: 'halal-certification-portals',
      title: 'Halal Certification Portals',
      link: '/solutions/halal-certification-portals',
      icon: Layers,
      color: 'emerald',
      tag: 'Front-End Intake & Client Engagement',
      headline: 'Digitize client intake, eliminate fragmented email submissions, and empower applicants.',
      problem: 'Traditional intake relies on paper binders, unstandardized Excel spreadsheets, and unstructured email attachments. This leads to missing formula records, lengthy email chains, delayed fee processing, and frustrated commercial applicants.',
      solution: 'Custom-branded, secure self-service portals where manufacturing clients can lodge new applications, upload required lab assays and facility schematics, pay statutory fees, and monitor application review milestones in real time.',
      capabilities: [
        'Multi-facility profile and production line registration',
        'Formula & recipe bill of materials upload with ingredient tagging',
        'Automated document completeness validation before submission',
        'Applicant notification center for deficiency and clarification requests',
        'Secure multi-user permissions for client QA teams'
      ]
    },
    {
      id: 'electronic-processing',
      title: 'Electronic Application Processing',
      link: '/solutions/electronic-processing',
      icon: FileText,
      color: 'blue',
      tag: 'Triage & Automated Assessor Tools',
      headline: 'Accelerate preliminary checks, verify supplier credentials, and detect formulation risks.',
      problem: 'Assessing thousands of raw materials across global supply chains manually is slow and error-prone. Expired supplier halal certificates or obscure animal-derived emulsifiers can easily bypass human reviewers.',
      solution: 'Automated processing engine that extracts ingredient line items, cross-checks supplier certification status against accredited body lists, verifies laboratory report validity, and assigns triage priority scores to incoming applications.',
      capabilities: [
        'Automated expiration tracking for supplier halal certificates',
        'Cross-reference against halal standards databases (E-numbers, enzymes, gelatin)',
        'Deficiency notice generator with automated return-for-correction workflows',
        'Standardized intake scoring and assessor workload balancing',
        'Integrated fee reconciliation and commercial invoicing hooks'
      ]
    },
    {
      id: 'certification-management',
      title: 'Certification Workflow Management',
      link: '/solutions/certification-management',
      icon: Sliders,
      color: 'amber',
      tag: 'Core Orchestration Engine',
      headline: 'Orchestrate technical review, field inspections, and Shariah committee sign-offs.',
      problem: 'Certification organizations struggle to maintain rigorous audit trails across separate departments: administrative officers, food science assessors, field inspectors, and religious scholars operate in silos.',
      solution: 'A unified enterprise workflow management system enforcing strict finite-state transitions. Every stage—from technical review and on-site audit scheduling to supervisory committee voting—is governed by auditable rules.',
      capabilities: [
        'Enforced workflow state machine with configurable transition gates',
        'Assessor collaboration workspace with internal comments and markup',
        'Field inspection dispatcher with digital checklist verification',
        'Supervisory committee quorum voting and decision recording',
        'Comprehensive audit log capturing every action, actor, and timestamp'
      ]
    },
    {
      id: 'document-management',
      title: 'Document & Evidence Management',
      link: '/solutions',
      icon: FileCheck2,
      color: 'purple',
      tag: 'Evidence Repository & Traceability',
      headline: 'Centralize lab reports, facility floorplans, and supplier affidavits with immutable versioning.',
      problem: 'Crucial compliance evidence is scattered across email inboxes, local drives, and physical filing cabinets, creating severe compliance vulnerability during ISO 17065 or accreditation audits.',
      solution: 'A secure, classified document repository linked directly to application records. Supports multi-version history, document approval stamping, missing-evidence alerts, and tamper-resistant storage.',
      capabilities: [
        'Structured categorization (Lab Assays, Floorplans, CIP Protocols, HACCP)',
        'Document revision tracking with side-by-side comparison',
        'Assessor status stamps (Approved, Under Review, Needs Revision, Rejected)',
        'Automated alerts for missing or expired mandatory evidence',
        'Zero-trust access control protecting confidential corporate trade secrets'
      ]
    },
    {
      id: 'certificate-issuance',
      title: 'Certificate Issuance & Renewal Tracking',
      link: '/solutions',
      icon: Award,
      color: 'emerald',
      tag: 'Cryptographic Sealing & Lifecycle',
      headline: 'Issue tamper-proof certificates with public QR verification and automated renewal alerts.',
      problem: 'Physical certificates are vulnerable to counterfeit duplication and alteration. Furthermore, tracking annual expiration dates manually results in expired certificates and delayed trade shipments.',
      solution: 'Generates high-resolution digital certificates with embedded cryptographic SHA-256 digests and public QR validation links. Automatically tracks upcoming expirations and triggers renewal sequences 90 days in advance.',
      capabilities: [
        'Vector-grade PDF certificate generation with anti-counterfeiting guilloché styling',
        'Embedded SHA-256 cryptographic seal verifiable by customs worldwide',
        'Public verification portal for real-time validity checks without logging in',
        'Automated renewal notification cadence (90, 60, and 30 days prior to expiry)',
        'Scope extension and facility transfer amendments'
      ]
    },
    {
      id: 'operational-visibility',
      title: 'Reporting & Operational Visibility',
      link: '/solutions',
      icon: TrendingUp,
      color: 'slate',
      tag: 'Analytics & Compliance Oversight',
      headline: 'Gain complete visibility into assessor velocity, inspector workload, and audit pipeline.',
      problem: 'Executive directors and supervisory boards often have no aggregate visibility into application throughput, staff capacity, inspection bottlenecks, or regional compliance trends.',
      solution: 'Real-time business intelligence dashboards providing live metrics on applications by status, average processing turnaround, upcoming inspection schedules, and certificate expiration distributions.',
      capabilities: [
        'Live executive summary cards for all active certification files',
        'Assessor and inspector workload distribution analytics',
        'Jurisdictional filtering (OIC/SMIIC, GSO, MS 1500, BPJPH)',
        'Inspection outcome analytics (conformance vs conditional non-conformance)',
        'Exportable compliance audit reports for accreditation oversight'
      ]
    }
  ];

  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            HCPT Solutions Suite
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Digital Transformation for Halal Certification Processing
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            HCPT provides an integrated software suite that eliminates paperwork, enforces strict Shariah and scientific review gates, and establishes verifiable audit trails across the certification lifecycle.
          </p>
        </div>
      </section>

      {/* Solutions Detailed List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {solutions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="card-enterprise rounded-xl p-8 sm:p-10 border border-slate-200 bg-white"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-[#006837]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-base text-slate-800 font-medium">
                    {item.headline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-xs font-bold text-slate-700 uppercase">
                        The Challenge
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-900 uppercase">
                        HCPT Solution
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={item.link.startsWith('/solutions/') ? item.link : '/platform-demo'}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#006837] hover:underline"
                    >
                      <span>{item.link.startsWith('/solutions/') ? 'Read full solution architecture' : 'Experience this module in demo'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
                    Key Capabilities & Controls
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {item.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-slate-200">
                    <Link
                      to="/platform-demo"
                      className="w-full block text-center py-2 px-3 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-[#00502b] transition-colors"
                    >
                      Launch Interactive Demo
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-bold">Need a Custom Certification Workflow?</h3>
            <p className="text-sm text-slate-300">
              Our engineering team configures HCPT to match your statutory procedures, national accreditation criteria, and specific sector categories.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 bg-[#006837] text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Discuss Your Requirements
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
