import React, { useState } from 'react';
import {
  Search,
  Bell,
  ShieldAlert,
  Compass,
  User,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { DemoTab } from './DemoSidebar';

interface DemoTopbarProps {
  activeTab: DemoTab;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  onOpenGuidedTour: () => void;
  onSearchQuery?: (q: string) => void;
}

export const DemoTopbar: React.FC<DemoTopbarProps> = ({
  activeTab,
  currentRole,
  setCurrentRole,
  onOpenGuidedTour,
  onSearchQuery
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roles = [
    'Lead Application Assessor',
    'Technical Halal Food Assessor',
    'Field On-Site Inspector',
    'Shariah Supervisory Board Member',
    'Director General of Certification',
    'Applicant QA Representative'
  ];

  const tabLabels: Record<DemoTab, string> = {
    overview: 'Executive Overview',
    applications: 'Certification Applications',
    organizations: 'Certified Organizations & Facilities',
    documents: 'Document & Evidence Repository',
    reviews: 'Technical Review & Committee Decisions',
    inspections: 'On-Site Inspection Scheduling',
    certificates: 'Issued Certificates & Seals',
    renewals: 'Surveillance & Annual Renewals',
    reports: 'Operational Reports & Workload Analytics',
    audit: 'Audit History & Ledger Events'
  };

  return (
    <header className="bg-white border-b border-slate-200 text-left select-none shrink-0">
      
      {/* Top Demo Disclaimer Ribbon */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-[11px] flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[10px]">
            Demonstration Environment
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Interactive system demonstration with synthetic records. Not a live regulatory filing terminal.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenGuidedTour}
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 focus:outline-none"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Launch 7-Step Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Main Topbar Row */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Breadcrumb / Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>HCPT Platform</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate">
              {tabLabels[activeTab]}
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
            {tabLabels[activeTab]}
          </h1>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reference, SKU, or org..."
            onChange={(e) => onSearchQuery?.(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        {/* Right Controls: Role Switcher & Notifications */}
        <div className="flex items-center gap-3">
          
          {/* Role Persona Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 leading-tight">Current Persona</div>
                <div className="font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                  {currentRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Simulate Role Persona
                </div>
                <div className="space-y-0.5 mt-1">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setCurrentRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        currentRole === r
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{r}</span>
                      {currentRole === r && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-emerald-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">System Notifications</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    2 New
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-800">Inspection Scheduled</div>
                    <div className="text-[11px] text-slate-600">
                      Al-Maha Flavors audit confirmed for March 12, 2026.
                    </div>
                    <div className="text-[10px] text-slate-400">10m ago</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-800">RFI Response Overdue</div>
                    <div className="text-[11px] text-slate-600">
                      Gulf Biotech softgel bovine gelatin cert pending applicant response.
                    </div>
                    <div className="text-[10px] text-slate-400">2h ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};
