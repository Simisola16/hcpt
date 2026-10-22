import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  User,
  Bot,
  UserCheck,
  Sparkles,
  Search,
  Send,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Shield,
  Smartphone,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  Phone,
  Building2,
  MapPin,
  StickyNote,
  X,
  ChevronDown,
  ExternalLink,
  Check
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import {
  SupportConversation,
  SupportMessage,
  SupportConversationStatus,
  SupportHandlingMode,
  InternalStaffNote,
  SupportStatsSummary
} from '../../types/support';

export function SupportMobilePage() {
  const navigate = useNavigate();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!apiClient.getAdminToken();
  });
  const [adminUser, setAdminUser] = useState<{ username: string; email: string; role: string } | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data State
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
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
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AWAITING' | 'ACTIVE' | 'AI' | 'RESOLVED'>('ALL');

  // Active Thread State
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Data
  const fetchData = async (silent = false) => {
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
    } catch (err: any) {
      console.error('Failed to load mobile support data:', err);
      if (err?.message === 'Unauthorized') {
        setIsAuthenticated(false);
        setLoginError('Your administrative session has expired.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Real-time polling every 4 seconds on mobile
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeConversationId]);

  // Auto-scroll when active conversation changes or new message arrives
  useEffect(() => {
    if (activeConversationId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Login handler
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
        setLoginError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Network error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Send Human Reply from Smartphone
  const handleSendReply = async () => {
    if (!activeConversationId || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    const textToSend = replyText.trim();

    try {
      const humanMsg = await apiClient.sendAdminSupportReply(
        activeConversationId,
        textToSend,
        adminUser?.username || 'HCPT Admin'
      );
      if (humanMsg) {
        setReplyText('');
        showToast('✓ Delivered to customer chat');
        const updated = await apiClient.getAdminSupportConversationById(activeConversationId);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === activeConversationId ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Toggle Human Takeover on Smartphone
  const handleToggleTakeover = async () => {
    if (!activeConv) return;
    const isCurrentlyHuman = activeConv.handlingMode === 'human';
    const newMode: SupportHandlingMode = isCurrentlyHuman ? 'ai' : 'human';
    const newStatus: SupportConversationStatus = isCurrentlyHuman ? 'open' : 'human_handling';

    try {
      const success = await apiClient.updateAdminSupportStatus(activeConv.id, {
        status: newStatus,
        handlingMode: newMode,
        priority: activeConv.priority,
        assignedAgent: newMode === 'human' ? adminUser?.username || 'HCPT Staff' : undefined
      });
      if (success) {
        showToast(
          newMode === 'human'
            ? '✓ Human takeover active (AI paused)'
            : '✓ Returned to AI handling'
        );
        const updated = await apiClient.getAdminSupportConversationById(activeConv.id);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === activeConv.id ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle mode');
    }
  };

  // Quick Resolve Action
  const handleQuickResolve = async () => {
    if (!activeConv) return;
    try {
      const success = await apiClient.updateAdminSupportStatus(activeConv.id, {
        status: 'resolved',
        handlingMode: activeConv.handlingMode
      });
      if (success) {
        showToast('✓ Conversation marked resolved');
        const updated = await apiClient.getAdminSupportConversationById(activeConv.id);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === activeConv.id ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to resolve');
    }
  };

  // Add Internal Staff Note
  const handleAddNote = async () => {
    if (!activeConversationId || !newNoteText.trim() || addingNote) return;

    setAddingNote(true);
    try {
      const note = await apiClient.addAdminSupportInternalNote(
        activeConversationId,
        newNoteText.trim(),
        adminUser?.username || 'HCPT Mobile Staff'
      );
      if (note) {
        setNewNoteText('');
        showToast('✓ Confidential note saved');
        const updated = await apiClient.getAdminSupportConversationById(activeConversationId);
        if (updated) {
          setConversations(prev =>
            prev.map(c => (c.id === activeConversationId ? updated : c))
          );
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  // Filter Conversations for Mobile List
  const filteredConversations = conversations.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customer.name?.toLowerCase().includes(q);
      const matchOrg = c.customer.organization?.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchMsg = c.messages.some(m => m.text.toLowerCase().includes(q));
      if (!matchName && !matchOrg && !matchId && !matchMsg) return false;
    }

    if (activeFilter === 'AWAITING') return c.status === 'awaiting_human';
    if (activeFilter === 'ACTIVE') return c.handlingMode === 'human';
    if (activeFilter === 'AI') return c.handlingMode === 'ai' && c.status !== 'resolved';
    if (activeFilter === 'RESOLVED') return c.status === 'resolved';

    return true;
  });

  // Mobile Login View if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-4 py-8">
        <div className="w-full max-w-sm mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-lg font-bold">HCPT Mobile Support</h1>
            <p className="text-xs text-slate-400 mt-1">Admin mobile conversation manager</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="off"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="new-password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center justify-center space-x-2"
            >
              {loginLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In (Mobile)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // SCREEN 2: ACTIVE CONVERSATION THREAD (Mobile Full-Screen Chat Layout)
  if (activeConv) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
        {/* Sticky Mobile Chat Header */}
        <header className="bg-slate-900 text-white px-3 py-2.5 sticky top-0 z-30 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <button
              onClick={() => setActiveConversationId(null)}
              className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-300 hover:text-white active:bg-slate-800 transition"
              aria-label="Back to inbox"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h2 className="font-bold text-sm text-white truncate max-w-[170px]">
                  {activeConv.customer.name || `Visitor ${activeConv.id.substring(0, 8)}`}
                </h2>
                {activeConv.customer.visitorLocation?.country && (
                  <span className="text-xs" title={activeConv.customer.visitorLocation.country}>
                    {activeConv.customer.visitorLocation.flag || '🌐'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {activeConv.customer.organization || activeConv.customer.email || 'Online Visitor'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons on Header */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1 transition ${
                showNotesDrawer ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Staff notes"
            >
              <StickyNote className="w-4 h-4" />
              <span className="text-[10px]">{activeConv.internalNotes?.length || 0}</span>
            </button>

            <button
              onClick={handleToggleTakeover}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                activeConv.handlingMode === 'human'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {activeConv.handlingMode === 'human' ? (
                <span>AI Pause</span>
              ) : (
                <span>Take Over</span>
              )}
            </button>
          </div>
        </header>

        {/* Escalation Context Warning Bar */}
        {activeConv.escalationReason && (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">
                <strong>Escalated:</strong> {activeConv.escalationReason}
              </span>
            </div>
            {activeConv.status !== 'resolved' && (
              <button
                onClick={handleQuickResolve}
                className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md ml-2 shrink-0"
              >
                Resolve
              </button>
            )}
          </div>
        )}

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-slate-900 text-emerald-400 text-xs font-semibold py-1.5 px-3 text-center sticky top-14 z-20 shadow-md">
            {toastMessage}
          </div>
        )}

        {/* Message Thread (Mobile Bubble Layout) */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gradient-to-b from-slate-100 to-slate-50 pb-28">
          {activeConv.messages.map(msg => {
            const isCustomer = msg.sender === 'customer';
            const isHuman = msg.sender === 'human';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-1.5">
                  <div className="bg-amber-100 border border-amber-200 text-amber-900 text-[10px] px-3 py-1 rounded-full text-center max-w-[90%]">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  isHuman ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border ${
                    isHuman
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : isCustomer
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-slate-300 text-slate-800 border-slate-400'
                  }`}
                >
                  {isHuman ? (
                    <UserCheck className="w-3.5 h-3.5" />
                  ) : isCustomer ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-slate-800" />
                  )}
                </div>

                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[80%] shadow-xs ${
                    isHuman
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : isCustomer
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                      : 'bg-slate-200/90 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-75 gap-2">
                    <span className="font-semibold">
                      {isHuman
                        ? `You (${msg.authorName})`
                        : isCustomer
                        ? activeConv.customer.name || 'Visitor'
                        : 'AI Assistant'}
                    </span>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Staff Notes Drawer (Slide-up modal on mobile) */}
        {showNotesDrawer && (
          <div className="fixed inset-0 bg-slate-900/60 z-40 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-4 max-h-[75vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <StickyNote className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-sm text-slate-900">Confidential Staff Notes</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    Hidden from customer
                  </span>
                </div>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {(!activeConv.internalNotes || activeConv.internalNotes.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-4">No internal staff notes yet.</p>
                ) : (
                  activeConv.internalNotes.map(note => (
                    <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold mb-1">
                        <span>{note.author}</span>
                        <span className="font-normal text-amber-700">
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-800">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add private note..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteText.trim() || addingNote}
                  className="h-10 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Mobile Bottom Composer */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-2.5 z-30 shadow-lg">
          {/* Quick reply presets for fast mobile tapping */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 text-[11px] no-scrollbar">
            <button
              onClick={() => setReplyText('Hello! This is HCPT Support. I am reviewing your inquiry now.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Greeting
            </button>
            <button
              onClick={() => setReplyText('Please upload your laboratory report and product spec sheet to the portal.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Upload Doc
            </button>
            <button
              onClick={() => setReplyText('Your inquiry is resolved. Let us know if you need any additional help.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              Resolved
            </button>
          </div>

          <div className="flex items-end space-x-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Reply from phone..."
              className="flex-1 p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-24"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim() || sendingReply}
              className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 active:scale-95 transition"
              aria-label="Send reply"
            >
              {sendingReply ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 1: MOBILE INBOX LIST (Phone Optimized Feed)
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative">
      {/* Mobile App Header with HCPT Branding */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-30 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            H
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center space-x-1.5">
              <span>HCPT Support</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                Mobile
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Live Customer Conversations</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Link back to desktop view */}
          <Link
            to="/admin/support"
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-slate-700"
          >
            Desktop
          </Link>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchData();
            }}
            disabled={refreshing}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Overview Metric Bar */}
      <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Awaiting</span>
            <span className="font-bold text-amber-400 text-base">{stats.awaitingHuman}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Active</span>
            <span className="font-bold text-indigo-400 text-base">{stats.activeHuman}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">AI Mode</span>
            <span className="font-bold text-emerald-400 text-base">{stats.aiHandled}</span>
          </div>
        </div>

        {stats.awaitingHuman > 0 && (
          <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Needs attention</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="p-3 bg-white border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search visitor, organization, text..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 mt-2.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({conversations.length})
          </button>
          <button
            onClick={() => setActiveFilter('AWAITING')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition ${
              activeFilter === 'AWAITING'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            Needs Human ({stats.awaitingHuman})
          </button>
          <button
            onClick={() => setActiveFilter('ACTIVE')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition ${
              activeFilter === 'ACTIVE'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-800'
            }`}
          >
            Active ({stats.activeHuman})
          </button>
          <button
            onClick={() => setActiveFilter('AI')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition ${
              activeFilter === 'AI'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            AI Handled ({stats.aiHandled})
          </button>
          <button
            onClick={() => setActiveFilter('RESOLVED')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition ${
              activeFilter === 'RESOLVED'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Resolved ({stats.resolved})
          </button>
        </div>
      </div>

      {/* Conversation Cards Feed */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            <span>Loading mobile inbox...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No conversations in this filter</p>
          </div>
        ) : (
          filteredConversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isAwaiting = conv.status === 'awaiting_human';
            const isHumanHandling = conv.handlingMode === 'human';

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 bg-white rounded-2xl border transition shadow-xs active:scale-[0.98] cursor-pointer ${
                  isAwaiting
                    ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 truncate max-w-[190px]">
                      {conv.customer.name || `Visitor ${conv.id.substring(0, 8)}`}
                    </span>
                    {conv.customer.visitorLocation?.country && (
                      <span className="text-xs" title={conv.customer.visitorLocation.country}>
                        {conv.customer.visitorLocation.flag || '🌐'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Subtitle / Details */}
                <p className="text-[11px] text-slate-500 mb-2 truncate">
                  {conv.customer.organization || conv.customer.email || 'Online Visitor'}
                </p>

                {/* Badges */}
                <div className="flex items-center space-x-1.5 mb-2.5">
                  {isAwaiting ? (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                      <span>Needs Attention</span>
                    </span>
                  ) : isHumanHandling ? (
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <UserCheck className="w-2.5 h-2.5" />
                      <span>Human Takeover</span>
                    </span>
                  ) : conv.status === 'resolved' ? (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>AI Handled</span>
                    </span>
                  )}

                  {conv.unreadByAdmin && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                      NEW
                    </span>
                  )}
                </div>

                {/* Last Message Snippet */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 flex items-center justify-between">
                  <p className="truncate flex-1">
                    <span className="font-semibold text-slate-800">
                      {lastMsg?.sender === 'customer'
                        ? 'Customer: '
                        : lastMsg?.sender === 'human'
                        ? 'You: '
                        : 'AI: '}
                    </span>
                    {lastMsg?.text || 'No messages'}
                  </p>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1.5" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
