import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Filter,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';

export const ElectronicProcessingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* 1. Header & Headline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 w-fit">
            <FileText className="w-4 h-4" />
            <span>Digital Solution Spotlight</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Electronic Application Processing
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Automate application triage, cross-reference supplier ingredient certificates, and accelerate preliminary technical assessments with structured compliance rules.
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
              The Cognitive Burden of Manual Formula Checks
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Industrial food and pharmaceutical formulations contain dozens of emulsifiers, flavors, enzymes, and processing aids. Evaluating multi-ingredient bills of materials against hundreds of supplier certificates by hand creates enormous backlogs and elevated compliance risk.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Expired supplier certificates often go unnoticed in large 100-page binders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                No standardized triage to separate simple single-ingredient files from complex lines
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Unstructured reviewer notes make audit handovers slow and incomplete
              </li>
            </ul>
          </div>

          <div className="card-enterprise rounded-xl p-8 bg-white border border-blue-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-blue-700 font-bold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" />
              <span>The Digital Solution</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Structured Ingestion & Automated Rule Cross-Checking
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              HCPT’s Electronic Processing module converts raw applicant uploads into structured database entities. Supplier certificates are checked for valid date ranges, accredited certifying body status, and scope match before reaching the human technical assessor.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Automated flags for high-risk critical ingredients (e.g. gelatin, mono/diglycerides)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Intelligent RFI dispatcher: sends structured correction notices to applicants with one click
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Triage queue prioritizing applications ready for on-site inspection
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Representative Workflow */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Triage & Ingestion Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Electronic Processing Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-blue-700">STAGE 01</div>
              <div className="text-sm font-bold text-slate-900">Dossier Parsing</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Raw materials and supplier details are extracted into queryable database records.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-blue-700">STAGE 02</div>
              <div className="text-sm font-bold text-slate-900">Validity Verification</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                System evaluates supplier halal certificates against expiration dates and recognized accreditation lists.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-blue-700">STAGE 03</div>
              <div className="text-sm font-bold text-slate-900">Risk Categorization</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Items classified into Critical Control Points (CCP): botanical, synthetic, bovine/poultry, or microbial.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-blue-700">STAGE 04</div>
              <div className="text-sm font-bold text-slate-900">Assessor Dispatch</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-processed files land in technical assessor queues with highlighted risks and missing item summaries.
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
                Assessor Triage & Ingredient Verification Screen
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
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 font-bold">ASSESSOR_TRIAGE // INGREDIENT_VERIFICATION_MODULE</span>
              </div>
              <span className="text-blue-400 font-sans text-[11px] bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                Automated Rules Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-slate-400 font-bold text-[11px] pb-2 border-b border-slate-800 uppercase">
                <div className="col-span-4">Raw Material / Ingredient</div>
                <div className="col-span-3">Supplier HCB Certificate</div>
                <div className="col-span-3">Assessor Finding</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-slate-800/60">
                <div className="col-span-4 text-white font-sans">
                  Vegetable Monoglycerides (E471)
                  <div className="text-[10px] text-slate-400 font-mono">100% Palm Derivative Attestation</div>
                </div>
                <div className="col-span-3 text-slate-300 font-mono text-[11px]">
                  JAKIM-Recognized Body (Valid)
                </div>
                <div className="col-span-3 text-emerald-400 font-sans text-[11px]">
                  Zero porcine DNA; fatty acid origin verified
                </div>
                <div className="col-span-2 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                    APPROVED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-slate-800/60 bg-amber-950/20 px-2 rounded">
                <div className="col-span-4 text-white font-sans">
                  Bovine Gelatin Capsule Shell (Mesh 120)
                  <div className="text-[10px] text-amber-400 font-mono">Supplier Batch GEL-992</div>
                </div>
                <div className="col-span-3 text-amber-300 font-mono text-[11px]">
                  Certificate Expired: 31-Dec-2025
                </div>
                <div className="col-span-3 text-amber-400 font-sans text-[11px]">
                  Automated Flag: RFI generated for renewed certificate
                </div>
                <div className="col-span-2 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                    RFI PENDING
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center py-2">
                <div className="col-span-4 text-white font-sans">
                  Natural Vanilla Oleoresin
                  <div className="text-[10px] text-slate-400 font-mono">Solvent-Free Extraction SOP</div>
                </div>
                <div className="col-span-3 text-slate-300 font-mono text-[11px]">
                  MoIAT UAE Approved Lab
                </div>
                <div className="col-span-3 text-emerald-400 font-sans text-[11px]">
                  Residual ethanol 0.012% (&lt; 0.05% threshold)
                </div>
                <div className="col-span-2 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                    APPROVED
                  </span>
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
            Implementation & Technical Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div>
              <strong className="block text-slate-900 mb-1">Standard Alignment</strong>
              The rule engine can be calibrated to regional standards: OIC/SMIIC 1 (0.05% ethanol), UAE.S 2055-1, JAKIM MS 1500, or BPJPH regulations.
            </div>
            <div>
              <strong className="block text-slate-900 mb-1">Laboratory LIMS Integration</strong>
              Supports API hooks to connect with certified testing laboratories for direct digital delivery of GC-MS and PCR pork test results.
            </div>
            <div>
              <strong className="block text-slate-900 mb-1">Audit Trail Export</strong>
              Every automatic check and manual assessor override is logged with user identity and timestamp to ensure full accountability.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold">Evaluate the electronic processing console</h4>
            <p className="text-xs text-slate-400">Interact with realistic synthetic applications and test automated checks.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/platform-demo"
              className="px-5 py-2.5 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Launch Interactive Demo
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Discuss Requirements
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
