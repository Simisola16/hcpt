import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UploadCloud,
  FileCheck2,
  Filter,
  Search,
  Check,
  XCircle,
  Info
} from 'lucide-react';
import { CertificationApplication, ApplicationDocument } from '../../../types/certification';
import { demoStore } from '../../../services/demoStore';

interface DocumentsModuleProps {
  applications: CertificationApplication[];
  onSelectApplication: (id: string) => void;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({
  applications,
  onSelectApplication
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [simulatedUploadName, setSimulatedUploadName] = useState('');
  const [simulatedCategory, setSimulatedCategory] = useState<ApplicationDocument['category']>('Lab Analysis Report');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const allDocuments = activeApp ? activeApp.documents : [];
  const filteredDocs = allDocuments.filter(
    (d) => selectedCategory === 'ALL' || d.category === selectedCategory
  );

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedUploadName.trim()) return;

    demoStore.uploadSimulatedDocument(activeApp.id, {
      name: simulatedUploadName,
      category: simulatedCategory,
      fileName: `${simulatedUploadName.replace(/\s+/g, '_')}_2026.pdf`,
      fileSize: '3.4 MB'
    });

    setSimulatedUploadName('');
    setFeedback(`Simulated file "${simulatedUploadName}" added to intake queue for ${activeApp.referenceNumber}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Document & Evidence Management Repository
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Classified evidentiary documents, laboratory certificates, and CIP sanitation flowcharts.
        </p>
      </div>

      {/* Mandatory Notice regarding simulation */}
      <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Demonstration Scope Notice:</strong> File uploads in this demonstration mode simulate intake metadata, version stamps, and review actions locally in your browser. No files are transmitted to public clouds.
        </div>
      </div>

      {/* Select Application Dossier */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">Active Application Dossier:</span>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 text-xs"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.referenceNumber} — {a.organizationName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Category Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
          >
            <option value="ALL">All Categories ({allDocuments.length})</option>
            <option value="Ingredient Traceability">Ingredient Traceability</option>
            <option value="Lab Analysis Report">Lab Analysis Report</option>
            <option value="Process Flowchart">Process Flowchart</option>
            <option value="Halal Assurance System (HAS)">Halal Assurance System</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 card-enterprise"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    {doc.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {doc.fileName} • {doc.fileSize}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  doc.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-900'
                    : doc.status === 'Under Review'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {doc.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 p-2.5 rounded bg-slate-50 border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Category:</span>
                <span className="font-medium text-slate-700">{doc.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Version:</span>
                <span className="font-mono text-slate-700">{doc.version}</span>
              </div>
            </div>

            {doc.reviewNotes && (
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/80">
                <strong className="text-slate-800">Assessor Finding:</strong> {doc.reviewNotes}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => demoStore.updateDocumentStatus(activeApp.id, doc.id, 'Approved', 'Verified during demonstration review.')}
                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => demoStore.updateDocumentStatus(activeApp.id, doc.id, 'Needs Revision', 'Assessor requested revised batch laboratory certificate.')}
                  className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold hover:bg-amber-100"
                >
                  Request Revision
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Document Upload Form */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <UploadCloud className="w-4 h-4 text-emerald-700" />
          <span>Simulate Applicant Document Intake</span>
        </div>

        <form onSubmit={handleSimulateUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Exhibit Title</label>
            <input
              type="text"
              required
              value={simulatedUploadName}
              onChange={(e) => setSimulatedUploadName(e.target.value)}
              placeholder="e.g. Revised Gas Chromatography Assay for Vanillin"
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Category</label>
            <select
              value={simulatedCategory}
              onChange={(e) => setSimulatedCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="Lab Analysis Report">Lab Analysis Report</option>
              <option value="Ingredient Traceability">Ingredient Traceability</option>
              <option value="Process Flowchart">Process Flowchart</option>
              <option value="Halal Assurance System (HAS)">Halal Assurance System</option>
              <option value="Commercial Registration">Commercial Registration</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#006837] text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Simulate Upload
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
