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
  Sparkles
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { StoredInquiry } from '../services/demoStore';

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'ARCHIVED'>('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('ALL');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const data = await apiClient.getContactInquiries();
      setInquiries(data);
      if (data.length > 0 && !selectedInquiryId) {
        setSelectedInquiryId(data[0].confirmationId);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInquiries();
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

  // Distinct jurisdictions for filter
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

  // Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === 'NEW').length;
    const inReviewCount = inquiries.filter(i => i.status === 'IN_REVIEW').length;
    const contactedCount = inquiries.filter(i => i.status === 'CONTACTED').length;
    const archivedCount = inquiries.filter(i => i.status === 'ARCHIVED').length;
    return { total, newCount, inReviewCount, contactedCount, archivedCount };
  }, [inquiries]);

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
                  Admin Console
                </span>
                <span className="text-xs text-slate-500">Live Intake Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Enterprise Engagement & Messages
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage incoming institutional consultation requests, technical reviews, and client inquiries.
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
                {refreshing ? 'Refreshing...' : 'Refresh Inquiries'}
              </button>
            </div>
          </div>

          {/* System Delivery Status Pill Row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>Resend Notification Dispatch:</strong> Active &rarr; <span className="font-mono text-emerald-900 font-semibold">villagecoders7@gmail.com</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              <Mail className="w-3 h-3 text-slate-500" />
              <span>
                <strong>Public Inflow Address:</strong> <a href="mailto:info@techhalal.com" className="font-mono text-slate-900 hover:text-emerald-700 font-semibold underline">info@techhalal.com</a>
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>
                <strong>Storage Sync:</strong> MongoDB Atlas & Resilient Store
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Inquiries</span>
              <Inbox className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{metrics.total}</div>
            <div className="text-[11px] text-slate-400 mt-1">All recorded submissions</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>New Submissions</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-emerald-800 mt-2">{metrics.newCount}</div>
            <div className="text-[11px] text-emerald-600 mt-1">Requires initial follow-up</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>In Technical Review</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{metrics.inReviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Architecture scoping</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Contacted & Replied</span>
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2">{metrics.contactedCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">In active consultation</div>
          </div>
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
                { key: 'ALL', label: 'All Inquiries', count: metrics.total },
                { key: 'NEW', label: 'New', count: metrics.newCount },
                { key: 'IN_REVIEW', label: 'In Review', count: metrics.inReviewCount },
                { key: 'CONTACTED', label: 'Contacted', count: metrics.contactedCount },
                { key: 'ARCHIVED', label: 'Archived', count: metrics.archivedCount }
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
        {loading ? (
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
                          `Dear ${selectedInquiry.fullName},\n\nThank you for reaching out to Halal Certification Processing Technologies (HCPT) regarding your operations at ${selectedInquiry.organizationName}.\n\nWe have reviewed your inquiry and technical requirements:\n"${selectedInquiry.inquiryDetails}"\n\nOur solutions engineering team would like to schedule a formal briefing and bilateral demonstration.\n\nWarm regards,\nHCPT Enterprise Advisory\ninfo@techhalal.com`
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
                        When this inquiry was lodged, HCPT automated dispatch routed a notification to{' '}
                        <strong className="text-slate-900 font-mono">villagecoders7@gmail.com</strong> with Reply-To set to{' '}
                        <span className="font-mono text-slate-900">{selectedInquiry.officialEmail}</span> and{' '}
                        <span className="font-mono text-slate-900">info@techhalal.com</span>.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>Status: Logged in Mongo/DemoStore</span>
                        <span>&bull;</span>
                        <span>Resend Key: Configured</span>
                        <span>&bull;</span>
                        <span>Audited: Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminInquiriesPage;
