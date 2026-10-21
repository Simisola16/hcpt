import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowUpRight, Lock, Globe2, FileCheck2, Inbox } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enterprise Halal Processing Infrastructure
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Modernize Your Halal Certification Workflows Today
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Deploy electronic application intake, multi-tier technical audit tracking, and automated certificate issuance for your certification organization.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/platform-demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#006837] text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>Launch Interactive Demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <span>Discuss Your Requirements</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-lg inline-block">
              <img
                src="/hcpt-logo.jpg"
                alt="HCPT Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Halal Certification Processing Technologies (HCPT) develops mission-critical digital systems for international certification bodies, authorities, and global manufacturers.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Tagline:</strong> “From Application to Certification. All Digital.”</div>
              <div><strong className="text-slate-300">Technical Focus:</strong> Process Automation, Audit Trails & Issuance Infrastructure</div>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/solutions/halal-certification-portals" className="hover:text-emerald-400 transition-colors">
                  Certification Portals
                </Link>
              </li>
              <li>
                <Link to="/solutions/electronic-processing" className="hover:text-emerald-400 transition-colors">
                  Electronic Intake & Processing
                </Link>
              </li>
              <li>
                <Link to="/solutions/certification-management" className="hover:text-emerald-400 transition-colors">
                  Workflow Management
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Document & Evidence Control
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Certificate Issuance & QR Sealing
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Surveillance & Renewal Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform & Standards
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/platform-demo" className="hover:text-emerald-400 transition-colors font-medium text-emerald-400">
                  Interactive Platform Demo
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public Certificate Ledger</span>
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-emerald-400 transition-colors">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link to="/capabilities" className="hover:text-emerald-400 transition-colors">
                  Enterprise Capabilities
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-emerald-400 transition-colors">
                  Industries Served
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About HCPT
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium text-emerald-300">
                  <Inbox className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Console (Inquiries & Messages)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Contact Placeholders */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Institutional Inquiries
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              For bilateral demonstrations, HCB workflow evaluations, and technology briefings:
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:info@techhalal.com" className="font-mono text-slate-200 hover:text-emerald-400 transition-colors">info@techhalal.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Global Deployment Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NDA & Security Protocol Available</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Direct Contact: <Link to="/contact" className="text-emerald-400 hover:underline">Submit Official Inquiry Form</Link>
            </div>
          </div>

        </div>

        {/* Institutional Disclosure Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 font-semibold block mb-1">Institutional Notice & Regulatory Clarification:</strong>
            Halal Certification Processing Technologies (HCPT) is a software architecture and digital technology provider. HCPT engineers enterprise workflow systems, document verification platforms, and digital audit coordination portals for accredited certification bodies, Islamic affairs authorities, and manufacturing enterprises. HCPT does not independently certify products, issue religious rulings (fatwas), or substitute for the statutory decision-making authority of recognized Halal Certification Bodies (HCBs).
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Halal Certification Processing Technologies (HCPT). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Version 2.4.0 (Enterprise Release)</span>
            <Link to="/technology" className="hover:text-slate-200 transition-colors">Security Architecture</Link>
            <Link to="/about" className="hover:text-slate-200 transition-colors">Governance Model</Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">Institutional Inquiries</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
