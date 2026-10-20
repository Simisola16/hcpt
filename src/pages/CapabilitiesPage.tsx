import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building,
  CheckCircle2,
  Calendar,
  Award,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Database,
  Lock,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';

export const CapabilitiesPage: React.FC = () => {
  const capabilityGroups = [
    {
      id: 'intake',
      title: 'Digital Intake & Applicant Management',
      icon: FileText,
      color: 'emerald',
      items: [
        {
          title: 'Guided Multi-Step Application Submission',
          desc: 'Step-by-step wizard capturing applicant enterprise details, facility registration numbers, and target international certification standards.'
        },
        {
          title: 'Batch Product Schedule Ingestion',
          desc: 'Structured entry of trade names, SKUs, brand classifications, and raw ingredient counts with bulk spreadsheet import support.'
        },
        {
          title: 'Automated Document Completeness Gating',
          desc: 'Configurable validation rules preventing submission until all mandatory evidentiary exhibits for the specific category are supplied.'
        },
        {
          title: 'Applicant Communication Center',
          desc: 'Direct in-portal messaging for deficiency notices, clarification requests (RFIs), and automatic email notifications.'
        }
      ]
    },
    {
      id: 'facilities',
      title: 'Multi-Facility & Production Line Hierarchy',
      icon: Building,
      color: 'blue',
      items: [
        {
          title: 'Enterprise Corporate Hierarchy',
          desc: 'Supports multi-plant corporate groups, managing headquarters, regional manufacturing hubs, and outsourced contract co-packers.'
        },
        {
          title: 'Individual Production Line Profiling',
          desc: 'Granular tracking of dedicated vs. shared production lines, including wet/dry separation and Clean-in-Place (CIP) sanitization cycles.'
        },
        {
          title: 'Cross-Contamination Risk Matrix',
          desc: 'Documentation of seasonal product shifts, non-halal material barriers, and physical air-filtration/quarantine zones.'
        },
        {
          title: 'Facility Audit Historical Records',
          desc: 'Complete log of past inspection dates, non-conformance remediation reports, and facility-specific auditor notes.'
        }
      ]
    },
    {
      id: 'verification',
      title: 'Technical Review & Ingredient Analysis',
      icon: CheckCircle2,
      color: 'amber',
      items: [
        {
          title: 'Supplier Halal Certificate Expiration Tracking',
          desc: 'Automated monitoring of supplier certificates, flagging expired attestations before applications advance to inspection.'
        },
        {
          title: 'Critical Ingredient Risk Flagging',
          desc: 'Highlights sensitive ingredients (e.g. gelatin, animal fatty acids, enzymes, wine vinegar, ethanol extract carriers).'
        },
        {
          title: 'Laboratory Assay Ingestion',
          desc: 'Structured indexing of third-party laboratory PCR porcine DNA test certificates and GC-MS residual alcohol percentage reports.'
        },
        {
          title: 'Auditor Internal Notes & Deficiency Logging',
          desc: 'Role-protected collaborative comment threads allowing food scientists and Shariah scholars to record review justifications.'
        }
      ]
    },
    {
      id: 'inspections',
      title: 'Inspection Coordination & Field Tooling',
      icon: Calendar,
      color: 'purple',
      items: [
        {
          title: 'Auditor Scheduling & Facility Dispatch',
          desc: 'Assigns accredited lead assessors based on industry qualification (e.g. abattoir slaughter specialist, chemical engineer, dairy assessor).'
        },
        {
          title: 'Standardized Compliance Checklists',
          desc: 'Comprehensive evaluation criteria mapped to SMIIC 1, GSO 2055-1, or MS 1500 with severity ratings (Critical, Major, Minor).'
        },
        {
          title: 'On-Site Evidence Capture',
          desc: 'Checklist verification recording auditor observations, required corrective actions, and photographic evidence attachments.'
        },
        {
          title: 'Audit Outcome Determination',
          desc: 'Formal recommendation classification: Compliant / Recommended, Conditional Conformance (removals needed), or Non-Compliant.'
        }
      ]
    },
    {
      id: 'issuance',
      title: 'Cryptographic Certificate Issuance',
      icon: Award,
      color: 'emerald',
      items: [
        {
          title: 'High-Resolution Vector PDF Generation',
          desc: 'Dynamic generation of formal certificates matching statutory layout guidelines with embedded anti-counterfeit patterns.'
        },
        {
          title: 'SHA-256 Digital Document Hashing',
          desc: 'Embeds unique cryptographic document digests into the certificate payload, enabling mathematical verification against alterations.'
        },
        {
          title: 'Public Online Verification URL & QR Code',
          desc: 'Every certificate features an instant validation link allowing customs officials and consumers worldwide to confirm validity in seconds.'
        },
        {
          title: 'Supervisory Committee Quorum Sign-Off',
          desc: 'Requires formal sign-off from designated signatories (e.g. Shariah Supervisory Chairman and Director General of Certification).'
        }
      ]
    },
    {
      id: 'renewals',
      title: 'Surveillance, Renewals & Audit Trails',
      icon: RefreshCw,
      color: 'slate',
      items: [
        {
          title: 'Automated 90/60/30-Day Renewal Alerts',
          desc: 'Proactive notifications sent to manufacturers ahead of expiration, preventing costly supply-chain disruptions at ports.'
        },
        {
          title: 'Recertification Dossier Pre-Population',
          desc: 'Carries forward unchanged facility parameters and ingredients, requiring clients to verify updates rather than retyping from scratch.'
        },
        {
          title: 'Immutable Audit History Ledger',
          desc: 'Chronological recording of all status updates, document reviews, inspection outcomes, and certificate generation events.'
        },
        {
          title: 'Accreditation Peer Audit Readiness',
          desc: 'Exportable compliance dossiers demonstrating adherence to ISO 17065 procedural standards for external accreditation review.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Specifications
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Complete Enterprise Capabilities
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            A comprehensive reference of the operational, evidentiary, workflow, and verification features engineered into Halal Certification Processing Technologies.
          </p>
        </div>
      </section>

      {/* Capabilities Groups */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {capabilityGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.id} className="space-y-6">
              
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="p-2 rounded-lg bg-emerald-50 text-[#006837]">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {group.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-bold">Test These Capabilities in the Live Interactive Demo</h3>
            <p className="text-sm text-slate-300">
              Our interactive demonstration provides synthetic records illustrating each module: application triage, inspection scheduling, and cryptographic certificate issuance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/platform-demo"
              className="px-6 py-3 bg-[#006837] text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Launch Platform Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
