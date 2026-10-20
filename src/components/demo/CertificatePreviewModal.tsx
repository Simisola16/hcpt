import React from 'react';
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  Building,
  Award,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { CertificateRecord } from '../../types/certification';

interface CertificatePreviewModalProps {
  certificate: CertificateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs text-left animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto flex flex-col">
        
        {/* Top Controls Header (Not Printed) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Certificate Document Generator // Reference: {certificate.certificateNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Preview</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Watermark Ribbon */}
        <div className="bg-amber-100 text-amber-950 px-4 py-2 text-[11px] font-bold text-center border-b border-amber-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>ILLUSTRATIVE DEMONSTRATION DOCUMENT — NOT A GENUINE REGULATORY CERTIFICATE — HCPT SYNTHETIC SPECIMEN</span>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 bg-white relative text-slate-900 font-sans space-y-8 border-8 border-slate-100 m-4 rounded-xl">
          
          {/* Decorative Corner Guilloché Accents */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-300 select-none">
            HCPT-SECURE-VECTOR-GUILLOCHE-SPECIMEN
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-300 select-none">
            SHA256-DIGEST-VERIFIABLE
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-3 pb-6 border-b-2 border-[#006837]/30">
            <div className="inline-block p-2 bg-slate-50 rounded-lg border border-slate-200 mb-1">
              <img
                src="/hcpt-logo.jpg"
                alt="HCPT Logo"
                className="h-16 w-auto mx-auto object-contain"
              />
            </div>
            
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-mono">
              Halal Conformity Assessment Certificate
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006837] tracking-tight">
              CERTIFICATE OF HALAL COMPLIANCE
            </h1>
            <div className="text-xs font-mono font-bold text-slate-600">
              Certificate No: <span className="text-slate-900">{certificate.certificateNumber}</span>
            </div>
          </div>

          {/* Recipient Statement */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
              This is to formally certify that the establishment:
            </p>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {certificate.organizationName}
            </div>
            <div className="text-xs text-slate-600">
              Facility Address: <strong className="text-slate-800">{certificate.facilityAddress}</strong>
            </div>
          </div>

          {/* Standard & Scope */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Governing Standard</span>
                <span className="font-bold text-slate-900">{certificate.governingStandard}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Jurisdiction</span>
                <span className="font-bold text-slate-900">{certificate.jurisdiction}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Certified Scope</span>
              <span className="text-slate-800">{certificate.scopeOfCertification}</span>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Certified Products Included in This Schedule:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white p-3 rounded border border-slate-200">
              {certificate.certifiedProducts.map((p, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Validity Dates */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-200 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Date</span>
              <span className="font-mono font-bold text-slate-900">{certificate.issueDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Expiration Date</span>
              <span className="font-mono font-bold text-[#006837]">{certificate.expiryDate}</span>
            </div>
          </div>

          {/* Signatories & Cryptographic Verification Seal */}
          <div className="pt-6 border-t-2 border-[#006837]/30 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
            
            {/* Signatories */}
            <div className="sm:col-span-8 grid grid-cols-2 gap-4 text-xs">
              {certificate.signatories.map((sig, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="font-script text-lg text-slate-800 italic underline decoration-slate-300">
                    {sig.name}
                  </div>
                  <div className="font-bold text-slate-900 text-[11px]">{sig.name}</div>
                  <div className="text-[10px] text-slate-500">{sig.role}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Digitally Signed & Validated</div>
                </div>
              ))}
            </div>

            {/* Cryptographic Seal & QR Verification */}
            <div className="sm:col-span-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
              <a
                href={`/verify?cert=${encodeURIComponent(certificate.certificateNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="group block focus:outline-none"
                title="Verify certificate live on public registry ledger"
              >
                <div className="w-16 h-16 bg-white border border-slate-300 rounded mx-auto flex items-center justify-center p-1 group-hover:border-emerald-600 group-hover:shadow-xs transition-all">
                  <QrCode className="w-14 h-14 text-slate-900 group-hover:text-emerald-700 transition-colors" />
                </div>
                <div className="text-[9px] font-mono text-slate-500 break-all pt-1">
                  SHA-256 Digest:<br />
                  <span className="text-slate-800 font-bold">{certificate.sha256Digest.substring(0, 16)}...</span>
                </div>
                <div className="text-[9px] text-emerald-800 font-bold uppercase group-hover:underline flex items-center justify-center gap-1 pt-0.5">
                  <span>Verify Online Seal</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </a>
            </div>

          </div>

          {/* Bottom Legal Disclaimer */}
          <div className="text-[9px] text-slate-400 text-center leading-relaxed pt-2">
            This digital certificate document was generated in Demonstration Mode by HCPT Engine v2.4. It serves as an illustrative artifact for software evaluation purposes only.
          </div>

        </div>

      </div>
    </div>
  );
};
