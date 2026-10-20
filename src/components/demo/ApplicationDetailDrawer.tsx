import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  UploadCloud,
  Award,
  Lock,
  ChevronRight,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import {
  CertificationApplication,
  ApplicationStatus,
  PERMITTED_STATUS_TRANSITIONS,
  ApplicationDocument
} from '../../types/certification';
import { demoStore } from '../../services/demoStore';
import { SimulateUploadModal } from './SimulateUploadModal';

interface ApplicationDetailDrawerProps {
  application: CertificationApplication | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenCertificateModal: (certificateNumber: string) => void;
  onOpenScheduleInspection: (applicationId: string) => void;
}

export const ApplicationDetailDrawer: React.FC<ApplicationDetailDrawerProps> = ({
  application,
  onClose,
  onRefresh,
  onOpenCertificateModal,
  onOpenScheduleInspection
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'workflow' | 'notes' | 'rfis'>('overview');
  
  // Status transition state
  const [selectedNextStatus, setSelectedNextStatus] = useState<ApplicationStatus | ''>('');
  const [transitionReason, setTransitionReason] = useState('');
  const [transitionMessage, setTransitionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Add Note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isNoteInternal, setIsNoteInternal] = useState(true);

  // RFI state
  const [isRfiOpen, setIsRfiOpen] = useState(false);
  const [rfiFields, setRfiFields] = useState('Supplier Certificate for Emulsifier E471');
  const [rfiMessage, setRfiMessage] = useState('Please supply updated ISO 17065-accredited Halal certificate for the imported glycerol monostearate.');

  // Document upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Issue Certificate state
  const [isIssuingCert, setIsIssuingCert] = useState(false);

  if (!application) return null;

  const permittedNext = PERMITTED_STATUS_TRANSITIONS[application.status] || [];

  const handleStatusTransition = (e: React.FormEvent) => {
    e.preventDefault();
    setTransitionMessage(null);

    if (!selectedNextStatus) {
      setTransitionMessage({ type: 'error', text: 'Please select a permitted target status.' });
      return;
    }
    if (!transitionReason.trim() || transitionReason.length < 5) {
      setTransitionMessage({ type: 'error', text: 'Please provide a justification (min 5 characters) for audit trail records.' });
      return;
    }

    const res = demoStore.updateApplicationStatus(
      application.id,
      selectedNextStatus as ApplicationStatus,
      transitionReason
    );

    if (res.success) {
      setTransitionMessage({ type: 'success', text: res.message });
      setSelectedNextStatus('');
      setTransitionReason('');
      onRefresh();
    } else {
      setTransitionMessage({ type: 'error', text: res.message });
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    demoStore.addReviewerNote(
      application.id,
      newNoteContent,
      'Dr. Tariq Al-Hashimi',
      'Lead Technical Assessor',
      isNoteInternal
    );

    setNewNoteContent('');
    onRefresh();
  };

  const handleDispatchRfi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiFields.trim() || !rfiMessage.trim()) return;

    demoStore.requestMissingInfo(
      application.id,
      rfiFields.split(',').map(f => f.trim()),
      rfiMessage,
      'Technical Audit Desk'
    );

    setIsRfiOpen(false);
    onRefresh();
  };

  const handleUpdateDocStatus = (docId: string, status: ApplicationDocument['status']) => {
    demoStore.updateDocumentStatus(
      application.id,
      docId,
      status,
      `Status marked as ${status} by Technical Assessor.`
    );
    onRefresh();
  };

  const handleIssueCertificate = () => {
    setIsIssuingCert(true);
    const res = demoStore.issueCertificateForApplication(application.id);
    setIsIssuingCert(false);
    if (res.success && res.certificate) {
      onRefresh();
      onOpenCertificateModal(res.certificate.id);
    } else {
      setTransitionMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col text-left animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                {application.referenceNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {application.status}
              </span>
              <span className="text-xs text-slate-400">
                Type: {application.applicationType}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {application.organizationName}
            </h2>
            <p className="text-xs text-slate-400">
              {application.facilityName} — {application.facilityAddress}, {application.country}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close detail drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Products ({application.products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Evidentiary Documents ({application.documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Workflow State Machine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessor Notes ({application.notes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rfis')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'rfis'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            RFI Notices ({application.missingInfoRequests.length})
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & PRODUCTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Category:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.category}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Submission Date:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.submissionDate}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Last Modified:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.lastUpdated}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Lead Reviewer:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.leadReviewer || 'Unassigned'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Technical Assessor:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.technicalAssessor || 'Unassigned'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Assigned Inspector:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{application.assignedInspector || 'Pending Schedule'}</div>
                </div>
              </div>

              {/* Standards Applied */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Governing Halal Standards
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.standardsCompliance.map((std, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Products Schedule */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Product Schedule for Halal Scope ({application.products.length} Items)
                  </h4>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Product Name</th>
                        <th className="py-2 px-3">SKU</th>
                        <th className="py-2 px-3">Brand</th>
                        <th className="py-2 px-3 text-center">Ingredients</th>
                        <th className="py-2 px-3">Origin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {application.products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{p.sku}</td>
                          <td className="py-2.5 px-3 text-slate-700">{p.brand}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{p.ingredientsCount}</td>
                          <td className="py-2.5 px-3 text-slate-600">{p.originCountry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                {application.status === 'Approved' && (
                  <button
                    type="button"
                    onClick={handleIssueCertificate}
                    disabled={isIssuingCert}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Issue Tamper-Evident Certificate</span>
                  </button>
                )}

                {application.certificateId && (
                  <button
                    type="button"
                    onClick={() => onOpenCertificateModal(application.certificateId!)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>View Issued Halal Certificate</span>
                  </button>
                )}

                {(application.status === 'Technical Review' || application.status === 'Initial Review') && (
                  <button
                    type="button"
                    onClick={() => onOpenScheduleInspection(application.id)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule On-Site Inspection</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Evidentiary Dossier & Regulatory Attachments
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ingredient declarations, lab analysis reports, and HACCP flowcharts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Simulate Document Upload</span>
                </button>
              </div>

              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{doc.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'Needs Revision'
                              ? 'bg-amber-100 text-amber-800'
                              : doc.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span className="font-mono">{doc.fileName}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>{doc.version}</span>
                          <span>•</span>
                          <span className="text-emerald-800 font-medium">{doc.category}</span>
                        </div>
                      </div>

                      {/* Review Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.id, 'Approved')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.id, 'Needs Revision')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          Need Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.id, 'Rejected')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {doc.reviewNotes && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                        <strong className="text-slate-700">Audit Notes:</strong> {doc.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORKFLOW STATE MACHINE */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              
              {/* Permitted Transition Box */}
              <div className="card-enterprise rounded-xl p-5 bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Execute Workflow Status Transition
                    </h4>
                    <p className="text-xs text-slate-500">
                      Current State: <strong className="text-emerald-700 font-bold">{application.status}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 text-slate-700">
                    State Machine Enforced
                  </span>
                </div>

                {transitionMessage && (
                  <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    transitionMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}>
                    {transitionMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>{transitionMessage.text}</span>
                  </div>
                )}

                {permittedNext.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                    No further transitions are permitted from terminal state "{application.status}".
                  </div>
                ) : (
                  <form onSubmit={handleStatusTransition} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Select Permitted Target Status ({permittedNext.length} Available)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {permittedNext.map((st) => (
                          <label
                            key={st}
                            className={`p-3 rounded-lg border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                              selectedNextStatus === st
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{st}</span>
                            </span>
                            <input
                              type="radio"
                              name="nextStatus"
                              value={st}
                              checked={selectedNextStatus === st}
                              onChange={() => setSelectedNextStatus(st)}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mandatory Transition Justification / Regulatory Reason
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Technical review concluded; scheduled on-site inspection for audit verification."
                        value={transitionReason}
                        onChange={(e) => setTransitionReason(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Advance Workflow to {selectedNextStatus || '...'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Status History Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Application Status History & Audit Trail
                </h4>
                <div className="border-l-2 border-slate-200 ml-4 pl-4 space-y-4">
                  {application.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{event.status}</span>
                        <span className="text-[11px] font-normal text-slate-400">({event.timestamp})</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {event.description}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Actor: {event.actor} — <span className="text-emerald-800">{event.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Record Assessor Technical Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Record observation regarding ingredient suppliers, enzyme certificates, or inspection recommendations..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNoteInternal}
                      onChange={(e) => setIsNoteInternal(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Internal confidential assessor note (hidden from applicant)</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </form>

              {/* Notes Stream */}
              <div className="space-y-3">
                {application.notes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notes recorded yet.</p>
                ) : (
                  application.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{note.author}</span>
                          <span className="text-[11px] font-medium text-emerald-800">({note.role})</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          {note.isInternal && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                              Internal
                            </span>
                          )}
                          <span>{note.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: RFIs (REQUEST FOR INFORMATION) */}
          {activeTab === 'rfis' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Deficiency Notices & Requests for Information (RFI)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dispatched to applicant when documentation or formulation proof is incomplete
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRfiOpen(!isRfiOpen)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Dispatch New RFI</span>
                </button>
              </div>

              {isRfiOpen && (
                <form onSubmit={handleDispatchRfi} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="text-xs font-bold text-amber-900">
                    Dispatch Formal Information Request (Transitions Status to "Awaiting Applicant Information")
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Required Documents / Formulation Data
                    </label>
                    <input
                      type="text"
                      value={rfiFields}
                      onChange={(e) => setRfiFields(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Detailed Instructions for Applicant QA
                    </label>
                    <textarea
                      rows={2}
                      value={rfiMessage}
                      onChange={(e) => setRfiMessage(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRfiOpen(false)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold"
                    >
                      Dispatch RFI
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {application.missingInfoRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No active or past RFIs.</p>
                ) : (
                  application.missingInfoRequests.map((rfi) => (
                    <div
                      key={rfi.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Dispatched: {rfi.requestedAt} by {rfi.requestedBy}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          rfi.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rfi.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{rfi.message}</p>
                      <div className="text-[11px] text-slate-500">
                        <strong>Requested items:</strong> {rfi.requestedFields.join(', ')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal: Document Intake */}
        <SimulateUploadModal
          applicationId={application.id}
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploaded={() => {
            onRefresh();
          }}
        />

      </div>
    </div>
  );
};
