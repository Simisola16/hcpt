import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  FolderArchive,
  CheckCircle2,
  CalendarCheck,
  Award,
  RefreshCw,
  BarChart3,
  History,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  AlertTriangle,
  Check,
  X,
  FileCheck2,
  Lock,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

import { demoStore } from '../services/demoStore';
import { apiClient } from '../services/apiClient';
import {
  CertificationApplication,
  Organization,
  InspectionRecord,
  CertificateRecord,
  RenewalRecord,
  AuditHistoryEvent,
  ApplicationStatus
} from '../types/certification';

import { DemoHeader } from '../components/demo/DemoHeader';
import { DemoSidebar, DemoTabKey } from '../components/demo/DemoSidebar';
import { GuidedTourWidget, TOUR_STEPS } from '../components/demo/GuidedTourWidget';
import { CertificateModal } from '../components/demo/CertificateModal';
import { ApplicationDetailDrawer } from '../components/demo/ApplicationDetailDrawer';
import { ScheduleInspectionModal } from '../components/demo/ScheduleInspectionModal';
import { CompleteInspectionModal } from '../components/demo/CompleteInspectionModal';

export const PlatformDemoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as DemoTabKey) || 'overview';

  const [activeTab, setActiveTab] = useState<DemoTabKey>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data state synced with demoStore
  const [applications, setApplications] = useState<CertificationApplication[]>(() => demoStore.getApplications());
  const [organizations, setOrganizations] = useState<Organization[]>(() => demoStore.getOrganizations());
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => demoStore.getInspections());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => demoStore.getCertificates());
  const [renewals, setRenewals] = useState<RenewalRecord[]>(() => demoStore.getRenewals());
  const [auditLogs, setAuditLogs] = useState<AuditHistoryEvent[]>(() => demoStore.getAuditHistory());

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal & Drawer states
  const [selectedApp, setSelectedApp] = useState<CertificationApplication | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [selectedInspectionForComplete, setSelectedInspectionForComplete] = useState<InspectionRecord | null>(null);
  const [isScheduleInspectionOpen, setIsScheduleInspectionOpen] = useState(false);
  const [scheduleForAppId, setScheduleForAppId] = useState<string | undefined>(undefined);
  const [selectedOrgModal, setSelectedOrgModal] = useState<Organization | null>(null);

  // Guided Tour state
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Subscribe to demoStore changes
  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setApplications(demoStore.getApplications());
      setOrganizations(demoStore.getOrganizations());
      setInspections(demoStore.getInspections());
      setCertificates(demoStore.getCertificates());
      setRenewals(demoStore.getRenewals());
      setAuditLogs(demoStore.getAuditHistory());

      // If active app updated, sync selected app
      if (selectedApp) {
        const updated = demoStore.getApplicationById(selectedApp.id);
        if (updated) setSelectedApp(updated);
      }
    });
    return unsubscribe;
  }, [selectedApp]);

  // Synchronize URL query params
  const handleTabChange = (newTab: DemoTabKey) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default enterprise baseline?')) {
      demoStore.resetToDefaults();
      setSelectedApp(null);
      setSelectedCert(null);
      setSelectedInspectionForComplete(null);
    }
  };

  // Handle tour step selection
  const handleTourStepSelect = (index: number) => {
    setTourStepIndex(index);
    const step = TOUR_STEPS[index];
    if (step) {
      handleTabChange(step.tab as DemoTabKey);
      if (step.targetId && step.tab === 'applications') {
        const target = demoStore.getApplicationById(step.targetId);
        if (target) setSelectedApp(target);
      } else if (step.targetId && step.tab === 'organizations') {
        const targetOrg = demoStore.getOrganizationById(step.targetId);
        if (targetOrg) setSelectedOrgModal(targetOrg);
      } else if (step.tab === 'certificates' && certificates[0]) {
        setSelectedCert(certificates[0]);
      }
    }
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && app.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = app.referenceNumber.toLowerCase().includes(q);
        const matchesOrg = app.organizationName.toLowerCase().includes(q);
        const matchesFac = app.facilityName.toLowerCase().includes(q);
        const matchesProd = app.products.some((p) => p.name.toLowerCase().includes(q));
        if (!matchesRef && !matchesOrg && !matchesFac && !matchesProd) return false;
      }
      return true;
    });
  }, [applications, statusFilter, categoryFilter, searchQuery]);

  // Summary counts
  const awaitingReviewCount = useMemo(() => {
    return applications.filter(
      (a) =>
        a.status === 'Submitted' ||
        a.status === 'Initial Review' ||
        a.status === 'Technical Review' ||
        a.status === 'Decision Pending'
    ).length;
  }, [applications]);

  const scheduledInspectionsCount = useMemo(() => {
    return inspections.filter((i) => i.status === 'Scheduled').length;
  }, [inspections]);

  const expiringCertsCount = useMemo(() => {
    return certificates.filter((c) => c.status === 'Approaching Expiry').length;
  }, [certificates]);

  // Get status badge class
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Draft':
        return 'badge-draft';
      case 'Submitted':
        return 'badge-submitted';
      case 'Initial Review':
      case 'Technical Review':
      case 'Decision Pending':
        return 'badge-review';
      case 'Inspection Scheduled':
      case 'Inspection Completed':
        return 'badge-inspection';
      case 'Approved':
      case 'Certificate Issued':
        return 'badge-approved font-bold';
      case 'Rejected':
        return 'badge-rejected';
      case 'Awaiting Applicant Information':
      case 'Renewal Due':
        return 'badge-action-required';
      default:
        return 'badge-draft';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* 1. Guided Tour Banner */}
      <GuidedTourWidget
        currentStepIndex={tourStepIndex}
        onSelectStep={handleTourStepSelect}
        onResetDemo={handleResetData}
      />

      {/* 2. Platform Header */}
      <DemoHeader
        activeTabTitle={
          activeTab === 'overview'
            ? 'Executive Overview'
            : activeTab === 'applications'
            ? 'Applications Queue'
            : activeTab === 'organizations'
            ? 'Organizations Directory'
            : activeTab === 'documents'
            ? 'Document Repository'
            : activeTab === 'reviews'
            ? 'Review & Approvals'
            : activeTab === 'inspections'
            ? 'Field Inspections'
            : activeTab === 'certificates'
            ? 'Certificates Registry'
            : activeTab === 'renewals'
            ? 'Surveillance & Renewals'
            : activeTab === 'reports'
            ? 'Operational Reports'
            : 'Audit History'
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetData={handleResetData}
        pendingTasksCount={awaitingReviewCount + scheduledInspectionsCount}
      />

      {/* 3. Main Application Workspace: Sidebar + Dynamic Module Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <DemoSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={{
            applications: applications.length,
            awaitingReview: awaitingReviewCount,
            inspections: scheduledInspectionsCount,
            certificates: certificates.length,
            renewals: expiringCertsCount
          }}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-left space-y-6">

          {/* ======================================================== */}
          {/* MODULE 1: EXECUTIVE OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="card-enterprise rounded-2xl p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-0 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Certification Operations Dashboard
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Halal Certification Processing System
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Unified operational workspace for Halal Certification Bodies (HCBs). Track electronic application lodgement, schedule technical audits, verify ingredient traceability, and issue cryptographically verifiable certificates.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTabChange('applications')}
                      className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>Explore Applications</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTourStepSelect(0)}
                      className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/20"
                    >
                      Start Guided Tour
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                
                <div
                  onClick={() => handleTabChange('applications')}
                  className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 cursor-pointer hover:border-emerald-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Intake</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{applications.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Live active dossiers</div>
                </div>

                <div
                  onClick={() => handleTabChange('reviews')}
                  className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 cursor-pointer hover:border-amber-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Awaiting Review</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-700">{awaitingReviewCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Pending triage or gate</div>
                </div>

                <div
                  onClick={() => handleTabChange('inspections')}
                  className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 cursor-pointer hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Field Audits</span>
                    <CalendarCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700">{scheduledInspectionsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Audits coordinated</div>
                </div>

                <div
                  onClick={() => handleTabChange('certificates')}
                  className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 cursor-pointer hover:border-emerald-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Certificates</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700">{certificates.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Digital seals issued</div>
                </div>

                <div
                  onClick={() => handleTabChange('renewals')}
                  className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 cursor-pointer hover:border-red-600 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Expiry Alert</span>
                    <RefreshCw className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-red-700">{expiringCertsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">&lt; 90 days to expiry</div>
                </div>

                <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Action Queue</span>
                    <AlertTriangle className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {awaitingReviewCount + scheduledInspectionsCount}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Assessor priorities</div>
                </div>

              </div>

              {/* Status Breakdown & Priority Work Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 cols: Outstanding Action Items */}
                <div className="lg:col-span-7 card-enterprise rounded-xl p-6 bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        High Priority Certification Tasks
                      </h3>
                      <p className="text-xs text-slate-500">
                        Applications requiring assessor action or committee decision
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('applications')}
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-2">
                    {applications.slice(0, 4).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedApp(app);
                        }}
                        className="pt-2 pb-2 flex items-center justify-between gap-4 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {app.referenceNumber}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 truncate">
                            {app.organizationName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {app.facilityName} • {app.category}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                            <span>Open</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Updated: {app.lastUpdated}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 cols: Workflow Stage Distribution */}
                <div className="lg:col-span-5 card-enterprise rounded-xl p-6 bg-white border border-slate-200 space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      Application Pipeline Distribution
                    </h3>
                    <p className="text-xs text-slate-500">
                      Volume distribution across lifecycle stages
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Intake & Initial Review', count: applications.filter(a => a.status === 'Submitted' || a.status === 'Initial Review').length, color: 'bg-blue-600' },
                      { label: 'Technical & Shariah Audit', count: applications.filter(a => a.status === 'Technical Review' || a.status === 'Awaiting Applicant Information').length, color: 'bg-amber-600' },
                      { label: 'Field Inspection In Progress', count: applications.filter(a => a.status === 'Inspection Scheduled' || a.status === 'Inspection Completed').length, color: 'bg-purple-600' },
                      { label: 'Committee Decision Pending', count: applications.filter(a => a.status === 'Decision Pending').length, color: 'bg-indigo-600' },
                      { label: 'Approved & Certificate Issued', count: applications.filter(a => a.status === 'Approved' || a.status === 'Certificate Issued').length, color: 'bg-emerald-600' }
                    ].map((stage, i) => {
                      const pct = Math.round((stage.count / applications.length) * 100) || 0;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-700 font-medium">{stage.label}</span>
                            <span className="font-mono font-bold text-slate-900">{stage.count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${stage.color} rounded-full transition-all duration-300`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Active Regulatory Baseline: SMIIC / GSO</span>
                    <span className="font-mono text-emerald-800 font-bold">100% Traceability</span>
                  </div>
                </div>

              </div>

              {/* Recent Audit Ledger Events */}
              <div className="card-enterprise rounded-xl p-6 bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Audit Trail Activity Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Immutable record of system transitions, reviews, and dispatches
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('audit')}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Full Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 space-y-2 text-xs">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="pt-2 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {log.action}
                          </span>
                          <span className="font-semibold text-slate-900">{log.targetRef}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{log.details}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Actor: <strong className="text-slate-700">{log.actor}</strong> ({log.role})
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 shrink-0">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 2: APPLICATIONS QUEUE */}
          {/* ======================================================== */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              
              {/* Header & Controls */}
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Halal Certification Applications Queue
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setScheduleForAppId(filteredApplications[0]?.id);
                        setIsScheduleInspectionOpen(true);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Schedule Inspection</span>
                    </button>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Workflow Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="ALL">All Statuses ({applications.length})</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Initial Review">Initial Review</option>
                      <option value="Technical Review">Technical Review</option>
                      <option value="Awaiting Applicant Information">Awaiting Applicant Info</option>
                      <option value="Inspection Scheduled">Inspection Scheduled</option>
                      <option value="Inspection Completed">Inspection Completed</option>
                      <option value="Decision Pending">Decision Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Certificate Issued">Certificate Issued</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Product Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Ingredients & Additives">Ingredients & Additives</option>
                      <option value="Dairy & Milk Powder">Dairy & Milk Powder</option>
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Cosmetics & Personal Care">Cosmetics & Personal Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Search Text Filter
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by ref, company, plant, or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Applications Data Table */}
              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Reference #</th>
                        <th className="py-3 px-4">Organization & Facility</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-center">Products</th>
                        <th className="py-3 px-4">Workflow Status</th>
                        <th className="py-3 px-4">Submission</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No applications match the current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => setSelectedApp(app)}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {app.referenceNumber}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{app.organizationName}</div>
                              <div className="text-[11px] text-slate-500">{app.facilityName} ({app.country})</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-slate-700">{app.category}</span>
                              <div className="text-[10px] text-slate-400">{app.applicationType}</div>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-800">
                              {app.products.length}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {app.submissionDate}
                            </td>
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setSelectedApp(app)}
                                className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer text-xs"
                              >
                                Review Dossier
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 3: ORGANIZATIONS */}
          {/* ======================================================== */}
          {activeTab === 'organizations' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Registered Commercial Entities & Processing Facilities
                </h3>
                <p className="text-xs text-slate-500">
                  Corporate hierarchy, registered plants, dedicated production lines, and QA contacts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="card-enterprise rounded-xl p-5 bg-white border border-slate-200 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                            {org.legalEntityNumber}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {org.name}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {org.country}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Industry: {org.industry}
                      </p>
                      
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <div><strong>Primary QA Contact:</strong> {org.primaryContact.fullName}</div>
                        <div><strong>Email:</strong> {org.primaryContact.email}</div>
                        <div><strong>Phone:</strong> {org.primaryContact.phone}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Registered Plants ({org.facilities.length})
                        </div>
                        <div className="space-y-1.5">
                          {org.facilities.map((fac) => (
                            <div key={fac.id} className="p-2 rounded bg-slate-50 text-xs text-slate-700 border border-slate-200">
                              <div className="font-bold text-slate-900">{fac.name}</div>
                              <div className="text-[11px] text-slate-500">{fac.address}, {fac.city}</div>
                              <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                Lines: {fac.totalProductionLines} • Type: {fac.facilityType}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Applications: {org.associatedApplicationIds.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrgModal(org)}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Full Entity Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 4: DOCUMENT MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Central Evidentiary Document Repository
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive inventory of supplier halal certificates, laboratory assay reports, and HACCP manuals
                </p>
              </div>

              {/* Flattened Documents Table */}
              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Associated Application</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">File Details</th>
                      <th className="py-3 px-4">Audit Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.flatMap(a => a.documents.map(d => ({ doc: d, app: a }))).map(({ doc, app }) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {doc.name}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="font-mono text-emerald-700 hover:underline font-bold"
                          >
                            {app.referenceNumber}
                          </button>
                          <div className="text-[11px] text-slate-500">{app.organizationName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{doc.category}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {doc.fileName} ({doc.fileSize}) • {doc.version}
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            Inspect Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 5: REVIEW & APPROVALS */}
          {/* ======================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Technical Assessor & Shariah Supervisory Gate
                </h3>
                <p className="text-xs text-slate-500">
                  Critical ingredient origin review, lab testing threshold checks, and formal committee compliance rulings
                </p>
              </div>

              {/* Review Workbench */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applications
                  .filter(
                    (a) =>
                      a.status === 'Initial Review' ||
                      a.status === 'Technical Review' ||
                      a.status === 'Decision Pending' ||
                      a.status === 'Submitted'
                  )
                  .map((app) => (
                    <div
                      key={app.id}
                      className="card-enterprise rounded-xl p-5 bg-white border border-slate-200 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {app.referenceNumber}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {app.organizationName}
                          </h4>
                          <div className="text-xs text-slate-500">
                            Facility: {app.facilityName} • Category: {app.category}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Technical Checklist */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-slate-800">Assessor Gate Verification Criteria:</div>
                        <div className="space-y-1 text-slate-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Raw ingredient bill-of-materials verified porcine-free</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Carrier solvent GC-MS ethanol assay &lt; 0.05% v/v</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Clean-in-place (CIP) line chemical logs validated</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                        >
                          View Dossier & Notes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                          }}
                          className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm"
                        >
                          Advance / Record Ruling
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 6: FIELD INSPECTIONS */}
          {/* ======================================================== */}
          {activeTab === 'inspections' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    On-Site Field Audit Coordination & Inspector Dispatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage field audits, verify ISO 17065/SMIIC checklists, and record compliance findings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScheduleForAppId(applications[0]?.id);
                    setIsScheduleInspectionOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Field Inspection</span>
                </button>
              </div>

              {/* Inspections Table */}
              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Audit Ref #</th>
                      <th className="py-3 px-4">Application & Facility</th>
                      <th className="py-3 px-4">Scheduled Date</th>
                      <th className="py-3 px-4">Assigned Lead Auditor</th>
                      <th className="py-3 px-4">Audit Status</th>
                      <th className="py-3 px-4">Findings Outcome</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inspections.map((insp) => (
                      <tr key={insp.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {insp.inspectionRef}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{insp.organizationName}</div>
                          <div className="text-[11px] text-slate-500">{insp.facilityName} ({insp.facilityAddress})</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {insp.scheduledDate} ({insp.scheduledTime})
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{insp.assignedInspector}</div>
                          <div className="text-[10px] text-slate-500">{insp.inspectorCredentials}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            insp.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {insp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {insp.outcome ? (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              {insp.outcome}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Audit in progress</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {insp.status === 'Scheduled' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedInspectionForComplete(insp)}
                              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                            >
                              Record Audit Outcome
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const app = demoStore.getApplicationById(insp.applicationId);
                                if (app) setSelectedApp(app);
                              }}
                              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                            >
                              View Dossier
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 7: CERTIFICATES REGISTRY */}
          {/* ======================================================== */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Cryptographic Halal Certificate Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Tamper-evident electronic certificates sealed with SHA-256 digests and ECDSA signatures
                </p>
              </div>

              {/* Certificates Table */}
              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Certificate #</th>
                      <th className="py-3 px-4">Certified Organization</th>
                      <th className="py-3 px-4">Governing Standard</th>
                      <th className="py-3 px-4">Products</th>
                      <th className="py-3 px-4">Validity Window</th>
                      <th className="py-3 px-4">Registry Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {cert.certificateNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{cert.organizationName}</div>
                          <div className="text-[11px] text-slate-500">{cert.facilityName}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-900">
                          {cert.governingStandard}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-800">
                          {cert.certifiedProducts.length} Items
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {cert.issueDate} &rarr; {cert.expiryDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {cert.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCert(cert)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Certificate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 8: RENEWALS & SURVEILLANCE */}
          {/* ======================================================== */}
          {activeTab === 'renewals' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Annual Surveillance & Recertification Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Automated countdown tracking, notice dispatches, and recertification dossier requirements
                </p>
              </div>

              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Certificate Reference</th>
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Expiration Date</th>
                      <th className="py-3 px-4">Days Remaining</th>
                      <th className="py-3 px-4">Surveillance Status</th>
                      <th className="py-3 px-4">Outstanding Prerequisites</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {renewals.map((ren) => (
                      <tr key={ren.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {ren.certificateNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {ren.organizationName}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {ren.currentExpiryDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            ren.daysRemaining < 30
                              ? 'bg-red-100 text-red-800'
                              : ren.daysRemaining < 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ren.daysRemaining} Days
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {ren.status}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {ren.outstandingRequirements.join(', ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Notice dispatched for ${ren.certificateNumber}. Applicant notified via portal and automated email.`);
                            }}
                            className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs cursor-pointer"
                          >
                            Dispatch Notice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 9: OPERATIONAL REPORTS */}
          {/* ======================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Executive Operational Metrics & Workload Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  Processing efficiency, sector distribution, and auditor workload benchmarking
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sector Breakdown */}
                <div className="card-enterprise rounded-xl p-6 bg-white border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Applications by Sector Category</h4>
                  <div className="space-y-3">
                    {[
                      { sector: 'Food & Beverage', count: 4, pct: 44, color: 'bg-emerald-600' },
                      { sector: 'Ingredients & Additives', count: 2, pct: 22, color: 'bg-blue-600' },
                      { sector: 'Dairy Processing', count: 1, pct: 12, color: 'bg-amber-600' },
                      { sector: 'Pharmaceuticals', count: 1, pct: 11, color: 'bg-purple-600' },
                      { sector: 'Cosmetics & Personal Care', count: 1, pct: 11, color: 'bg-rose-600' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">{item.sector}</span>
                          <span className="font-mono font-bold text-slate-900">{item.count} ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Workload Breakdown */}
                <div className="card-enterprise rounded-xl p-6 bg-white border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Auditor Field Workload Allocation</h4>
                  <div className="space-y-3">
                    {[
                      { auditor: 'Eng. Maryam Al-Sabah', role: 'Lead SMIIC Assessor', audits: 4, pct: 40, color: 'bg-emerald-600' },
                      { auditor: 'Dr. Tariq Al-Hashimi', role: 'Technical Assurance Lead', audits: 3, pct: 30, color: 'bg-blue-600' },
                      { auditor: 'Ustaz Bilal Mansoor', role: 'Shariah Meat Specialist', audits: 2, pct: 20, color: 'bg-amber-600' },
                      { auditor: 'Dr. Soraya El-Khatib', role: 'Bio-Chemical Specialist', audits: 1, pct: 10, color: 'bg-purple-600' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">{item.auditor} ({item.role})</span>
                          <span className="font-mono font-bold text-slate-900">{item.audits} ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 10: AUDIT HISTORY */}
          {/* ======================================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="card-enterprise rounded-xl p-4 bg-white border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Cryptographic Audit Trail Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable record of every status transition, assessor note, document approval, and certificate issuance
                </p>
              </div>

              <div className="card-enterprise rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action Event</th>
                      <th className="py-3 px-4">Target Ref</th>
                      <th className="py-3 px-4">Actor & Role</th>
                      <th className="py-3 px-4">Operation Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                          {log.targetRef}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{log.actor}</div>
                          <div className="text-[10px] text-emerald-800">{log.role}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-md">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODALS & DRAWERS */}
      {/* ======================================================== */}

      {/* Application Detail Drawer */}
      <ApplicationDetailDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onRefresh={() => {
          setApplications(demoStore.getApplications());
          if (selectedApp) {
            const up = demoStore.getApplicationById(selectedApp.id);
            if (up) setSelectedApp(up);
          }
        }}
        onOpenCertificateModal={(certId) => {
          const cert = demoStore.getCertificateById(certId);
          if (cert) setSelectedCert(cert);
        }}
        onOpenScheduleInspection={(appId) => {
          setScheduleForAppId(appId);
          setIsScheduleInspectionOpen(true);
        }}
      />

      {/* Digital Certificate Preview Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Schedule Inspection Modal */}
      <ScheduleInspectionModal
        isOpen={isScheduleInspectionOpen}
        onClose={() => setIsScheduleInspectionOpen(false)}
        applications={applications}
        preselectedAppId={scheduleForAppId}
        onInspectionScheduled={() => {
          setInspections(demoStore.getInspections());
          setApplications(demoStore.getApplications());
        }}
      />

      {/* Complete Inspection Modal */}
      <CompleteInspectionModal
        inspection={selectedInspectionForComplete}
        onClose={() => setSelectedInspectionForComplete(null)}
        onCompleted={() => {
          setInspections(demoStore.getInspections());
          setApplications(demoStore.getApplications());
        }}
      />

      {/* Organization Detail Modal */}
      {selectedOrgModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                  {selectedOrgModal.legalEntityNumber}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedOrgModal.name}
                </h3>
                <div className="text-xs text-slate-500">
                  Industry: {selectedOrgModal.industry} • Jurisdiction: {selectedOrgModal.country}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrgModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">Corporate Headquarters & Primary Contact:</div>
                <div>{selectedOrgModal.primaryContact.fullName} — {selectedOrgModal.primaryContact.title}</div>
                <div className="text-slate-500">{selectedOrgModal.primaryContact.email} | {selectedOrgModal.primaryContact.phone}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Registered Manufacturing Facilities ({selectedOrgModal.facilities.length})
                </div>
                <div className="space-y-2">
                  {selectedOrgModal.facilities.map((f) => (
                    <div key={f.id} className="p-2.5 rounded border border-slate-200 bg-white">
                      <div className="font-bold text-slate-900">{f.name}</div>
                      <div className="text-slate-500">{f.address}, {f.city}, {f.country}</div>
                      <div className="text-emerald-800 font-semibold mt-0.5">
                        Production Lines: {f.totalProductionLines} • Type: {f.facilityType} • Last Audit: {f.lastAuditDate || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrgModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Entity Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
