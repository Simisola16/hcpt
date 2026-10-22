import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  UserCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Minimize2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import {
  SupportConversation,
  SupportMessage,
  SupportCustomerInfo,
  SupportHandlingMode,
  SupportConversationStatus
} from '../../types/support';

const LOCAL_STORAGE_CONV_KEY = 'hcpt_support_conversation_id';
const LOCAL_STORAGE_TOKEN_KEY = 'hcpt_support_session_token';
const LOCAL_STORAGE_CUSTOMER_KEY = 'hcpt_support_customer_info';

const SUGGESTED_PROMPTS = [
  'How does digital Halal certification processing work?',
  'What documentation is required for an enterprise application?',
  'How do I verify an issued Halal certificate on HCPT?',
  'What are the inspection review and renewal procedures?'
];

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_CONV_KEY);
  });
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  });
  const [customerInfo, setCustomerInfo] = useState<SupportCustomerInfo>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOMER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { isGuest: true };
  });

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<SupportConversationStatus>('open');
  const [handlingMode, setHandlingMode] = useState<SupportHandlingMode>('ai');
  const [unreadCount, setUnreadCount] = useState(0);
  const [aiConfig, setAiConfig] = useState<{
    isAiConfigured: boolean;
    provider: string;
  }>({ isAiConfigured: true, provider: 'gemini' });

  // Contact capture modal during human escalation
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState(customerInfo.name || '');
  const [contactEmail, setContactEmail] = useState(customerInfo.email || '');
  const [contactPhone, setContactPhone] = useState(customerInfo.phone || '');
  const [contactOrg, setContactOrg] = useState(customerInfo.organization || '');
  const [escalating, setEscalating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  // Load support configuration and existing conversation
  useEffect(() => {
    apiClient.getSupportConfig().then(cfg => {
      setAiConfig(cfg);
    }).catch(err => {
      console.error('Error fetching support config:', err);
    });

    if (conversationId) {
      apiClient.getSupportConversation(conversationId, sessionToken || undefined)
        .then(conv => {
          if (conv) {
            setMessages(conv.messages || []);
            setStatus(conv.status);
            setHandlingMode(conv.handlingMode);
            if (conv.customer) {
              setCustomerInfo(conv.customer);
            }
          }
        })
        .catch(() => {
          // If conversation expired or not found, keep fresh state
        });
    }
  }, [conversationId, sessionToken]);

  // Real-time synchronization: poll every 3 seconds when waiting for or chatting with a human agent
  useEffect(() => {
    if (!conversationId) return;
    if (status !== 'awaiting_human' && status !== 'human_handling') return;

    const interval = setInterval(async () => {
      try {
        const conv = await apiClient.getSupportConversation(conversationId, sessionToken || undefined);
        if (conv) {
          setStatus(conv.status);
          setHandlingMode(conv.handlingMode);

          // Check if new human reply arrived
          if (conv.messages.length > messages.length) {
            setMessages(conv.messages);
            if (!isOpen) {
              setUnreadCount(prev => prev + (conv.messages.length - messages.length));
            }
          }
        }
      } catch (err) {
        // Silently tolerate temporary polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, sessionToken, status, messages.length, isOpen]);

  // Save customer info to local storage
  const saveCustomerInfo = (info: SupportCustomerInfo) => {
    setCustomerInfo(info);
    localStorage.setItem(LOCAL_STORAGE_CUSTOMER_KEY, JSON.stringify(info));
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    setErrorMessage(null);
    setIsLoading(true);

    // Optimistically add customer message to UI
    const tempCustomerMsg: SupportMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversationId || '',
      sender: 'customer',
      authorName: customerInfo.name || 'You',
      text: textToSend,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempCustomerMsg]);

    try {
      const res = await apiClient.sendChatMessage({
        conversationId: conversationId || undefined,
        sessionToken: sessionToken || undefined,
        message: textToSend,
        customerInfo: customerInfo
      });

      if (res.conversationId && res.conversationId !== conversationId) {
        setConversationId(res.conversationId);
        localStorage.setItem(LOCAL_STORAGE_CONV_KEY, res.conversationId);
      }
      if (res.sessionToken) {
        setSessionToken(res.sessionToken);
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, res.sessionToken);
      }

      setStatus(res.status as SupportConversationStatus);
      setHandlingMode(res.handlingMode);

      // Re-fetch conversation to maintain exact sync
      const updatedConv = await apiClient.getSupportConversation(res.conversationId, res.sessionToken);
      if (updatedConv) {
        setMessages(updatedConv.messages);
      } else if (res.reply) {
        setMessages(prev => [...prev.filter(m => m.id !== tempCustomerMsg.id), res.message, res.reply!]);
      }

      // If user escalated via natural language
      if (res.escalated && !customerInfo.email) {
        setShowContactModal(true);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setErrorMessage(err?.message || 'Could not send message. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHuman = async () => {
    if (!conversationId) {
      // Send initial trigger to create conversation first
      await handleSendMessage('I would like to speak with a human support representative.');
      setShowContactModal(true);
      return;
    }

    setEscalating(true);
    try {
      const success = await apiClient.requestHumanEscalation(
        conversationId,
        sessionToken || '',
        'Visitor requested human support assistance'
      );
      if (success) {
        setStatus('awaiting_human');
        setHandlingMode('human');
        const updatedConv = await apiClient.getSupportConversation(conversationId, sessionToken || undefined);
        if (updatedConv) {
          setMessages(updatedConv.messages);
        }
        setShowContactModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to request human assistance. Please try again.');
    } finally {
      setEscalating(false);
    }
  };

  const handleReturnToAi = async () => {
    if (!conversationId || !sessionToken) {
      setHandlingMode('ai');
      setStatus('open');
      return;
    }
    try {
      await apiClient.returnToAiMode(conversationId, sessionToken);
      setHandlingMode('ai');
      setStatus('open');
      const updatedConv = await apiClient.getSupportConversation(conversationId, sessionToken);
      if (updatedConv) {
        setMessages(updatedConv.messages);
      }
    } catch (err) {
      console.warn('Failed to switch back to AI mode:', err);
      setHandlingMode('ai');
      setStatus('open');
    }
  };

  const handleSaveContactModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SupportCustomerInfo = {
      ...customerInfo,
      name: contactName.trim() || undefined,
      email: contactEmail.trim() || undefined,
      phone: contactPhone.trim() || undefined,
      organization: contactOrg.trim() || undefined,
      isGuest: !contactEmail.trim()
    };
    saveCustomerInfo(updated);
    setShowContactModal(false);

    if (conversationId && (contactEmail.trim() || contactName.trim())) {
      try {
        await apiClient.updateCustomerSupportContact(conversationId, sessionToken || '', {
          name: contactName.trim() || undefined,
          email: contactEmail.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          organization: contactOrg.trim() || undefined
        });
      } catch (err) {
        // ignore
      }
    }
  };

  const handleStartNewConversation = () => {
    if (window.confirm('Start a new conversation? Previous messages will remain accessible to HCPT staff.')) {
      localStorage.removeItem(LOCAL_STORAGE_CONV_KEY);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      setConversationId(null);
      setSessionToken(null);
      setMessages([]);
      setStatus('open');
      setHandlingMode('ai');
      setInputText('');
      setErrorMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
        {/* Unread badge & prompt tooltip if closed */}
        {!isOpen && (
          <div className="flex items-center space-x-2 mb-2 animate-bounce">
            <div className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Need help? Ask AI or our team</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
          className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center ${
            isOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800 rotate-90'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-600/30 ring-4 ring-emerald-500/20'
          }`}
          style={{ width: '60px', height: '60px' }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Main Chat Panel Container */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="HCPT Support Chat"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-slate-900/40 rounded-[10px] flex items-center justify-center">
                    {handlingMode === 'human' ? (
                      <UserCheck className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-emerald-300" />
                    )}
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm tracking-tight text-white">HCPT Intelligent Support</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {handlingMode === 'human' ? 'Staff Live' : 'AI Assistant'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center space-x-1">
                  <span>Halal Certification Support & Inquiry</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleStartNewConversation}
                title="Start a new conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-header / Status & Human Handoff Action Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[200px]">
                {status === 'awaiting_human'
                  ? 'Forwarded to human support queue'
                  : status === 'human_handling'
                  ? 'Connected with human agent'
                  : 'Grounded AI with official HCPT data'}
              </span>
            </div>

            {status !== 'human_handling' && status !== 'awaiting_human' ? (
              <button
                onClick={handleRequestHuman}
                disabled={escalating}
                className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-medium hover:underline transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Talk to a human</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 text-amber-700 font-medium">
                  <Clock className="w-3 h-3 animate-spin" />
                  <span>Human queue</span>
                </span>
                <button
                  onClick={handleReturnToAi}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
                  title="Switch back to instant AI answers"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Switch to AI</span>
                </button>
              </div>
            )}
          </div>

          {/* Unconfigured AI warning if backend reports no provider keys */}
          {!aiConfig.isAiConfigured && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">AI Provider Offline</p>
                <p className="text-[11px] text-amber-700">
                  AI credentials not yet configured. Your inquiry will be answered directly by HCPT human support personnel.
                </p>
              </div>
            </div>
          )}

          {/* Active Human Queue Notice Banner */}
          {(status === 'awaiting_human' || status === 'human_handling') && (
            <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                <div>
                  <span className="font-semibold text-amber-950">Connected to Human Support Queue</span>
                  <span className="text-[11px] text-amber-800 ml-1 hidden sm:inline">
                    (or email <a href="mailto:support@techhalal.com" className="underline font-medium hover:text-emerald-700">support@techhalal.com</a>)
                  </span>
                </div>
              </div>
              <button
                onClick={handleReturnToAi}
                className="shrink-0 px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI Now</span>
              </button>
            </div>
          )}

          {/* Message Thread Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-50/50 to-white">
            {/* Welcoming Message Card */}
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold border border-emerald-200">
                <Bot className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-800 shadow-sm leading-relaxed max-w-[85%]">
                <p className="font-semibold text-emerald-950 mb-1 flex items-center space-x-1">
                  <span>HCPT Support Assistant</span>
                </p>
                <p>
                  Welcome to HCPT! I'm your AI support assistant. I can help you understand our digital certification
                  solutions, explain application workflows, and answer questions about using the platform. How can I help you today?
                </p>
              </div>
            </div>

            {/* Suggested Starter Questions (when few messages) */}
            {messages.length === 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Suggested inquiries
                </p>
                <div className="space-y-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="w-full text-left text-xs bg-slate-50 hover:bg-emerald-50/60 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300 rounded-xl px-3 py-2 text-slate-700 transition flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map(msg => {
              const isCustomer = msg.sender === 'customer';
              const isHumanStaff = msg.sender === 'human';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xs max-w-[90%] text-center">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    isCustomer ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border ${
                      isCustomer
                        ? 'bg-slate-900 text-white border-slate-800'
                        : isHumanStaff
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isCustomer ? (
                      <User className="w-3.5 h-3.5" />
                    ) : isHumanStaff ? (
                      <UserCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[82%] shadow-sm ${
                      isCustomer
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : isHumanStaff
                        ? 'bg-indigo-50/90 border border-indigo-200 text-slate-800 rounded-tl-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] opacity-80 gap-2">
                      <span className="font-semibold">
                        {isCustomer ? 'You' : msg.authorName || (isHumanStaff ? 'HCPT Staff' : 'AI Assistant')}
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

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{errorMessage}</p>
                  <button
                    onClick={() => handleSendMessage()}
                    className="mt-1 text-rose-700 underline font-semibold text-[11px]"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contact capture prompt / banner if escalated */}
          {showContactModal && (
            <div className="bg-slate-900 text-white p-3.5 border-t border-slate-800 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escalated to Support Staff</span>
                </span>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">
                Provide your details so our team can follow up directly if you step away:
              </p>
              <form onSubmit={handleSaveContactModal} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium px-3 py-1 rounded-lg transition"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  status === 'human_handling'
                    ? 'Message HCPT support staff...'
                    : status === 'awaiting_human'
                    ? 'Send message to queued agent...'
                    : 'Ask about certification, requirements, workflows...'
                }
                className="w-full pl-3 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none max-h-24 transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
              <span>Press Enter to send (Shift+Enter for newline)</span>
              <span>Encrypted & verified</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
