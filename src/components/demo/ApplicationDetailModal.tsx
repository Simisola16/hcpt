import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Building,
  User,
  MessageSquare,
  ShieldCheck,
  Plus,
  Send,
  AlertCircle,
  FileCheck2,
  Calendar,
  Lock
} from 'lucide-react';
import {
  CertificationApplication,
  ApplicationStatus,
  PERMITTED_STATUS_TRANSITIONS,
  ApplicationDocument
} from '../../types/certification';
import { demoStore } from '../../services/demoStore';

interface ApplicationDetailModalProps {
  application: CertificationApplication | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  currentRole
}) => {
  if (!isOpen || !application) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'products' | 'documents' | 'timeline' | 'notes' | 'rfi'>('details');
  const [transitionStatus, setTransitionStatus] = useState<ApplicationStatus | ''>('');
  const [transitionReason, setTransitionReason] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Note state
  const [newNoteContent, setNewNoteContent] = useState('');

  // RFI state
  const [rfiFields, setRfiFields] = useState('');
  const [rfiMessage, setRfiMessage] = useState('');

  // Simulated upload state
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ApplicationDocument['category']>('Lab Analysis Report');

  const permittedTransitions = PERMITTED_STATUS_TRANSITIONS[application.status] || [];

  const handleStatusTransition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transitionStatus) return;

    const res = demoStore.updateApplicationStatus(
      application.id,
      transitionStatus as ApplicationStatus,
      transitionReason || `Status updated to ${transitionStatus}`,
      currentRole
    );

    if (res.success) {
      setStatusFeedback({ type: 'success', message: res.message });
      setTransitionStatus('');
      setTransitionReason('');
    } else {
      setStatusFeedback({ type: 'error', message: res.message });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    demoStore.addReviewerNote(application.id, newNoteContent, currentRole, 'Certification Specialist');
    setNewNoteContent('');
  };

  const handleDispatchRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiMessage.trim()) return;

    const fields = rfiFields.split(',').map((f) => f.trim()).filter(Boolean);
    demoStore.requestMissingInfo(
      application.id,
      fields.length ? fields : ['Evidentiary Clarification'],
      rfiMessage,
      currentRole
    );
    setRfiFields('');
    setRfiMessage('');
    setStatusFeedback({
      type: 'success',
      message: 'Deficiency notice (RFI) dispatched to applicant. Status updated to Awaiting Applicant Information.'
    });
  };

  const handleSimulatedDocUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName.trim()) return;

    demoStore.uploadSimulatedDocument(application.id, {
      name: uploadDocName,
      category: uploadCategory,
      fileName: `${uploadDocName.replace(/\s+/g, '_')}_2026.pdf`,
      fileSize: '2.8 MB'
    });
    setUploadDocName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs text-left animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {application.referenceNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {application.applicationType}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {application.organizationName}
            </h2>
            <div className="text-xs text-slate-400">
              Facility: {application.facilityName} ({application.facilityAddress})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                application.status === 'Approved'
                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                  : application.status === 'Technical Review'
                  ? 'bg-amber-900 text-amber-200 border border-amber-700'
                  : application.status === 'Inspection Scheduled'
                  ? 'bg-purple-900 text-purple-200 border border-purple-700'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {application.status}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold text-slate-600 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview & Status Gates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Products ({application.products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Evidence Documents ({application.documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Workflow History ({application.timeline.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Internal Notes ({application.notes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rfi')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'rfi'
                ? 'border-[#006837] text-[#006837]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Request Information (RFI)
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* Status Feedback banner */}
          {statusFeedback && (
            <div
              className={`p-3.5 rounded-lg flex items-start gap-2.5 ${
                statusFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {statusFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>{statusFeedback.message}</div>
            </div>
          )}

          {/* TAB 1: DETAILS & STATE MACHINE TRANSITION CONTROLS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sector Category</span>
                  <div className="text-slate-900 font-bold text-xs">{application.category}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Assessor</span>
                  <div className="text-slate-900 font-bold text-xs">{application.technicalAssessor || application.leadReviewer || 'Unassigned'}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Compliance Standards</span>
                  <div className="text-slate-900 font-bold text-xs">{application.standardsCompliance.join(', ')}</div>
                </div>
              </div>

              {/* State Machine Transition Interactive Form */}
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Execute Permitted Workflow Transition
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Acting as: {currentRole}
                  </span>
                </div>

                <form onSubmit={handleStatusTransition} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Target Status (Permitted Transitions Only)
                    </label>
                    <select
                      value={transitionStatus}
                      onChange={(e) => setTransitionStatus(e.target.value as ApplicationStatus)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Select permitted forward state...</option>
                      {permittedTransitions.map((st) => (
                        <option key={st} value={st}>
                          → {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Assessor Audit Justification
                    </label>
                    <input
                      type="text"
                      value={transitionReason}
                      onChange={(e) => setTransitionReason(e.target.value)}
                      placeholder="e.g. Completed initial document triage; formula verified against SMIIC 1 guidelines."
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-slate-500">
                      Disallowed transitions are mathematically blocked by system rules.
                    </div>
                    <button
                      type="submit"
                      disabled={!transitionStatus}
                      className="px-5 py-2 bg-[#006837] text-white rounded-lg font-bold text-xs hover:bg-[#00502b] disabled:opacity-40 transition-colors"
                    >
                      Record Transition
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS SCHEDULE */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-xs uppercase">
                  Certified Product Lines Schedule
                </span>
                <span className="text-slate-500 text-[11px]">
                  Total: {application.products.length} SKUs registered
                </span>
              </div>

              <div className="space-y-2">
                {application.products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        SKU: {p.sku} • Brand: {p.brand} • Country: {p.originCountry}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                        {p.ingredientsCount} raw materials
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <div className="font-bold text-slate-900 text-xs uppercase pb-2 border-b border-slate-200">
                  Evidentiary Attachments Vault
                </div>

                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <span>{doc.name}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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

                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
                        <span>Category: {doc.category}</span>
                        <span>File: {doc.fileName}</span>
                        <span>Size: {doc.fileSize}</span>
                        <span>Uploaded: {doc.uploadedAt}</span>
                      </div>

                      {doc.reviewNotes && (
                        <div className="p-2.5 rounded bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                          <strong className="text-slate-800">Assessor Finding:</strong> {doc.reviewNotes}
                        </div>
                      )}

                      {/* Quick Document Status Control */}
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => demoStore.updateDocumentStatus(application.id, doc.id, 'Approved', 'Verified compliant with ISO 17065.')}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100"
                        >
                          Mark Approved
                        </button>
                        <button
                          type="button"
                          onClick={() => demoStore.updateDocumentStatus(application.id, doc.id, 'Needs Revision', 'Assessor requested renewed supplier certificate.')}
                          className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold hover:bg-amber-100"
                        >
                          Flag Needs Revision
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Document Upload Form */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-900 text-xs">
                  Simulate Applicant Document Intake
                </div>
                <form onSubmit={handleSimulatedDocUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6 space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Document Title</label>
                    <input
                      type="text"
                      required
                      value={uploadDocName}
                      onChange={(e) => setUploadDocName(e.target.value)}
                      placeholder="e.g. Updated Gas Chromatography Lab Assay"
                      className="w-full p-2 rounded border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      className="w-full p-2 rounded border border-slate-300 text-xs bg-white"
                    >
                      <option value="Lab Analysis Report">Lab Analysis Report</option>
                      <option value="Ingredient Traceability">Ingredient Traceability</option>
                      <option value="Process Flowchart">Process Flowchart</option>
                      <option value="Halal Assurance System (HAS)">Halal Assurance System (HAS)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#006837] text-white rounded text-xs font-bold hover:bg-emerald-700"
                    >
                      Simulate Upload
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: WORKFLOW TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="font-bold text-slate-900 text-xs uppercase pb-2 border-b border-slate-200">
                Auditable Workflow State Machine History
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {application.timeline.map((evt) => (
                  <div key={evt.id} className="relative space-y-1">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#006837] ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{evt.status}</span>
                      <span className="text-slate-400 text-[10px] font-mono">{evt.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{evt.description}</div>
                    <div className="text-[11px] text-slate-400">
                      Logged by: {evt.actor} ({evt.role})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INTERNAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              
              <div className="space-y-3">
                <div className="font-bold text-slate-900 text-xs uppercase pb-2 border-b border-slate-200">
                  Assessor Collaborative Notes Ledger
                </div>

                <div className="space-y-2">
                  {application.notes.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800">{n.author} ({n.role})</span>
                        <span className="font-mono text-[10px]">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  Record Internal Assessor Note
                </label>
                <textarea
                  rows={3}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record findings regarding formulation, solvent verification, or upcoming inspection checklist items..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006837] text-white text-xs font-bold rounded hover:bg-emerald-700"
                  >
                    Post Note
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 6: REQUEST MISSING INFO (RFI) */}
          {activeTab === 'rfi' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Deficiency & Correction Request Protocol (RFI)
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Dispatching an RFI automatically transitions the application status to "Awaiting Applicant Information" and halts the processing clock until the applicant responds with compliant exhibits.
                </p>
              </div>

              <form onSubmit={handleDispatchRFI} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Deficient Fields or Exhibits (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={rfiFields}
                    onChange={(e) => setRfiFields(e.target.value)}
                    placeholder="e.g. Valid Halal Certificate for Bovine Gelatin, Residual Ethanol Assay"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Detailed Assessor Instructions to Applicant
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={rfiMessage}
                    onChange={(e) => setRfiMessage(e.target.value)}
                    placeholder="Specify exactly why the current exhibits are insufficient, the required testing threshold (e.g. OIC/SMIIC 1:2019 Clause 5.2), and required submission deadline..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-700 text-white rounded text-xs font-bold hover:bg-amber-800 transition-colors"
                >
                  Dispatch Formal RFI Notice
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
