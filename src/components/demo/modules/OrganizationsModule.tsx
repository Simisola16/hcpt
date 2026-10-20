import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Award,
  Factory,
  CheckCircle2,
  Search,
  ExternalLink
} from 'lucide-react';
import { Organization } from '../../../types/certification';

interface OrganizationsModuleProps {
  organizations: Organization[];
  onSelectApplication: (id: string) => void;
}

export const OrganizationsModule: React.FC<OrganizationsModuleProps> = ({
  organizations,
  onSelectApplication
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrgs = organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Certified Organizations & Facilities
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise directory of manufacturing companies, production plants, and linked certification dossiers.
        </p>
      </div>

      {/* Grid: Master / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Organizations */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-2">
            {filteredOrgs.map((org) => {
              const isSelected = org.id === activeOrg?.id;
              return (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrgId(org.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#006837] bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{org.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {org.legalEntityNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.city}, {org.country}</span>
                    <span>•</span>
                    <span>{org.facilities.length} plants</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Card for Selected Organization */}
        {activeOrg && (
          <div className="lg:col-span-7 card-enterprise rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            
            {/* Org Header */}
            <div className="pb-4 border-b border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded">
                  {activeOrg.industry}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  CR: {activeOrg.legalEntityNumber}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {activeOrg.name}
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeOrg.city}, {activeOrg.country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {activeOrg.website}
                </span>
              </div>
            </div>

            {/* Primary Contact Person */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Authorized Compliance Contact
              </div>
              <div className="text-slate-900 font-bold text-sm">
                {activeOrg.primaryContact.fullName}
              </div>
              <div className="text-slate-600">{activeOrg.primaryContact.title}</div>
              <div className="flex flex-wrap gap-4 text-slate-500 pt-1 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {activeOrg.primaryContact.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {activeOrg.primaryContact.phone}
                </span>
              </div>
            </div>

            {/* Registered Facilities */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Factory className="w-4 h-4 text-emerald-700" />
                <span>Manufacturing & Processing Plants ({activeOrg.facilities.length})</span>
              </div>

              <div className="space-y-2">
                {activeOrg.facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-slate-900">{fac.name}</div>
                      <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {fac.totalProductionLines} lines
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{fac.address}, {fac.city}</div>
                    <div className="text-slate-400 text-[10px] pt-1 flex justify-between">
                      <span>Type: {fac.facilityType}</span>
                      <span>Last Audited: {fac.lastAuditDate || 'Initial Assessment Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Applications & Certificates */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="text-slate-600">
                Associated Applications: <strong className="text-slate-900">{activeOrg.associatedApplicationIds.length}</strong> | Active Certificates: <strong className="text-emerald-700">{activeOrg.associatedCertificateIds.length}</strong>
              </div>
              {activeOrg.associatedApplicationIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectApplication(activeOrg.associatedApplicationIds[0])}
                  className="px-3.5 py-1.5 rounded bg-[#006837] text-white font-semibold text-xs hover:bg-[#00502b] transition-colors"
                >
                  Open Active Application
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
