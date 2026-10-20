import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  FlaskConical,
  Ship,
  Building2,
  Factory,
  Pill,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const sectors = [
    {
      id: 'food-beverage',
      title: 'Food & Beverage Manufacturers',
      icon: Utensils,
      color: 'emerald',
      useCase: 'Managing complex recipe revisions, dry/wet production segregation, clean-in-place sanitation cycles, and multi-SKU retail lines.',
      regulatoryContext: 'Aligns with OIC/SMIIC 1, GSO 2055-1, and MS 1500 general requirements for food manufacturing.',
      keyCapabilities: [
        'Batch formulation recipe registry with percentage thresholds',
        'Clean-in-Place (CIP) sanitization frequency and chemical validation tracking',
        'Physical cross-contact risk mitigation documentation for shared lines',
        'Annual surveillance audit preparation and automated document checklists'
      ]
    },
    {
      id: 'ingredients',
      title: 'Ingredient & Raw-Material Suppliers',
      icon: FlaskConical,
      color: 'blue',
      useCase: 'Validating upstream chemical synthesis, enzyme origins, microbial fermentation media, and natural botanical extracts.',
      regulatoryContext: 'Essential for B2B exporters supplying multinational food processors requiring rigorous halal supply chain assurance.',
      keyCapabilities: [
        'Emulsifier derivation tracking (vegetable vs animal fatty acids)',
        'Carrier solvent ethanol threshold monitoring (e.g. < 0.05% GC-MS assay)',
        'Direct linkage of supplier halal certificates to individual batch codes',
        'Automated expiration tracking for downstream buyer assurance'
      ]
    },
    {
      id: 'exporters',
      title: 'Exporters & International Trade Businesses',
      icon: Ship,
      color: 'amber',
      useCase: 'Facilitating seamless customs clearance through cryptographically verifiable shipment certificates and mutual recognition alignment.',
      regulatoryContext: 'Addresses import customs requirements across GCC border authorities, Indonesian BPJPH, and ASEAN entry points.',
      keyCapabilities: [
        'Shipment consignment certificate sub-issuance linked to master facility certificate',
        'Instant customs QR code verification with cryptographic hash matching',
        'Rapid verification of mutual recognition between issuing HCB and importing nation',
        'Commercial invoice and bill of lading document correlation'
      ]
    },
    {
      id: 'certification-bodies',
      title: 'Accredited Certification Bodies (HCBs)',
      icon: Building2,
      color: 'emerald',
      useCase: 'Replacing disconnected spreadsheets with a unified operational ERP for client intake, assessor tasking, field audit scheduling, and certificate issuance.',
      regulatoryContext: 'Assists HCBs in demonstrating conformity with ISO/IEC 17065 (Conformity assessment requirements for bodies certifying products, processes and services).',
      keyCapabilities: [
        'Role-based collaboration separating commercial triage from Shariah review',
        'Field auditor dispatch with standardized on-site non-conformance checklists',
        'Supervisory committee quorum voting and digital signature recording',
        'Tamper-proof audit trails for international accreditation peer evaluations'
      ]
    },
    {
      id: 'contract-manufacturers',
      title: 'Contract Manufacturers (OEM/ODM)',
      icon: Factory,
      color: 'purple',
      useCase: 'Operating multi-client facilities producing private-label lines under strict brand segregation agreements.',
      regulatoryContext: 'Supports facility-level certifications with granular client-specific product schedules and scope extensions.',
      keyCapabilities: [
        'Multi-client confidentiality boundaries preventing formulation leakage',
        'Rapid scope extension applications when onboarding new client formulas',
        'Facility-specific equipment logs separate from client product dossiers',
        'Shared production line cleaning validation between dissimilar client runs'
      ]
    },
    {
      id: 'pharmaceuticals',
      title: 'Pharmaceuticals, Nutraceuticals & Cosmetics',
      icon: Pill,
      color: 'blue',
      useCase: 'Addressing strict cleanroom standards, porcine DNA absence, synthetic capsule materials, and solvent purity in healthcare products.',
      regulatoryContext: 'Meets stringent pharmaceutical GMP requirements alongside Halal standards such as MS 2424 and SMIIC cosmetics standards.',
      keyCapabilities: [
        'Laboratory LIMS test integration (PCR porcine DNA, heavy metal screens)',
        'Animal-free capsule shell verification (e.g. HPMC, pullulan, certified bovine gelatin)',
        'Alcohol content threshold monitoring across liquid tinctures and active syrups',
        'Cleanroom hygiene and environmental monitoring records management'
      ]
    }
  ];

  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sector Profiles & Use Cases
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Industries Served by HCPT Technology
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            HCPT provides enterprise workflow software configured for the distinct operational, evidentiary, and audit requirements of specialized industries across the halal economy.
          </p>
        </div>
      </section>

      {/* Institutional Clarification Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">Important Institutional Note:</strong> HCPT is a software technology provider. HCPT does not independently certify, inspect, or issue religious judgments for any organization. The software is deployed by accredited certification bodies and manufacturers to execute their respective compliance and audit responsibilities.
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="card-enterprise rounded-xl p-8 bg-white border border-slate-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#006837]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {s.title}
                  </h2>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Operational Use Case</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.useCase}
                    </p>
                  </div>
                  <div className="p-3 rounded bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Regulatory Context:</strong>
                    {s.regulatoryContext}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Specialized Platform Capabilities
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {s.keyCapabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-bold">Deploy Industry-Specific Compliance Workflows</h3>
            <p className="text-sm text-slate-300">
              Explore how HCPT can be tailored to your sector's standards, audit checklists, and laboratory evidence requirements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/platform-demo"
              className="px-5 py-2.5 bg-[#006837] text-white text-xs font-semibold rounded hover:bg-emerald-700 transition-colors"
            >
              Explore Platform Demo
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded hover:bg-slate-700 transition-colors"
            >
              Discuss Your Sector
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
