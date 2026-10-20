import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  QrCode,
  Lock,
  CheckCircle2,
  Calendar,
  Building,
  Award,
  Hash,
  ExternalLink
} from 'lucide-react';
import { CertificateRecord } from '../../types/certification';

interface CertificateModalProps {
  certificate: CertificateRecord | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Digital Halal Certificate Preview & Cryptographic Verification
              </h3>
              <p className="text-xs text-slate-400">
                Tamper-evident electronic certificate issued by HCPT Workflow Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-8 sm:p-12 bg-[#FCFDFB] text-slate-900 relative">
          
          {/* Institutional Border Frame */}
          <div className="border-4 border-double border-emerald-900/80 p-8 sm:p-10 rounded-xl relative bg-white shadow-xs">
            
            {/* Watermark Notice Banner across top */}
            <div className="no-print mb-6 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs text-center font-medium">
              ⚠️ <strong>DEMONSTRATION SPECIMEN:</strong> This electronic certificate is generated for system demonstration purposes by HCPT. It is not an actual statutory religious ruling or legal export attestation.
            </div>

            {/* Arabic Calligraphy Header */}
            <div className="text-center space-y-1 mb-6">
              <div className="text-xl sm:text-2xl font-serif text-emerald-900 tracking-wider">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                In the Name of Allah, the Most Gracious, the Most Merciful
              </div>
            </div>

            {/* Certificate Header: Logo & Titles */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-emerald-900/20">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                  International Halal Assurance Registry
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  CERTIFICATE OF HALAL COMPLIANCE
                </h1>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  Issued under Jurisdiction: {certificate.jurisdiction}
                </div>
              </div>
              <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-xs">
                <img
                  src="/hcpt-logo.jpg"
                  alt="HCPT Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>

            {/* Certificate Number & Status Ribbon */}
            <div className="my-6 flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Certificate Reference:</span>
                <span className="font-mono font-bold text-slate-900 text-sm px-2 py-0.5 bg-white border border-slate-300 rounded">
                  {certificate.certificateNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Application File:</span>
                <span className="font-mono text-slate-700">{certificate.applicationRef}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Registry Status:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {certificate.status}
                </span>
              </div>
            </div>

            {/* Certified Entity Details */}
            <div className="space-y-6 my-6 text-sm text-slate-700">
              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  This is to certify that the organization:
                </p>
                <h2 className="text-xl font-bold text-emerald-950">
                  {certificate.organizationName}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Operating at certified facility: <strong className="text-slate-800">{certificate.facilityName}</strong> — {certificate.facilityAddress}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Has been audited and found to comply with standard:
                </p>
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 font-bold text-sm">
                  {certificate.governingStandard}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Scope of Halal Certification:
                </p>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {certificate.scopeOfCertification}
                </p>
              </div>

              {/* Certified Products Schedule */}
              <div>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Certified Product Schedule ({certificate.certifiedProducts.length} approved items):
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Item #</th>
                        <th className="py-2 px-3">Product Description</th>
                        <th className="py-2 px-3 text-right">Halal Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {certificate.certifiedProducts.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 font-mono text-slate-500">{(idx + 1).toString().padStart(2, '0')}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{prod}</td>
                          <td className="py-2 px-3 text-right">
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              HALAL CERTIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Validity Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Issue Date (Effective):</span>
                  <div className="text-sm font-bold text-slate-900">{certificate.issueDate}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Expiration Date (Recertification Due):</span>
                  <div className="text-sm font-bold text-slate-900 text-emerald-800">{certificate.expiryDate}</div>
                </div>
              </div>
            </div>

            {/* Cryptographic Tamper-Proof Block */}
            <div className="my-6 p-4 rounded-xl bg-slate-950 text-slate-200 border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cryptographic Security & Verification Seal</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all leading-tight">
                    <strong className="text-slate-300">SHA-256 Digest:</strong> {certificate.sha256Digest}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all leading-tight">
                    <strong className="text-slate-300">Digital Seal:</strong> {certificate.cryptographicSignature}
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    Central Registry Token: <strong className="font-mono text-emerald-300">{certificate.verificationHash}</strong>
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg text-slate-900 text-center shrink-0">
                  <div className="w-16 h-16 bg-slate-100 flex items-center justify-center border border-slate-300 rounded font-mono text-[9px] text-slate-600">
                    [QR CODE]
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-1">Scan to Verify</span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t-2 border-emerald-900/20 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center sm:text-left">
              {certificate.signatories.map((sig, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-center sm:justify-start pb-1">
                    <span className="font-serif italic text-emerald-900 text-sm font-semibold">
                      {sig.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{sig.name}</div>
                  <div className="text-[11px] text-emerald-800 font-medium">{sig.role}</div>
                  <div className="text-[10px] text-slate-500">{sig.designation}</div>
                </div>
              ))}
            </div>

            {/* Official Stamp Simulation */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
              Electronic Certificate Document Generated by Halal Certification Processing Technologies Platform Engine.
              <br />
              This document contains cryptographic signatures verifiable against public registry keys.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
