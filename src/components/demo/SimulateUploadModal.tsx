import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileCheck2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { ApplicationDocument } from '../../types/certification';
import { demoStore } from '../../services/demoStore';

interface SimulateUploadModalProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const CATEGORIES: ApplicationDocument['category'][] = [
  'Ingredient Traceability',
  'Lab Analysis Report',
  'Process Flowchart',
  'HACCP & Quality Manual',
  'Halal Assurance System (HAS)',
  'Facility Floorplan',
  'Commercial Registration'
];

export const SimulateUploadModal: React.FC<SimulateUploadModalProps> = ({
  applicationId,
  isOpen,
  onClose,
  onUploaded
}) => {
  const [name, setName] = useState('Supplier Gelatin Certificate & Lot Assay');
  const [category, setCategory] = useState<ApplicationDocument['category']>('Ingredient Traceability');
  const [fileName, setFileName] = useState('gelatin_bovine_cert_lot8492.pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      demoStore.uploadSimulatedDocument(applicationId, {
        name,
        category,
        fileName,
        fileSize
      });
      setIsUploading(false);
      onUploaded();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulate Evidentiary Document Intake
              </h3>
              <p className="text-xs text-slate-400">
                Attach regulatory dossiers, lab assays, or halal assurances
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          ℹ️ <strong>Demonstration Notice:</strong> In this interactive prototype, file uploads are simulated into browser memory and local session storage. No actual binary file data is permanently transferred to a cloud object store.
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Document Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Evidence Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ApplicationDocument['category'])}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Simulated File Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* Drag & drop simulated box */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">
              Simulated File: <span className="font-mono text-emerald-800">{fileName}</span> ({fileSize})
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Standard formats: PDF, DOCX, XLSX up to 50MB
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Registering File...' : 'Complete Simulated Upload'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
