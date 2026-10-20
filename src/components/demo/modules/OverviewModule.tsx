import React from 'react';
import {
  FileText,
  Clock,
  Calendar,
  Award,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Workflow,
  Sparkles
} from 'lucide-react';
import { CertificationApplication, CertificateRecord, InspectionRecord } from '../../../types/certification';
import { DemoTab } from '../DemoSidebar';

interface OverviewModuleProps {
  applications: CertificationApplication[];
  certificates: CertificateRecord[];
  inspections: InspectionRecord[];
  setActiveTab: (tab: DemoTab) => void;
  onSelectApplication: (id: string) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  applications,
  certificates,
  inspections,
  setActiveTab,
  onSelectApplication
}) => {
  const awaitingReviewCount = applications.filter(
    (a) =>
      a.status === 'Submitted' ||
      a.status === 'Initial Review' ||
      a.status === 'Technical Review' ||
      a.status === 'Decision Pending'
  ).length;

  const scheduledInspectionsCount = inspections.filter((i) => i.status === 'Scheduled').length;
  const activeCertsCount = certificates.filter((c) => c.status === 'Active' || c.status === 'Approaching Expiry').length;
  const expiringCertsCount = certificates.filter((c) => c.status === 'Approaching Expiry').length;

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Executive Operations Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status overview of active application files, on-site inspections, and certificate lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className="px-3.5 py-2 bg-[#006837] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Manage Applications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspections')}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Dispatch Inspections
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Applications</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {applications.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
            <span className="font-semibold text-emerald-700">100% digital</span> intake queue
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900">
            {awaitingReviewCount}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Assessor & Shariah triage
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-purple-700 text-xs font-semibold uppercase">
            <span>Inspections Scheduled</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-900">
            {scheduledInspectionsCount}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Active field audits
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase">
            <span>Issued Certificates</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#006837]">
            {activeCertsCount}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Cryptographically sealed
          </div>
        </div>

        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold uppercase">
            <span>Expiry &lt; 90 Days</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-900">
            {expiringCertsCount}
          </div>
          <div className="text-[11px] text-rose-700 font-medium pt-1">
            Surveillance notice active
          </div>
        </div>

      </div>

      {/* Middle Grid: Applications Distribution & Outstanding Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Applications Priority Action List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Workflow className="w-4 h-4 text-emerald-700" />
              <span>Priority Applications Requiring Attention</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-[#006837] hover:underline flex items-center gap-1"
            >
              <span>View All ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setActiveTab('applications');
                  onSelectApplication(app.id);
                }}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {app.referenceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {app.category}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {app.organizationName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {app.facilityName} ({app.country})
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : app.status === 'Technical Review'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : app.status === 'Inspection Scheduled'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : app.status === 'Awaiting Applicant Information'
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Updated {app.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Status Breakdown & Rapid Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Status Breakdown Box */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Application Pipeline Distribution</span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => {
                const percentage = Math.round((count / applications.length) * 100);
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{status}</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#006837] h-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guided Actions Box */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 text-white space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Demonstration Actions</span>
            </div>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('applications');
                  onSelectApplication('app-814');
                }}
                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <span>Advance Crescent Foods to Inspection Stage</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('certificates');
                }}
                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <span>Inspect Cryptographic Certificate & QR Link</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                }}
                className="w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <span>Issue Missing Information Notice (RFI)</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
