import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Globe2,
  Mail,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12 text-left">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Corporate Profile & Governance
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Halal Certification Processing Technologies (HCPT)
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            HCPT is a technology company specializing in the design, development, and implementation of digital processing infrastructure for halal certification bodies, authorities, and international trade organizations.
          </p>
        </div>
      </section>

      {/* 2. Official Brand & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-enterprise rounded-2xl p-8 sm:p-10 bg-white border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Official Brand Tagline
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                “From Application to Certification. All Digital.”
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <img
                src="/hcpt-logo.jpg"
                alt="Official HCPT Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Our Strategic Purpose</h3>
              <p>
                As global halal commerce expands to over $2 trillion annually, certification bodies face exponential growth in the volume of applications, complex chemical formulation dossiers, and multi-country supply chain audits.
              </p>
              <p>
                HCPT provides the modern software foundation that enables these organizations to transition from fragmented paper binders and email backlogs into secure, auditable, high-throughput digital processing operations.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Our Technological Role</h3>
              <p>
                HCPT develops digital solutions including online applicant intake portals, automated ingredient screening systems, field inspection coordination tools, committee decision gates, cryptographic certificate issuance, and automated annual renewals.
              </p>
              <div className="p-3 rounded bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 font-medium">
                <strong>Clarity of Role:</strong> HCPT is strictly a software technology provider. We do not issue halal certificates, conduct religious fatwas, or make conformity rulings independently.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Verified Facts & Institutional Placeholders Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Transparency & Corporate Disclosures
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Corporate Details & Operational Baseline
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            In compliance with our institutional trust standards, we present only verified corporate information and clearly marked placeholders for details determined during formal engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <span>Technology Domain</span>
            </div>
            <div className="text-base font-bold text-slate-900">Halal Software Architecture</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specialized digital systems for Halal Certification Bodies (HCBs), Ministries of Islamic Affairs, food conglomerates, and inspection agencies worldwide.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Headquarters & Offices</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono text-xs">
              [Regional Office Deployment on Engagement]
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Operational jurisdiction and cloud deployment regions are established collaboratively based on the client authority's statutory data residency requirements.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Leadership & Engineering</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-mono text-xs">
              [Supplied under Institutional NDA]
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technical architects, full-stack engineers, and compliance software specialists with experience in enterprise workflow engineering.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Core Guiding Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white space-y-8">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-bold">Guiding Architectural Principles</h3>
            <p className="text-sm text-slate-400">
              The fundamental engineering tenets governing all HCPT software modules:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">1. Verifiable Process Integrity</div>
              <p>
                Every status change, document review, and checklist verification must produce an immutable audit log with user identity, timestamp, and justification.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">2. Non-Interference in Authority</div>
              <p>
                Software enforces administrative completeness and workflow rules, but never displaces the statutory authority of qualified Shariah scholars and food scientists.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">3. Open Standards Compatibility</div>
              <p>
                We build to recognized global baselines—OIC/SMIIC, GSO 2055-1, MS 1500, and BPJPH HAS 23000—enabling mutual recognition and international trade fluidity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-enterprise rounded-xl p-8 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900">Interested in partnering with HCPT?</h4>
            <p className="text-xs text-slate-600">Submit an institutional inquiry to arrange an executive technical briefing.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Contact Our Team
            </Link>
            <Link
              to="/platform-demo"
              className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
