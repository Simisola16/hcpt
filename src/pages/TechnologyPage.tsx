import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  ShieldCheck,
  Server,
  Lock,
  Workflow,
  Database,
  FileCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            System Architecture & Engineering
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Architecture & Technology Foundation
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            HCPT is built using modern full-stack web standards, combining a modular React frontend with typed backend services, verifiable state machines, and relational data integrity.
          </p>
        </div>
      </section>

      {/* 2. Distinction Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-950 font-semibold block mb-0.5">Engineering Scope Notice:</strong>
            This page distinguishes between capabilities that are currently implemented in our software demonstration and proposed architectural features configured during enterprise production deployment. HCPT does not claim unverified third-party security accreditations or proprietary cryptographic guarantees.
          </div>
        </div>
      </section>

      {/* 3. Core Implemented Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Active Implementation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Implemented System Capabilities
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Features currently available in the active platform demonstration and core software codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Workflow State Machine</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforced 13-stage certification lifecycle. The state machine validates every transition, ensuring applications cannot skip technical assessment or inspection signoff before decision recording.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Role-Based Access (RBAC)</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Granular role definitions: Applicant QA, Lead Assessor, Technical Assessor, Field Inspector, and Certification Directorate with scoped permissions for notes and status updates.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Relational Data Model</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prisma / PostgreSQL schema defining 14 interconnected domain entities: Users, Organizations, Facilities, Applications, Documents, Reviews, Inspections, and Certificates.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Cryptographic Seal Hashes</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generation of SHA-256 certificate digests and verification tokens for online validity confirmation, preventing unauthorized certificate tampering.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Audit History Ledger</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured audit events recording timestamp, actor identity, target entity, and justification for every workflow transition and document review action.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Dual-Mode Architecture</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Implemented
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              API client supports calling documented HTTP endpoints when deployed with backend, with seamless fallback to stateful client-side storage for evaluation.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Planned & Configurable Enterprise Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Enterprise Roadmap & Integrations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Configurable & Planned Capabilities
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Custom modules deployed and integrated based on sovereign client specifications and existing technical infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">National SIHALAL / BPJPH API Bridge</h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Configurable Integration
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bi-directional API synchronization with Indonesian Ministry of Religious Affairs (BPJPH) SIHALAL system to automate overseas foreign halal certificate registration.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Hardware Security Module (HSM) Signing</h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Enterprise Add-On
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integration with FIPS 140-2 Level 3 hardware security modules for sovereign digital signing of PDF certificates using national root certificate authority keys.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Offline Field Auditor Mobile Tablet App</h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Planned Capability
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Native tablet application allowing field auditors in abattoirs and remote plants to record non-conformances, capture timestamped photos, and sync upon internet reconnection.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Automated LIMS Laboratory Data Ingestion</h3>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Configurable Integration
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct webhook integration with accredited testing laboratories to receive authenticated PCR and chromatographic test certificates directly into applicant dossiers.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Technology Stack Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-enterprise rounded-2xl p-8 bg-white border border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Technology Stack Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1.5 p-4 rounded bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Frontend Layer</div>
              <div className="text-slate-900 font-semibold text-sm">React 19 + TypeScript</div>
              <p className="text-slate-500">Vite build tooling, Tailwind CSS design system, Lucide icons, React Router.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Backend Services</div>
              <div className="text-slate-900 font-semibold text-sm">Next.js API & Route Handlers</div>
              <p className="text-slate-500">TypeScript service layer, Zod runtime input validation, RESTful JSON contracts.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Data Persistence</div>
              <div className="text-slate-900 font-semibold text-sm">PostgreSQL + Prisma ORM</div>
              <p className="text-slate-500">Strict foreign key relations, UUID identifiers, indexed timestamps, and enum constraints.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Security Design</div>
              <div className="text-slate-900 font-semibold text-sm">Zero-Trust Principles</div>
              <p className="text-slate-500">Server-side authorization, sanitized inputs, rate limiting, and encrypted transport.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold">Inspect the live technology implementation</h4>
            <p className="text-xs text-slate-400">Launch the platform demo to see the workflow state machine and data models in action.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/platform-demo"
              className="px-5 py-2.5 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Launch Demo
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Request Architecture Briefing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
