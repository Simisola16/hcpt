import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  MessageSquare,
  User,
  Bot,
  UserCheck,
  Sparkles,
  Search,
  Filter,
  Send,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Shield,
  Smartphone,
  ChevronRight,
  Eye,
  Lock,
  LogOut,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  StickyNote,
  SlidersHorizontal,
  ChevronDown,
  ArrowLeft,
  Sparkle,
  Check
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import {
  SupportConversation,
  SupportMessage,
  SupportCustomerInfo,
  SupportConversationStatus,
  SupportHandlingMode,
  SupportPriority,
  InternalStaffNote,
  SupportStatsSummary
} from '../../types/support';

export function SupportInboxPage() {
  const navigate = useNavigate();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!apiClient.getAdminToken();
  });
  const [adminUser, setAdminUser] = useState<{ username: string; email: string; role: string } | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('hcpt123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Inbox Data State
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [stats, setStats] = useState<SupportStatsSummary>({
    total: 0,
    awaitingHuman: 0,
    activeHuman: 0,
    aiHandled: 0,
    resolved: 0,
    unreadCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SupportConversationStatus>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | SupportHandlingMode>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Conversation Action State
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'chat' | 'notes'>('chat');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations and stats
  const fetchConversationsData = async (silent = false) => {
    if (!apiClient.getAdminToken()) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    try {
      const [convs, statsData] = await Promise.all([
        apiClient.getAdminSupportConversations(),
        apiClient.getAdminSupportStats()
      ]);

      setConversations(convs);
      setStats(statsData);

      // Auto-select first conversation if none selected
      if (convs.length > 0 && !selectedConversationId) {
        setSelectedConversationId(convs[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load support conversations:', err);
      if (err?.message === 'Unauthorized') {
        setIsAuthenticated(false);
        setLoginError('Your administrative session has expired. Please sign in again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversationsData();
    }
  }, [isAuthenticated]);

  // Periodic polling for new messages & updates every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchConversationsData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, selectedConversationId]);

  // Scroll to bottom of message thread on selection change or reply
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversationId, conversations]);

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const result = await apiClient.loginAdmin(loginIdentifier, loginPassword, true);
      if (result.success) {
        setIsAuthenticated(true);
        if (result.admin) {
          setAdminUser(result.admin);
        }
      } else {
        setLoginError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Network error during login.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Send Human Reply
  const handleSendReply = async () => {
    if (!selectedConversationId || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const humanMsg = await apiClient.sendAdminSupportReply(
        selectedConversationId,
        replyText.trim(),
        adminUser?.username || 'HCPT Admin'
      );
      if (humanMsg) {
        setReplyText('');
        setActionSuccessMessage('Reply delivered to customer chat.');
        setTimeout(() => setActionSuccessMessage(null), 3000);

        const updated = await apiClient.getAdminSupportConversationById(selectedConversationId);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === selectedConversationId ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Add Internal Staff Note
  const handleAddNote = async () => {
    if (!selectedConversationId || !newNoteText.trim() || addingNote) return;

    setAddingNote(true);
    try {
      const note = await apiClient.addAdminSupportInternalNote(
        selectedConversationId,
        newNoteText.trim(),
        adminUser?.username || 'HCPT Staff'
      );
      if (note) {
        setNewNoteText('');
        setActionSuccessMessage('Internal note recorded.');
        setTimeout(() => setActionSuccessMessage(null), 3000);

        const updated = await apiClient.getAdminSupportConversationById(selectedConversationId);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === selectedConversationId ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to add internal note');
    } finally {
      setAddingNote(false);
    }
  };

  // Status Change (Resolve, Reopen, Take Over, Return to AI)
  const handleStatusChange = async (newStatus: SupportConversationStatus) => {
    if (!selectedConversationId) return;

    try {
      const newHandlingMode: SupportHandlingMode =
        newStatus === 'human_handling' ? 'human' : newStatus === 'open' ? 'ai' : selectedConv?.handlingMode || 'human';

      const success = await apiClient.updateAdminSupportStatus(selectedConversationId, {
        status: newStatus,
        handlingMode: newHandlingMode
      });
      if (success) {
        setActionSuccessMessage(`Conversation status updated to ${newStatus.replace('_', ' ')}.`);
        setTimeout(() => setActionSuccessMessage(null), 3000);

        const updated = await apiClient.getAdminSupportConversationById(selectedConversationId);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === selectedConversationId ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    }
  };

  // Toggle Human Takeover
  const handleToggleTakeover = async () => {
    if (!selectedConv) return;
    const isCurrentlyHuman = selectedConv.handlingMode === 'human';
    const newMode: SupportHandlingMode = isCurrentlyHuman ? 'ai' : 'human';
    const newStatus: SupportConversationStatus = isCurrentlyHuman ? 'open' : 'human_handling';

    try {
      const success = await apiClient.updateAdminSupportStatus(selectedConv.id, {
        status: newStatus,
        handlingMode: newMode,
        priority: selectedConv.priority,
        assignedAgent: newMode === 'human' ? adminUser?.username || 'HCPT Administrator' : undefined
      });
      if (success) {
        setActionSuccessMessage(
          newMode === 'human'
            ? 'Human takeover active. AI will not respond to new customer messages.'
            : 'Returned conversation to AI autonomous handling.'
        );
        setTimeout(() => setActionSuccessMessage(null), 3500);

        const updated = await apiClient.getAdminSupportConversationById(selectedConv.id);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === selectedConv.id ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle takeover');
    }
  };

  // Filter Conversations
  const filteredConversations = conversations.filter(c => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchName = c.customer.name?.toLowerCase().includes(q);
      const matchEmail = c.customer.email?.toLowerCase().includes(q);
      const matchOrg = c.customer.organization?.toLowerCase().includes(q);
      const matchMsg = c.messages.some(m => m.text.toLowerCase().includes(q));
      if (!matchId && !matchName && !matchEmail && !matchOrg && !matchMsg) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

    // Handling mode filter
    if (modeFilter !== 'ALL' && c.handlingMode !== modeFilter) return false;

    // Unread filter
    if (unreadOnly && !c.unreadByAdmin) return false;

    return true;
  });

  // Render Login Modal if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold">HCPT Support Admin</h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized Personnel Portal & Support Management
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Support Inbox</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                H
              </div>
              <span className="font-bold tracking-tight text-sm hidden sm:inline">HCPT Administration</span>
            </Link>
            <span className="text-slate-600">/</span>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-semibold text-sm">Human Support Inbox</span>
              {stats.awaitingHuman > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {stats.awaitingHuman} Needs Attention
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Switch to Dedicated Mobile App View */}
            <Link
              to="/admin/support/mobile"
              className="inline-flex items-center space-x-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
              title="Launch smartphone-optimized mobile inbox"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Phone View</span>
            </Link>

            <Link
              to="/admin/inquiries"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition"
            >
              Enterprise Inquiries
            </Link>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchConversationsData();
              }}
              disabled={refreshing}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Refresh inbox"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-600 text-white text-xs font-medium py-2 px-4 text-center shadow-md animate-in fade-in duration-200">
          <span className="flex items-center justify-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>{actionSuccessMessage}</span>
          </span>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Inquiries</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 shadow-xs">
            <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Awaiting Human</span>
            </p>
            <p className="text-xl font-bold text-amber-950 mt-1">{stats.awaitingHuman}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3.5 border border-indigo-200 shadow-xs">
            <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Human Handled</p>
            <p className="text-xl font-bold text-indigo-950 mt-1">{stats.activeHuman}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 shadow-xs">
            <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">AI Autonomous</p>
            <p className="text-xl font-bold text-emerald-950 mt-1">{stats.aiHandled}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-xl font-bold text-slate-700 mt-1">{stats.resolved}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200 shadow-xs">
            <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Unread Messages</p>
            <p className="text-xl font-bold text-rose-950 mt-1">{stats.unreadCount}</p>
          </div>
        </div>

        {/* Main Two-Pane Inbox Workspace */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col lg:flex-row h-[760px] max-h-[82vh] overflow-hidden">
          {/* LEFT COLUMN: Conversation Threads List */}
          <div className="w-full lg:w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50">
            {/* Filter & Search Bar */}
            <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search customer, ID, content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Chips Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    statusFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setStatusFilter('awaiting_human')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    statusFilter === 'awaiting_human'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Needs Agent ({stats.awaitingHuman})
                </button>
                <button
                  onClick={() => setStatusFilter('human_handling')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    statusFilter === 'human_handling'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  Active ({stats.activeHuman})
                </button>
                <button
                  onClick={() => setStatusFilter('resolved')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    statusFilter === 'resolved'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading && conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  <span>Loading customer conversations...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No conversations found</p>
                  <p className="mt-1">Try clearing filters or search terms.</p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = conv.id === selectedConversationId;
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  const isAwaiting = conv.status === 'awaiting_human';
                  const isHumanHandling = conv.handlingMode === 'human';

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`p-3.5 cursor-pointer transition relative group ${
                        isSelected
                          ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                          : 'hover:bg-white bg-slate-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-slate-900 truncate max-w-[170px]">
                            {conv.customer.name || `Visitor ${conv.id.substring(0, 10)}`}
                          </span>
                          {conv.customer.visitorLocation?.country && (
                            <span className="text-[11px] text-slate-500" title={conv.customer.visitorLocation.country}>
                              {conv.customer.visitorLocation.flag || '🌐'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center space-x-1.5 mb-2">
                        {isAwaiting ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                            <span>Awaiting Staff</span>
                          </span>
                        ) : isHumanHandling ? (
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>Human Takeover</span>
                          </span>
                        ) : conv.status === 'resolved' ? (
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            Resolved
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center space-x-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI Handled</span>
                          </span>
                        )}

                        {conv.priority === 'urgent' && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Urgent
                          </span>
                        )}

                        {conv.unreadByAdmin && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 ml-auto" title="New unread message"></span>
                        )}
                      </div>

                      {/* Last Message Snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        <span className="font-medium text-slate-700">
                          {lastMsg?.sender === 'customer'
                            ? 'Customer: '
                            : lastMsg?.sender === 'human'
                            ? 'Staff: '
                            : 'AI: '}
                        </span>
                        {lastMsg?.text || 'No messages yet'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Conversation Workspace */}
          {selectedConv ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Workspace Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedConv.customer.name || `Guest Visitor (${selectedConv.id})`}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">#{selectedConv.id}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                    {selectedConv.customer.email && (
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedConv.customer.email}</span>
                      </span>
                    )}
                    {selectedConv.customer.organization && (
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedConv.customer.organization}</span>
                      </span>
                    )}
                    {selectedConv.customer.visitorLocation?.country && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {selectedConv.customer.visitorLocation.city
                            ? `${selectedConv.customer.visitorLocation.city}, `
                            : ''}
                          {selectedConv.customer.visitorLocation.country}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Mode Controls */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  {/* Take Over / Return to AI Action Button */}
                  <button
                    onClick={handleToggleTakeover}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs ${
                      selectedConv.handlingMode === 'human'
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                    }`}
                  >
                    {selectedConv.handlingMode === 'human' ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        <span>Return to AI</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Take Over (Human)</span>
                      </>
                    )}
                  </button>

                  {/* Status Dropdown */}
                  <select
                    value={selectedConv.status}
                    onChange={e => handleStatusChange(e.target.value as SupportConversationStatus)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="open">Open (AI Active)</option>
                    <option value="awaiting_human">Awaiting Human</option>
                    <option value="human_handling">Human Handling</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Escalation Context Warning Banner */}
              {selectedConv.escalationReason && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong className="font-semibold">Escalation Trigger:</strong> {selectedConv.escalationReason}
                    </span>
                  </div>
                  {selectedConv.escalatedAt && (
                    <span className="text-[11px] text-amber-700">
                      {new Date(selectedConv.escalatedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}

              {/* Workspace Navigation Tabs */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 flex items-center space-x-6 text-xs">
                <button
                  onClick={() => setActiveWorkspaceTab('chat')}
                  className={`py-2.5 font-semibold flex items-center space-x-1.5 border-b-2 transition ${
                    activeWorkspaceTab === 'chat'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Customer Messages ({selectedConv.messages.length})</span>
                </button>
                <button
                  onClick={() => setActiveWorkspaceTab('notes')}
                  className={`py-2.5 font-semibold flex items-center space-x-1.5 border-b-2 transition ${
                    activeWorkspaceTab === 'notes'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  <span>Internal Staff Notes ({selectedConv.internalNotes?.length || 0})</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 rounded-full font-mono">
                    Staff Only
                  </span>
                </button>
              </div>

              {/* TAB 1: Chat Thread */}
              {activeWorkspaceTab === 'chat' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
                    {selectedConv.messages.map(msg => {
                      const isCustomer = msg.sender === 'customer';
                      const isHuman = msg.sender === 'human';
                      const isSystem = msg.sender === 'system';

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <div className="bg-amber-100/70 border border-amber-200 text-amber-900 text-[11px] px-3 py-1 rounded-full flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>{msg.text}</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start space-x-2.5 ${
                            isHuman ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border ${
                              isHuman
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : isCustomer
                                ? 'bg-emerald-700 text-white border-emerald-800'
                                : 'bg-slate-200 text-slate-800 border-slate-300'
                            }`}
                          >
                            {isHuman ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : isCustomer ? (
                              <User className="w-3.5 h-3.5" />
                            ) : (
                              <Bot className="w-3.5 h-3.5 text-slate-700" />
                            )}
                          </div>

                          <div
                            className={`rounded-2xl p-3.5 text-xs leading-relaxed max-w-[75%] shadow-xs ${
                              isHuman
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : isCustomer
                                ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                                : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 text-[10px] opacity-80 gap-3">
                              <span className="font-semibold">
                                {isHuman
                                  ? `Staff (${msg.authorName})`
                                  : isCustomer
                                  ? selectedConv.customer.name || 'Customer'
                                  : 'HCPT AI Assistant'}
                              </span>
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Human Reply Composer */}
                  <div className="p-3.5 bg-white border-t border-slate-200">
                    {/* Quick Response Suggestions */}
                    <div className="flex items-center space-x-1.5 mb-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                      <span className="text-slate-400 font-medium whitespace-nowrap">Canned replies:</span>
                      <button
                        onClick={() =>
                          setReplyText(
                            'Hello! This is HCPT Support. I have reviewed your inquiry and am glad to assist you.'
                          )
                        }
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition"
                      >
                        Introduction
                      </button>
                      <button
                        onClick={() =>
                          setReplyText(
                            'To proceed with your Halal certificate application, please ensure your lab analysis report and ingredients list are uploaded to the portal.'
                          )
                        }
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition"
                      >
                        Documentation Reminder
                      </button>
                      <button
                        onClick={() =>
                          setReplyText(
                            'Your request has been resolved. Please let us know if you require any further assistance.'
                          )
                        }
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition"
                      >
                        Resolution
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type human reply to customer (delivers directly to their chat widget)..."
                        className="w-full p-3 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Sending as Authorized Staff</span>
                        </span>
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim() || sendingReply}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium px-4 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                        >
                          {sendingReply ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Human Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* TAB 2: Internal Staff Notes */
                <div className="flex-1 flex flex-col p-4 bg-slate-50/50">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {(!selectedConv.internalNotes || selectedConv.internalNotes.length === 0) ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        <StickyNote className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No staff notes yet</p>
                        <p className="mt-1">Add confidential audit notes, phone call logs, or verification flags here.</p>
                      </div>
                    ) : (
                      selectedConv.internalNotes.map(note => (
                        <div key={note.id} className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs">
                          <div className="flex items-center justify-between mb-1.5 text-[11px] text-amber-900 font-semibold">
                            <span>{note.author}</span>
                            <span className="text-amber-700 font-normal">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-800 whitespace-pre-wrap">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="bg-white p-3 border border-slate-200 rounded-xl">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Add Confidential Staff Note
                    </label>
                    <textarea
                      rows={2}
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      placeholder="Note is strictly internal and never visible to the customer..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddNote}
                        disabled={!newNoteText.trim() || addingNote}
                        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition"
                      >
                        {addingNote ? 'Saving...' : 'Save Internal Note'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <div>
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 text-sm">Select a Conversation</h3>
                <p className="text-xs text-slate-500 mt-1">Choose any thread on the left to view customer messages and reply.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
