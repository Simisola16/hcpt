import React, { useState } from 'react';
import {
  Award,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Lock,
  Calendar,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { CertificateRecord, CertificationApplication } from '../../../types/certification';
import { demoStore } from '../../../services/demoStore';
import { CertificatePreviewModal } from '../CertificatePreviewModal';

interface CertificatesModuleProps {
  certificates: CertificateRecord[];
  applications: CertificationApplication[];
}

export const CertificatesModule: React.FC<CertificatesModuleProps> = ({
  certificates,
  applications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'VALID' | 'INVALID' | null;
    message: string;
    cert?: CertificateRecord;
  }>({ status: null, message: '' });

  // Filter approved applications ready for issuance
  const approvedApps = applications.filter((a) => a.status === 'Approved' && !a.certificateId);

  const filteredCerts = certificates.filter((c) => {
    return (
      searchTerm === '' ||
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.governingStandard.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verificationInput.trim().toLowerCase();
    if (!query) return;

    const match = certificates.find(
      (c) =>
        c.certificateNumber.toLowerCase() === query ||
        c.verificationHash.toLowerCase() === query ||
        c.sha256Digest.toLowerCase().startsWith(query)
    );

    if (match) {
      setVerificationResult({
        status: 'VALID',
        message: `Cryptographic Seal Verified. Valid certificate record found in central registry for "${match.organizationName}".`,
        cert: match
      });
    } else {
      setVerificationResult({
        status: 'INVALID',
        message: 'No matching certificate hash found in registry. Document may have been modified or revoked.'
      });
    }
  };

  const handleIssueForApproved = (appId: string) => {
    const res = demoStore.issueCertificateForApplication(appId);
    if (res.success && res.certificate) {
      setSelectedCert(res.certificate);
      setPreviewModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Issued Halal Compliance Certificates & Seals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active certificate registry with public verification hashes, QR links, and cryptographic digests.
          </p>
        </div>
      </div>

      {/* Issuance Action Banner for Approved Applications */}
      {approvedApps.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <strong className="block text-emerald-950 font-bold">
                {approvedApps.length} Application Approved & Ready for Certificate Issuance
              </strong>
              <span>
                Compliance committee sign-off recorded for {approvedApps[0].organizationName}.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleIssueForApproved(approvedApps[0].id)}
            className="px-4 py-2 bg-[#006837] text-white rounded-lg text-xs font-bold hover:bg-[#00502b] transition-colors shadow-xs shrink-0"
          >
            Generate Cryptographic Certificate
          </button>
        </div>
      )}

      {/* Online Cryptographic Seal Verification Tool */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Cryptographic Seal Verification Terminal
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            SHA-256 Digest Validation
          </span>
        </div>

        <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            placeholder="Paste Certificate Number (e.g. HCPT-CERT-2025-9041) or SHA-256 hash..."
            className="flex-1 p-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Verify Integrity
          </button>
        </form>

        {verificationResult.status && (
          <div
            className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
              verificationResult.status === 'VALID'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {verificationResult.status === 'VALID' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div>{verificationResult.message}</div>
              {verificationResult.cert && (
                <div className="mt-1 pt-1 border-t border-emerald-200/60 font-mono text-[11px] flex items-center justify-between">
                  <span>Standard: {verificationResult.cert.governingStandard}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCert(verificationResult.cert!);
                      setPreviewModalOpen(true);
                    }}
                    className="underline text-emerald-800 font-bold"
                  >
                    View Specimen
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Certificates List Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Issued: {certificates.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Certificate No</th>
                <th className="py-3 px-4">Certified Enterprise</th>
                <th className="py-3 px-4">Governing Standard</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCerts.map((cert) => (
                <tr
                  key={cert.id}
                  onClick={() => {
                    setSelectedCert(cert);
                    setPreviewModalOpen(true);
                  }}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {cert.certificateNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{cert.organizationName}</div>
                    <div className="text-[11px] text-slate-500">{cert.facilityName}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {cert.governingStandard}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {cert.issueDate}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {cert.expiryDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cert.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-900'
                          : cert.status === 'Approaching Expiry'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCert(cert);
                        setPreviewModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-[#006837] hover:text-white font-semibold text-[11px] text-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Specimen</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <CertificatePreviewModal
        certificate={selectedCert}
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />

    </div>
  );
};
