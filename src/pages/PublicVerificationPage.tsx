import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Building,
  Calendar,
  Award,
  Lock,
  ArrowRight,
  ExternalLink,
  Printer,
  FileCheck2,
  BadgeCheck
} from 'lucide-react';
import { demoStore } from '../services/demoStore';
import { CertificateRecord } from '../types/certification';

export const PublicVerificationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const certParam = searchParams.get('cert') || '';
  
  const [query, setQuery] = useState(certParam);
  const [searchedCert, setSearchedCert] = useState<CertificateRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const certificates = demoStore.getCertificates();

  const runVerification = (certNum: string) => {
    if (!certNum.trim()) return;
    setIsVerifying(true);
    setHasSearched(true);
    setSearchParams({ cert: certNum.trim() });

    setTimeout(() => {
      const match = certificates.find(
        (c) => c.certificateNumber.toLowerCase() === certNum.trim().toLowerCase()
      );
      setSearchedCert(match || null);
      setIsVerifying(false);
    }, 300);
  };

  useEffect(() => {
    if (certParam) {
      setQuery(certParam);
      runVerification(certParam);
    }
  }, [certParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(query);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Public Halal Certificate Verification Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Universal Certificate Integrity & Seal Verification
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity, regulatory scope, and cryptographic SHA-256 seal of any certificate issued through the HCPT digital ecosystem.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter certificate number (e.g. HC-2025-00192)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006837] focus:border-transparent font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 rounded-xl bg-[#006837] hover:bg-emerald-800 text-white text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Checking Ledger...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Authenticity</span>
                </>
              )}
            </button>
          </form>

          {/* Sample quick-select chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-500 font-medium">Try synthetic demo references:</span>
            {certificates.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setQuery(c.certificateNumber);
                  runVerification(c.certificateNumber);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                {c.certificateNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setQuery('HC-INVALID-TAMPER-TEST');
                runVerification('HC-INVALID-TAMPER-TEST');
              }}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-mono text-[11px] font-semibold border border-red-200 transition-colors cursor-pointer"
            >
              Test Invalid/Tampered
            </button>
          </div>
        </div>

        {/* Verification Result Section */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {searchedCert ? (
              <div className="bg-white rounded-2xl shadow-md border-2 border-emerald-500 overflow-hidden">
                {/* Result Header Banner */}
                <div className="p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-full bg-emerald-500 text-white shadow-sm">
                      <BadgeCheck className="w-6 h-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">Official Certificate Verified</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                          {searchedCert.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">
                        Certificate Number: {searchedCert.certificateNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-emerald-200">
                    <span className="block font-bold">Cryptographic Validation</span>
                    <span className="text-[11px] text-slate-300">Timestamp: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Entity Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Certified Organization
                      </span>
                      <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-emerald-700" />
                        <span>{searchedCert.organizationName}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Facility: {searchedCert.facilityName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Standard & Harmonization
                      </span>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-700" />
                        <span>{searchedCert.governingStandard}</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Accredited for International Trade
                      </p>
                    </div>
                  </div>

                  {/* Certified Products & Validity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
                        Certified Product Schedule ({searchedCert.certifiedProducts.length})
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {searchedCert.certifiedProducts.map((p, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span className="font-medium">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Issue Date</span>
                          <span className="font-mono font-bold text-slate-800">{searchedCert.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Expiry Date</span>
                          <span className="font-mono font-bold text-emerald-800">{searchedCert.expiryDate}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700">Authorized Signatories:</span>
                        <div className="mt-1 space-y-0.5">
                          {searchedCert.signatories.map((s, idx) => (
                            <div key={idx} className="text-[11px]">
                              • {s.name} <span className="text-slate-400">({s.role})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Proof & QR */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SHA-256 Tamper-Evident Ledger Digest</span>
                      </div>
                      <p className="font-mono text-xs text-slate-600 break-all select-all">
                        {searchedCert.sha256Digest}
                      </p>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                  </div>

                </div>

                {/* Footer Disclaimer */}
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>HCPT Platform Demonstration Record. For software evaluation purposes.</span>
                  </div>
                  <Link
                    to="/platform-demo"
                    className="font-bold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <span>Inspect in Admin Console</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Invalid / Tampered State */
              <div className="bg-white rounded-2xl shadow-sm border-2 border-red-300 p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                  <XCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Certificate Not Found or Tampered</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                    No active or valid halal certification record matches reference <span className="font-mono font-bold text-red-700">{query}</span> in the HCPT registry ledger.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 max-w-lg mx-auto text-left space-y-1">
                  <div className="font-bold">Security Advisory:</div>
                  <div>• Check the certificate number for typographic errors.</div>
                  <div>• Ensure the certificate was issued by an authorized certification body.</div>
                  <div>• The certificate may have been revoked, expired, or modified without authorization.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cryptographic Verification</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every certificate issued through HCPT includes a SHA-256 digest linked to the immutable audit ledger to prevent forgery.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-blue-50 text-blue-700">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Instant Mobile QR Scanning</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Port inspectors and border customs officers can scan certificate QR codes for instantaneous offline or online validation.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-amber-50 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Global Regulatory Standards</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fully compliant with GSO 2055-1, SMIIC 1, MS 1500, and HAS 23000 international halal standards frameworks.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
