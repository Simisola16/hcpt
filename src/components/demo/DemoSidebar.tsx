import React, { useState } from 'react';
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Compass,
  RotateCcw
} from 'lucide-react';
import { demoStore } from '../../services/demoStore';

export type DemoTab =
  | 'overview'
  | 'applications'
  | 'organizations'
  | 'documents'
  | 'reviews'
  | 'inspections'
  | 'certificates'
  | 'renewals'
  | 'reports'
  | 'audit';

export type DemoTabKey = DemoTab;

export interface DemoSidebarProps {
  activeTab: DemoTab;
  onTabChange?: (tab: DemoTab) => void;
  setActiveTab?: (tab: DemoTab) => void;
  counts?: {
    applications?: number;
    awaitingReview?: number;
    inspections?: number;
    certificates?: number;
    renewals?: number;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenGuidedTour?: () => void;
  onResetData?: () => void;
}

export const DemoSidebar: React.FC<DemoSidebarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  counts,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggleCollapse,
  onOpenGuidedTour,
  onResetData
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const handleToggle = controlledToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const handleSelectTab = (tab: DemoTab) => {
    if (onTabChange) onTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  // Compute live counts if not explicitly supplied
  const apps = demoStore.getApplications();
  const certs = demoStore.getCertificates();
  const audits = demoStore.getInspections();
  const rens = demoStore.getRenewals();

  const effectiveCounts = {
    applications: counts?.applications ?? apps.length,
    awaitingReview: counts?.awaitingReview ?? apps.filter(a => a.status === 'Initial Review' || a.status === 'Technical Review').length,
    inspections: counts?.inspections ?? audits.filter(i => i.status === 'Scheduled' || i.status === 'In Progress').length,
    certificates: counts?.certificates ?? certs.filter(c => c.status === 'Active' || c.status === 'Approaching Expiry').length,
    renewals: counts?.renewals ?? rens.filter(r => r.status === 'Notice Dispatched' || r.status === 'Overdue').length,
  };

  const navItems: {
    key: DemoTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      key: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard
    },
    {
      key: 'applications',
      label: 'Applications Queue',
      icon: FileText,
      badge: effectiveCounts.applications,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      key: 'organizations',
      label: 'Organizations',
      icon: Building2
    },
    {
      key: 'documents',
      label: 'Document Repository',
      icon: FolderArchive
    },
    {
      key: 'reviews',
      label: 'Review & Approvals',
      icon: CheckCircle2,
      badge: effectiveCounts.awaitingReview,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      key: 'inspections',
      label: 'Field Inspections',
      icon: CalendarCheck,
      badge: effectiveCounts.inspections,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      key: 'certificates',
      label: 'Certificates Registry',
      icon: Award,
      badge: effectiveCounts.certificates,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      key: 'renewals',
      label: 'Renewals & Expiries',
      icon: RefreshCw,
      badge: effectiveCounts.renewals,
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      key: 'reports',
      label: 'Operational Reports',
      icon: BarChart3
    },
    {
      key: 'audit',
      label: 'Audit History & Logs',
      icon: History
    }
  ];

  return (
    <aside
      className={`border-r border-slate-200 bg-white flex flex-col shrink-0 transition-all duration-200 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
            Workflow Modules
          </span>
        )}
        <button
          type="button"
          onClick={handleToggle}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 mx-auto transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelectTab(item.key)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-2 shrink-0 ${
                    isActive ? 'bg-emerald-950 text-emerald-200' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Actions footer */}
      <div className="p-2 border-t border-slate-200 space-y-1">
        {onOpenGuidedTour && (
          <button
            type="button"
            onClick={onOpenGuidedTour}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Start Interactive Guided Tour"
          >
            <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
            {!isCollapsed && <span>Guided Demo Tour</span>}
          </button>
        )}

        {onResetData && (
          <button
            type="button"
            onClick={onResetData}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Reset sandbox data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Reset Demo Data</span>}
          </button>
        )}
      </div>

      {/* Demonstration Watermark Notice */}
      {!isCollapsed ? (
        <div className="p-3 m-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-tight">
          <div className="font-bold text-slate-700 flex items-center gap-1 mb-0.5">
            <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Demonstration Sandbox</span>
          </div>
          Synthetic data. Changes persist locally in your browser session.
        </div>
      ) : (
        <div className="p-2 text-center text-slate-400" title="Demonstration Sandbox">
          <ShieldAlert className="w-4 h-4 mx-auto text-amber-600" />
        </div>
      )}
    </aside>
  );
};
