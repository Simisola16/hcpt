import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Bell,
  ArrowLeft,
  User,
  RotateCcw,
  Layers,
  ChevronRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface DemoHeaderProps {
  activeTabTitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetData: () => void;
  pendingTasksCount: number;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  activeTabTitle,
  searchQuery,
  onSearchChange,
  onResetData,
  pendingTasksCount
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Application Submitted', desc: 'HCPT-APP-2026-814 awaiting initial triage', time: '10m ago' },
    { id: 2, title: 'Field Audit Due', desc: 'Inspection scheduled for Crescent Foods plant', time: '45m ago' },
    { id: 3, title: 'Renewal Notice Dispatched', desc: 'Atlas Dairy recertification window open', time: '2h ago' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      
      {/* Top Utility Bar */}
      <div className="px-4 sm:px-6 py-2 bg-slate-900 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HCPT Corporate Website</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Platform Demo: <strong className="text-white">Halal Certification Workflow Engine</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Demonstration Environment</span>
          </div>
          <button
            type="button"
            onClick={onResetData}
            title="Reset demo data to initial mock seed"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="/hcpt-logo.jpg"
              alt="HCPT Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Enterprise Suite</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900">{activeTabTitle}</span>
          </nav>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications, ref #, facilities, or products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Actions: Notifications & User profile */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="View system notifications"
            >
              <Bell className="w-5 h-5" />
              {pendingTasksCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-100 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
                  <span>Assessor Task Queue</span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {pendingTasksCount} Pending
                  </span>
                </div>
                <div className="space-y-2 py-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-xs">
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400">
                    Audit ledger updates automatically upon action.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                TA
              </div>
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-bold text-slate-900">Dr. Tariq Al-Hashimi</div>
                <div className="text-[10px] text-emerald-800 font-semibold">Lead Technical Assessor</div>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-left text-xs animate-in fade-in duration-100">
                <div className="pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900">Dr. Tariq Al-Hashimi</div>
                  <div className="text-slate-500 text-[11px]">t.alhashimi@hcpt.example.com</div>
                  <div className="mt-1 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Role: LEAD_TECHNICAL_ASSESSOR
                  </div>
                </div>
                <div className="py-2 space-y-1 text-slate-600">
                  <div className="py-1">Authority: ISO 17065 & OIC/SMIIC 1 Lead Auditor</div>
                  <div className="py-1">Authorized Jurisdiction: International Trade</div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <Link to="/" className="text-emerald-700 hover:underline">
                    Back to HCPT Website
                  </Link>
                  <button
                    type="button"
                    onClick={onResetData}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    Reset Seed
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};
