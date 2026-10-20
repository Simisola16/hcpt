import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  SlidersHorizontal,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CertificationApplication, ApplicationStatus } from '../../../types/certification';

interface ApplicationsModuleProps {
  applications: CertificationApplication[];
  onSelectApplication: (id: string) => void;
}

export const ApplicationsModule: React.FC<ApplicationsModuleProps> = ({
  applications,
  onSelectApplication
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      searchTerm === '' ||
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Certification Applications Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and process application files across all regulatory review gates.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ref, org, SKU, or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              <option value="Initial Review">Initial Review</option>
              <option value="Technical Review">Technical Review</option>
              <option value="Awaiting Applicant Information">Awaiting Applicant Info</option>
              <option value="Inspection Scheduled">Inspection Scheduled</option>
              <option value="Approved">Approved</option>
              <option value="Certificate Issued">Certificate Issued</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Ingredients & Additives">Ingredients & Additives</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="Logistics & Warehousing">Logistics & Warehousing</option>
            </select>
          </div>
        </div>

      </div>

      {/* Applications Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Application Ref</th>
                <th className="py-3 px-4">Organization & Facility</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Standards</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No application records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {app.referenceNumber}
                      <div className="text-[10px] text-slate-400 font-sans font-normal">
                        {app.applicationType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.organizationName}</div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {app.facilityName} ({app.country})
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {app.category}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {app.standardsCompliance[0]}
                      {app.standardsCompliance.length > 1 && (
                        <span className="ml-1 text-[10px] text-slate-400">
                          +{app.standardsCompliance.length - 1}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {app.products.length} SKUs
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : app.status === 'Technical Review'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : app.status === 'Inspection Scheduled'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : app.status === 'Awaiting Applicant Information'
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : app.status === 'Certificate Issued'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {app.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(app.id);
                        }}
                        className="px-3 py-1.5 rounded bg-slate-100 hover:bg-[#006837] hover:text-white font-semibold text-[11px] text-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Showing {filtered.length} of {applications.length} applications</span>
          <span className="font-mono">Audit Gate State Machine v2.4</span>
        </div>
      </div>

    </div>
  );
};
