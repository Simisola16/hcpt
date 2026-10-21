import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Mail,
  Building2,
  Globe2,
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Search,
  Filter,
  Send,
  Eye,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Activity
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { StoredInquiry, VisitorLocationRecord } from '../services/demoStore';

export function AdminInquiriesPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'visitor_locations'>('inquiries');
  
  // Inquiries State
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'ARCHIVED'>('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('ALL');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  // Visitor Locations State (Only Location Data)
  const [visitorLocations, setVisitorLocations] = useState<VisitorLocationRecord[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationSearch, setLocationSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    try {
      const [inqData, locData] = await Promise.all([
        apiClient.getContactInquiries(),
        apiClient.getVisitorLocations()
      ]);
      setInquiries(inqData);
      setVisitorLocations(locData);
      if (inqData.length > 0 && !selectedInquiryId) {
        setSelectedInquiryId(inqData[0].confirmationId);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingInquiries(false);
      setLoadingLocations(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleStatusChange = async (confirmationId: string, newStatus: StoredInquiry['status']) => {
    try {
      const success = await apiClient.updateInquiryStatus(confirmationId, newStatus);
      if (success) {
        setInquiries(prev =>
          prev.map(item =>
            item.confirmationId === confirmationId ? { ...item, status: newStatus } : item
          )
        );
        setStatusUpdateMessage(`Status updated to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct jurisdictions for inquiries filter
  const jurisdictions = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach(i => {
      if (i.jurisdiction) set.add(i.jurisdiction);
    });
    return Array.from(set);
  }, [inquiries]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (jurisdictionFilter !== 'ALL' && item.jurisdiction !== jurisdictionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.confirmationId.toLowerCase().includes(q) ||
          item.fullName.toLowerCase().includes(q) ||
          item.organizationName.toLowerCase().includes(q) ||
          item.officialEmail.toLowerCase().includes(q) ||
          item.jurisdiction.toLowerCase().includes(q) ||
          item.inquiryDetails.toLowerCase().includes(q) ||
          (item.phoneNumber && item.phoneNumber.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [inquiries, statusFilter, jurisdictionFilter, searchQuery]);

  // Selected inquiry
  const selectedInquiry = useMemo(() => {
    return inquiries.find(i => i.confirmationId === selectedInquiryId) || filteredInquiries[0] || null;
  }, [inquiries, selectedInquiryId, filteredInquiries]);

  // Inquiry Metrics
  const inquiryMetrics = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === 'NEW').length;
    const inReviewCount = inquiries.filter(i => i.status === 'IN_REVIEW').length;
    const contactedCount = inquiries.filter(i => i.status === 'CONTACTED').length;
    const archivedCount = inquiries.filter(i => i.status === 'ARCHIVED').length;
    return { total, newCount, inReviewCount, contactedCount, archivedCount };
  }, [inquiries]);

  // Distinct countries for visitor locations filter
  const distinctCountries = useMemo(() => {
    const set = new Set<string>();
    visitorLocations.forEach(loc => {
      if (loc.country) set.add(loc.country);
    });
    return Array.from(set).sort();
  }, [visitorLocations]);

  // Country breakdown statistics
  const countryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; flag: string; cities: Set<string> }> = {};
    visitorLocations.forEach(loc => {
      if (!map[loc.country]) {
        map[loc.country] = { count: 0, flag: loc.flag || '🌐', cities: new Set() };
      }
      map[loc.country].count += 1;
      if (loc.city) map[loc.country].cities.add(loc.city);
    });

    const total = visitorLocations.length || 1;
    return Object.entries(map)
      .map(([country, data]) => ({
        country,
        flag: data.flag,
        count: data.count,
        percentage: Math.round((data.count / total) * 100),
        cities: Array.from(data.cities)
      }))
      .sort((a, b) => b.count - a.count);
  }, [visitorLocations]);

  // Filtered visitor locations (strictly location data)
  const filteredVisitorLocations = useMemo(() => {
    return visitorLocations.filter(loc => {
      if (countryFilter !== 'ALL' && loc.country !== countryFilter) return false;
      if (locationSearch.trim()) {
        const q = locationSearch.toLowerCase();
        return (
          loc.city.toLowerCase().includes(q) ||
          loc.country.toLowerCase().includes(q) ||
          (loc.region && loc.region.toLowerCase().includes(q)) ||
          loc.countryCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [visitorLocations, countryFilter, locationSearch]);

  const latestLocation = visitorLocations[0] || null;

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return timestamp;
    }
  };

  const getStatusBadge = (status: StoredInquiry['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            New Submission
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            In Technical Review
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            Contacted & Replied
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Archive className="w-3 h-3 text-slate-500" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner & Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#006837]/10 text-[#006837] tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  techhalal.com Admin Console
                </span>
                <span className="text-xs text-slate-500">Institutional Governance & Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {activeTab === 'inquiries' ? 'Enterprise Engagement & Messages' : 'Website Visitor Locations'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {activeTab === 'inquiries'
                  ? 'Manage incoming institutional consultation requests, technical reviews, and client inquiries.'
                  : 'Real-time geographic location telemetry of people visiting techhalal.com (strictly location data: Country, City, Region).'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                View Public Form
              </Link>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#006837] hover:bg-[#00522b] rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Telemetry'}
              </button>
            </div>
          </div>

          {/* Tab Navigation: Engagement Inquiries vs Visitor Locations */}
          <div className="mt-5 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  activeTab === 'inquiries'
                    ? 'border-[#006837] text-[#006837]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Enterprise Engagement Inquiries & Messages</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'inquiries' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {inquiries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('visitor_locations')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  activeTab === 'visitor_locations'
                    ? 'border-[#006837] text-[#006837]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>Visitor Locations</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'visitor_locations' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {visitorLocations.length} locations
                </span>
              </button>
            </div>

            {/* Live Location Ticker Preview (Visible on both tabs) */}
            {latestLocation && (
              <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Latest Visitor Location:</span>
                <span className="font-semibold text-slate-800">
                  {latestLocation.flag} {latestLocation.city}, {latestLocation.country}
                </span>
                <span className="text-slate-400">({formatRelativeTime(latestLocation.timestamp)})</span>
              </div>
            )}
          </div>

          {/* System Delivery Status Pill Row */}
          <div className="mt-3 pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>Resend Engagement Dispatch:</strong> Active &rarr; <span className="font-mono text-emerald-900 font-semibold">villagecoders7@gmail.com</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              <Mail className="w-3 h-3 text-slate-500" />
              <span>
                <strong>Official Domain Email:</strong> <a href="mailto:info@techhalal.com" className="font-mono text-slate-900 hover:text-emerald-700 font-semibold underline">info@techhalal.com</a>
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200/60">
              <Globe2 className="w-3 h-3 text-blue-600" />
              <span>
                <strong>Domain:</strong> <span className="font-mono font-semibold text-blue-900">techhalal.com</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* =========================================================================
            TAB 1: VISITOR GEOGRAPHIC LOCATIONS (STRICTLY LOCATION DATA)
           ========================================================================= */}
        {activeTab === 'visitor_locations' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Location Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Total Visitor Hits</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{visitorLocations.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Geographic visits recorded</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Sovereign Countries</span>
                  <Globe2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{distinctCountries.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">International reach</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
                  <span>Top Visiting Country</span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-emerald-900 mt-2 truncate flex items-center gap-1.5">
                  <span>{countryBreakdown[0]?.flag || '🌐'}</span>
                  <span>{countryBreakdown[0]?.country || 'N/A'}</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {countryBreakdown[0] ? `${countryBreakdown[0].count} visits (${countryBreakdown[0].percentage}%)` : ''}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Latest Detected Visit</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-slate-900 mt-2 truncate flex items-center gap-1.5">
                  <span>{latestLocation?.flag}</span>
                  <span>{latestLocation?.city}, {latestLocation?.countryCode}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {latestLocation ? formatRelativeTime(latestLocation.timestamp) : 'N/A'}
                </div>
              </div>
            </div>

            {/* Country Breakdown Progress Cards */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#006837]" />
                    Visitor Geographic Distribution (Corridors)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aggregated volume of visitors accessing techhalal.com categorized strictly by country and cities.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded">
                  {distinctCountries.length} Global Territories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {countryBreakdown.map(item => (
                  <div key={item.country} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{item.flag}</span>
                        <span className="font-bold">{item.country}</span>
                      </div>
                      <span className="font-mono text-slate-600">
                        {item.count} {item.count === 1 ? 'visit' : 'visits'} ({item.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-[#006837] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(item.percentage, 8)}%` }}
                      />
                    </div>

                    {/* Cities preview */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Key Hubs: <strong>{item.cities.join(', ')}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Locations Feed & Filter Table (STRICTLY LOCATION DATA) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-700" />
                      Live Visitor Location Telemetry
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chronological stream showing the cities and countries of site visitors. Strictly location metadata.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search by location */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search city or country..."
                        value={locationSearch}
                        onChange={e => setLocationSearch(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 w-44 sm:w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Filter by Country */}
                    <select
                      value={countryFilter}
                      onChange={e => setCountryFilter(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="ALL">All Countries ({distinctCountries.length})</option>
                      {distinctCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table of Visitor Locations */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Country & Flag</th>
                      <th className="py-3 px-4">City / Municipality</th>
                      <th className="py-3 px-4">State / Region / Province</th>
                      <th className="py-3 px-4">Time of Visit</th>
                      <th className="py-3 px-4 text-right">Telemetry Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisitorLocations.map((loc, idx) => (
                      <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg leading-none">{loc.flag || '🌐'}</span>
                            <span>{loc.country}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                              {loc.countryCode}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#006837] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{loc.city}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {loc.region || <span className="text-slate-400 italic">Not reported</span>}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatRelativeTime(loc.timestamp)}</span>
                            <span className="text-slate-400 text-[10px]">({loc.timestamp.substring(11, 16)} UTC)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Location Logged
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredVisitorLocations.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No visitor locations match your active filter.
                </div>
              )}

              {/* Privacy Footer Clarification */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  <strong>Strict Privacy Protocol:</strong> Only geographic location data (Country, City, Region) is captured. No IP addresses, user identities, or device fingerprints are displayed or stored.
                </span>
                <span className="font-mono text-slate-400">Total: {visitorLocations.length} records</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ENTERPRISE ENGAGEMENT FORM SUBMISSIONS & MESSAGES
           ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Total Inquiries</span>
                  <Inbox className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{inquiryMetrics.total}</div>
                <div className="text-[11px] text-slate-400 mt-1">All recorded submissions</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
                  <span>New Submissions</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-2xl font-bold text-emerald-800 mt-2">{inquiryMetrics.newCount}</div>
                <div className="text-[11px] text-emerald-600 mt-1">Requires initial follow-up</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>In Technical Review</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-700 mt-2">{inquiryMetrics.inReviewCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Architecture scoping</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Contacted & Replied</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-700 mt-2">{inquiryMetrics.contactedCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">In active consultation</div>
              </div>
            </div>

            {/* Quick banner linking to visitor locations */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="p-1.5 bg-white/10 rounded-md">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                </span>
                <div>
                  <strong className="text-white">Live Visitor Location Telemetry:</strong>{' '}
                  <span className="text-emerald-300">
                    {distinctCountries.length} countries recorded on techhalal.com
                  </span>
                  {latestLocation && (
                    <span className="text-slate-300 ml-2">
                      &bull; Latest: {latestLocation.flag} {latestLocation.city}, {latestLocation.country}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('visitor_locations')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                <span>View Visitor Locations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, organization, jurisdiction, email, or message keyword..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Jurisdiction Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={jurisdictionFilter}
                    onChange={e => setJurisdictionFilter(e.target.value)}
                    className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="ALL">All Jurisdictions ({jurisdictions.length})</option>
                    {jurisdictions.map(j => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Tab Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
                {(
                  [
                    { key: 'ALL', label: 'All Inquiries', count: inquiryMetrics.total },
                    { key: 'NEW', label: 'New', count: inquiryMetrics.newCount },
                    { key: 'IN_REVIEW', label: 'In Review', count: inquiryMetrics.inReviewCount },
                    { key: 'CONTACTED', label: 'Contacted', count: inquiryMetrics.contactedCount },
                    { key: 'ARCHIVED', label: 'Archived', count: inquiryMetrics.archivedCount }
                  ] as const
                ).map(tab => {
                  const active = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setStatusFilter(tab.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          active ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}

                {statusUpdateMessage && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded">
                    <Check className="w-3.5 h-3.5" />
                    {statusUpdateMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Master-Detail Grid */}
            {loadingInquiries ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-[#006837] animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">Loading enterprise inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Inquiries Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No enterprise consultation submissions match your active search or status filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setJurisdictionFilter('ALL');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Inquiry List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                    <span>Submissions & Messages ({filteredInquiries.length})</span>
                    <span>Select to inspect</span>
                  </div>

                  <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
                    {filteredInquiries.map(item => {
                      const isSelected = selectedInquiry?.confirmationId === item.confirmationId;
                      return (
                        <div
                          key={item.confirmationId}
                          onClick={() => setSelectedInquiryId(item.confirmationId)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-white border-[#006837] shadow-md ring-2 ring-[#006837]/10'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              {getStatusBadge(item.status)}
                              {item.status === 'NEW' && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  ACTION REQ
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.receivedAt ? item.receivedAt.split(' ')[0] : 'Today'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {item.organizationName}
                          </h4>

                          <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                            <span className="font-semibold">{item.fullName}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="text-slate-500 truncate">{item.officialEmail}</span>
                          </div>

                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                            &ldquo;{item.inquiryDetails}&rdquo;
                          </p>

                          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-500 font-medium truncate max-w-[200px]">
                              {item.jurisdiction}
                            </span>
                            <span className="font-mono text-emerald-800 font-semibold bg-emerald-50/70 px-1.5 py-0.5 rounded">
                              {item.confirmationId}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Selected Inquiry Detail Dossier */}
                <div className="lg:col-span-7">
                  {selectedInquiry ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-32">
                      {/* Dossier Header */}
                      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-emerald-300">
                                {selectedInquiry.confirmationId}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Lodged: {selectedInquiry.receivedAt}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-white mt-1.5">
                              {selectedInquiry.organizationName}
                            </h2>
                            <div className="text-xs text-slate-300 mt-0.5">
                              Representative: <strong className="text-white">{selectedInquiry.fullName}</strong>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(selectedInquiry.status)}
                          </div>
                        </div>
                      </div>

                      {/* Status Action Toolbar */}
                      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">Change Status:</span>
                          <select
                            value={selectedInquiry.status}
                            onChange={e =>
                              handleStatusChange(
                                selectedInquiry.confirmationId,
                                e.target.value as StoredInquiry['status']
                              )
                            }
                            className="text-xs font-semibold bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          >
                            <option value="NEW">NEW (New Submission)</option>
                            <option value="IN_REVIEW">IN_REVIEW (Technical Review)</option>
                            <option value="CONTACTED">CONTACTED (Followed Up)</option>
                            <option value="ARCHIVED">ARCHIVED (Archived)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${selectedInquiry.officialEmail}?cc=villagecoders7@gmail.com&subject=${encodeURIComponent(
                              `HCPT Halal Certification Platform - Re: Enterprise Consultation [${selectedInquiry.confirmationId}]`
                            )}&body=${encodeURIComponent(
                              `Dear ${selectedInquiry.fullName},\n\nThank you for reaching out to Halal Certification Processing Technologies (HCPT) via techhalal.com regarding your operations at ${selectedInquiry.organizationName}.\n\nWe have reviewed your inquiry and technical requirements:\n"${selectedInquiry.inquiryDetails}"\n\nOur solutions engineering team would like to schedule a formal briefing and bilateral demonstration.\n\nWarm regards,\nHCPT Enterprise Advisory\ninfo@techhalal.com\nhttps://techhalal.com`
                            )}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006837] text-white rounded-lg hover:bg-[#00522b] font-semibold transition-colors shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Reply via Email
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `Inquiry: ${selectedInquiry.confirmationId}\nName: ${selectedInquiry.fullName}\nOrg: ${selectedInquiry.organizationName}\nEmail: ${selectedInquiry.officialEmail}\nPhone: ${selectedInquiry.phoneNumber || 'N/A'}\nJurisdiction: ${selectedInquiry.jurisdiction}\nAnnual Volume: ${selectedInquiry.annualCertificates}\nCurrent Stack: ${selectedInquiry.currentSystem}\nMessage: ${selectedInquiry.inquiryDetails}`,
                                selectedInquiry.confirmationId
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
                          >
                            {copiedId === selectedInquiry.confirmationId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                Copy Dossier
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Dossier Content Body */}
                      <div className="p-6 space-y-6">
                        {/* Contact & Organization Matrix */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Contact & Institutional Metadata
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Official Representative</div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedInquiry.fullName}</div>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Organization / Authority</div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {selectedInquiry.organizationName}
                              </div>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Official Email</div>
                              <div className="text-sm font-bold text-[#006837] mt-0.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                                <a href={`mailto:${selectedInquiry.officialEmail}`} className="hover:underline">
                                  {selectedInquiry.officialEmail}
                                </a>
                              </div>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Direct Phone / Mobile</div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {selectedInquiry.phoneNumber ? (
                                  <a href={`tel:${selectedInquiry.phoneNumber}`} className="hover:underline">
                                    {selectedInquiry.phoneNumber}
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic font-normal">Not provided</span>
                                )}
                              </div>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Target Jurisdiction / Standard</div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                                {selectedInquiry.jurisdiction}
                              </div>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="text-[11px] text-slate-500 font-medium">Annual Certificate Throughput</div>
                              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                                {selectedInquiry.annualCertificates}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Technical Profile */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Current System & Infrastructure Baseline
                          </h4>
                          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
                            <strong className="text-slate-900 font-semibold block mb-1">Reported IT Environment:</strong>
                            {selectedInquiry.currentSystem}
                          </div>
                        </div>

                        {/* Inquiry & Technical Requirements Message */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Engagement Message & Technical Requirements
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {selectedInquiry.inquiryDetails.length} characters
                            </span>
                          </div>

                          <div className="p-5 bg-emerald-50/40 border border-emerald-200/80 rounded-xl relative">
                            <div className="text-emerald-800 font-serif text-3xl leading-none absolute top-3 left-3 opacity-30 select-none">
                              &ldquo;
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap pl-4">
                              {selectedInquiry.inquiryDetails}
                            </p>
                          </div>
                        </div>

                        {/* Resend Transmission Audit Proof */}
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                          <div className="flex items-center gap-2 text-slate-700 font-semibold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>System Transmission & Resend API Audit</span>
                          </div>
                          <p className="text-slate-500 leading-relaxed">
                            When this inquiry was lodged, automated dispatch routed a notification to{' '}
                            <strong className="text-slate-900 font-mono">villagecoders7@gmail.com</strong> with Reply-To set to{' '}
                            <span className="font-mono text-slate-900">{selectedInquiry.officialEmail}</span> and{' '}
                            <span className="font-mono text-slate-900">info@techhalal.com</span>.
                          </p>
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                            <span>Domain: techhalal.com</span>
                            <span>&bull;</span>
                            <span>Storage: Atlas & DemoStore</span>
                            <span>&bull;</span>
                            <span>Status: Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInquiriesPage;
