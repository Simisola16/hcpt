import {
  CertificationApplication,
  Organization,
  InspectionRecord,
  CertificateRecord,
  RenewalRecord,
  AuditHistoryEvent,
  ApplicationStatus,
  PERMITTED_STATUS_TRANSITIONS,
  ApplicationDocument,
  ReviewerNote
} from '../types/certification';
import {
  SupportConversation,
  SupportMessage,
  InternalStaffNote,
  SupportStatsSummary
} from '../types/support';
import {
  INITIAL_APPLICATIONS,
  INITIAL_ORGANIZATIONS,
  INITIAL_INSPECTIONS,
  INITIAL_CERTIFICATES,
  INITIAL_RENEWALS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

export interface StoredInquiry {
  confirmationId: string;
  fullName: string;
  organizationName: string;
  officialEmail: string;
  phoneNumber?: string;
  jurisdiction: string;
  currentSystem: string;
  annualCertificates: string;
  inquiryDetails: string;
  status: 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'ARCHIVED';
  receivedAt: string;
}

export interface VisitorLocationRecord {
  id: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  timestamp: string;
}

export const INITIAL_VISITOR_LOCATIONS: VisitorLocationRecord[] = [
  {
    id: 'loc-101',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-102',
    city: 'Kuala Lumpur',
    region: 'Federal Territory',
    country: 'Malaysia',
    countryCode: 'MY',
    flag: '🇲🇾',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-103',
    city: 'Riyadh',
    region: 'Riyadh Province',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-104',
    city: 'Abu Dhabi',
    region: 'Abu Dhabi',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-105',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-106',
    city: 'Jakarta',
    region: 'DKI Jakarta',
    country: 'Indonesia',
    countryCode: 'ID',
    flag: '🇮🇩',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-107',
    city: 'Istanbul',
    region: 'Marmara',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-108',
    city: 'Singapore',
    region: 'Central Region',
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-109',
    city: 'Chicago',
    region: 'Illinois',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    timestamp: new Date(Date.now() - 290 * 60 * 1000).toISOString()
  },
  {
    id: 'loc-110',
    city: 'Doha',
    region: 'Ad Dawhah',
    country: 'Qatar',
    countryCode: 'QA',
    flag: '🇶🇦',
    timestamp: new Date(Date.now() - 380 * 60 * 1000).toISOString()
  }
];

export const INITIAL_INQUIRIES: StoredInquiry[] = [
  {
    confirmationId: 'HCPT-INQ-849102',
    fullName: 'Dr. Tariq Al-Hashimi',
    organizationName: 'Gulf Halal Standards Authority',
    officialEmail: 'tariq.hashimi@ghsa.gov.ae',
    phoneNumber: '+971 4 398 2210',
    jurisdiction: 'United Arab Emirates / GCC',
    currentSystem: 'Legacy bespoke database with manual PDF handling',
    annualCertificates: '5,000 - 25,000 certificates/year',
    inquiryDetails: 'Seeking sovereign cloud deployment to transition our national halal assessment network from paper-based audit checklists to cryptographically verifiable QR digital credentials with GSO 2055-1 compliance.',
    status: 'NEW',
    receivedAt: '2026-10-21 14:15:00 UTC'
  },
  {
    confirmationId: 'HCPT-INQ-631249',
    fullName: 'Hajjah Noor Aminah binti Razak',
    organizationName: 'ASEAN Halal Assurance Consortium',
    officialEmail: 'n.aminah@asean-halal.org',
    phoneNumber: '+60 3 8886 4500',
    jurisdiction: 'Malaysia / ASEAN (JAKIM)',
    currentSystem: 'Multi-system hybrid with manual spreadsheet reconciliation',
    annualCertificates: '25,000+ certificates/year',
    inquiryDetails: 'Evaluating technical review workflow engine for multinational food manufacturing audits across 14 export corridors. Need automated ingredient biochemical cross-matching and laboratory test result ingest.',
    status: 'IN_REVIEW',
    receivedAt: '2026-10-20 09:30:00 UTC'
  },
  {
    confirmationId: 'HCPT-INQ-492715',
    fullName: 'Marc Van Der Berg',
    organizationName: 'European Halal Certification Council (EHCC)',
    officialEmail: 'm.vanderberg@ehcc-eu.com',
    phoneNumber: '+31 20 894 3320',
    jurisdiction: 'European Union / UK',
    currentSystem: 'Custom internal ERP without digital certificate verification',
    annualCertificates: '1,000 - 5,000 certificates/year',
    inquiryDetails: 'Urgent requirement to modernize slaughterhouse audit reporting and issue tamper-proof digital certificates recognized by GCC and BPJPH authorities for EU meat exporters.',
    status: 'CONTACTED',
    receivedAt: '2026-10-19 16:45:00 UTC'
  }
];

const STORAGE_KEYS = {
  APPLICATIONS: 'hcpt_demo_applications_v1',
  ORGANIZATIONS: 'hcpt_demo_organizations_v1',
  INSPECTIONS: 'hcpt_demo_inspections_v1',
  CERTIFICATES: 'hcpt_demo_certificates_v1',
  RENEWALS: 'hcpt_demo_renewals_v1',
  AUDIT_LOGS: 'hcpt_demo_audit_logs_v1',
  INQUIRIES: 'hcpt_demo_inquiries_v1',
  VISITOR_LOCATIONS: 'hcpt_visitor_locations_v1',
  SUPPORT_CONVERSATIONS: 'hcpt_support_conversations_v1'
};

export const INITIAL_SUPPORT_CONVERSATIONS: SupportConversation[] = [
  {
    id: 'conv-hcpt-8821',
    sessionToken: 'token-session-guest-8821-secure',
    customer: {
      name: 'Zayd Ibrahim',
      email: 'z.ibrahim@emiratesfood.ae',
      phone: '+971 4 883 9100',
      organization: 'Emirates Food Group (UAE)',
      isGuest: false,
      visitorLocation: {
        city: 'Dubai',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        flag: '🇦🇪'
      }
    },
    status: 'awaiting_human',
    handlingMode: 'human',
    priority: 'urgent',
    escalationReason: 'Visitor requested technical briefing on abattoir batch RFID tracking integration',
    escalatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    unreadByAdmin: true,
    unreadByCustomer: false,
    messages: [
      {
        id: 'msg-8821-1',
        conversationId: 'conv-hcpt-8821',
        sender: 'customer',
        authorName: 'Zayd Ibrahim',
        text: 'Hello, we are evaluating the platform demo for our slaughterhouse network. Can HCPT integrate with RFID livestock ear-tag scanners for pre-slaughter vetting?',
        createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-8821-2',
        conversationId: 'conv-hcpt-8821',
        sender: 'ai',
        authorName: 'HCPT AI Assistant',
        text: 'Welcome to HCPT! Yes, our Electronic Application Processing and Workflow Management modules support automated ingestion of pre-slaughter livestock batches (including RFID tag telemetry and veterinary clearance certificates) aligned with GSO 993 standards.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-8821-3',
        conversationId: 'conv-hcpt-8821',
        sender: 'customer',
        authorName: 'Zayd Ibrahim',
        text: 'Can I speak with a technical human representative regarding high-throughput API latency and on-premise edge deployments?',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-8821-4',
        conversationId: 'conv-hcpt-8821',
        sender: 'ai',
        authorName: 'HCPT AI Assistant',
        text: "I'll pass this conversation to the HCPT support team. You can continue sending messages here, and a team member will respond as soon as they are available.",
        createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString()
      }
    ],
    internalNotes: [
      {
        id: 'note-8821-1',
        author: 'System Escalate',
        text: 'Customer requested human assistance. Priority marked urgent due to sovereign abattoir evaluation.',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 1000).toISOString()
  },
  {
    id: 'conv-hcpt-9142',
    sessionToken: 'token-session-guest-9142-secure',
    customer: {
      name: 'Amina El-Sayed',
      email: 'amina@cairologistics.eg',
      organization: 'Cairo Food Logistics',
      isGuest: false,
      visitorLocation: {
        city: 'Cairo',
        country: 'Egypt',
        countryCode: 'EG',
        flag: '🇪🇬'
      }
    },
    status: 'human_handling',
    handlingMode: 'human',
    priority: 'normal',
    assignedAgent: 'admin',
    unreadByAdmin: false,
    unreadByCustomer: false,
    messages: [
      {
        id: 'msg-9142-1',
        conversationId: 'conv-hcpt-9142',
        sender: 'customer',
        authorName: 'Amina El-Sayed',
        text: 'Hi, we checked certificate CERT-2026-8812 on the public verification page earlier today. Is the QR code scan cryptographically verified against the Central Registry?',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      },
      {
        id: 'msg-9142-2',
        conversationId: 'conv-hcpt-9142',
        sender: 'human',
        authorName: 'Admin',
        text: 'Hello Amina! Yes, every QR code on an HCPT certificate embeds a digital cryptographic digest signed with ECDSA-P384. When scanned, it performs an immutable signature validation against our Central Registry.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'msg-9142-3',
        conversationId: 'conv-hcpt-9142',
        sender: 'customer',
        authorName: 'Amina El-Sayed',
        text: 'Excellent, that satisfies our port authority requirement for customs export to GCC countries.',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      }
    ],
    internalNotes: [],
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: 'conv-hcpt-7031',
    sessionToken: 'token-session-guest-7031-secure',
    customer: {
      name: 'Website Visitor',
      isGuest: true,
      visitorLocation: {
        city: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        flag: '🇬🇧'
      }
    },
    status: 'open',
    handlingMode: 'ai',
    priority: 'normal',
    unreadByAdmin: false,
    unreadByCustomer: false,
    messages: [
      {
        id: 'msg-7031-1',
        conversationId: 'conv-hcpt-7031',
        sender: 'customer',
        authorName: 'Guest',
        text: 'What are the main stages of the certification workflow in HCPT?',
        createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-7031-2',
        conversationId: 'conv-hcpt-7031',
        sender: 'ai',
        authorName: 'HCPT AI Assistant',
        text: 'The HCPT platform orchestrates a 6-stage lifecycle: 1. Electronic Intake & Triage, 2. Technical Assessor Review, 3. On-Site Inspection Scheduling & Audit, 4. Shariah Supervisory Board Ruling, 5. Directorate Sign-off, and 6. Cryptographic Certificate Issuance with QR Registry Verification.',
        createdAt: new Date(Date.now() - 49 * 60 * 1000).toISOString()
      }
    ],
    internalNotes: [],
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 49 * 60 * 1000).toISOString()
  }
];

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[HCPT Store] Failed reading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[HCPT Store] Failed saving ${key} to storage:`, e);
  }
}

export class DemoStore {
  private applications: CertificationApplication[];
  private organizations: Organization[];
  private inspections: InspectionRecord[];
  private certificates: CertificateRecord[];
  private renewals: RenewalRecord[];
  private auditLogs: AuditHistoryEvent[];
  private inquiries: StoredInquiry[];
  private visitorLocations: VisitorLocationRecord[];
  private supportConversations: SupportConversation[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.applications = loadStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.organizations = loadStorage(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    this.inspections = loadStorage(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
    this.certificates = loadStorage(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    this.renewals = loadStorage(STORAGE_KEYS.RENEWALS, INITIAL_RENEWALS);
    this.auditLogs = loadStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.inquiries = loadStorage(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    this.visitorLocations = loadStorage(STORAGE_KEYS.VISITOR_LOCATIONS, INITIAL_VISITOR_LOCATIONS);
    this.supportConversations = loadStorage(STORAGE_KEYS.SUPPORT_CONVERSATIONS, INITIAL_SUPPORT_CONVERSATIONS);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  public addAuditLog(
    action: string,
    targetEntity: string,
    targetRef: string,
    details: string,
    actor: string = 'Current Assessor (Demo User)',
    role: string = 'Certification Officer'
  ): void {
    const newLog: AuditHistoryEvent = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role,
      action,
      targetEntity,
      targetRef,
      details,
      isSimulatedDemoEvent: true
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    saveStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- APPLICATIONS ---
  public getApplications(): CertificationApplication[] {
    return [...this.applications];
  }

  public getApplicationById(id: string): CertificationApplication | undefined {
    return this.applications.find(a => a.id === id || a.referenceNumber === id);
  }

  public updateApplicationStatus(
    id: string,
    nextStatus: ApplicationStatus,
    reason: string,
    actor: string = 'Lead Assessor (Demo)'
  ): { success: boolean; message: string } {
    const appIndex = this.applications.findIndex(a => a.id === id);
    if (appIndex === -1) {
      return { success: false, message: 'Application record not found.' };
    }

    const currentApp = this.applications[appIndex];
    const allowed = PERMITTED_STATUS_TRANSITIONS[currentApp.status] || [];

    if (!allowed.includes(nextStatus)) {
      return {
        success: false,
        message: `Status transition from "${currentApp.status}" to "${nextStatus}" is not permitted by the certification business rules.`
      };
    }

    const updatedApp: CertificationApplication = {
      ...currentApp,
      status: nextStatus,
      lastUpdated: new Date().toISOString().substring(0, 10),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: nextStatus,
          actor,
          role: 'Certification Assessor',
          description: reason || `Application transitioned to ${nextStatus}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        },
        ...currentApp.timeline
      ]
    };

    this.applications[appIndex] = updatedApp;
    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    this.addAuditLog(
      'STATUS_TRANSITION',
      'Application',
      currentApp.referenceNumber,
      `Transitioned from ${currentApp.status} to ${nextStatus}. Justification: ${reason}`,
      actor
    );

    this.notify();
    return { success: true, message: `Application updated to ${nextStatus} successfully.` };
  }

  public addReviewerNote(
    applicationId: string,
    content: string,
    author: string = 'Dr. Tariq Al-Hashimi',
    role: string = 'Lead Technical Assessor',
    isInternal: boolean = true
  ): boolean {
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return false;

    const newNote: ReviewerNote = {
      id: `note-${Date.now()}`,
      author,
      role,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isInternal
    };

    this.applications[appIndex].notes = [newNote, ...this.applications[appIndex].notes];
    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    this.addAuditLog(
      'NOTE_RECORDED',
      'Application',
      this.applications[appIndex].referenceNumber,
      `Reviewer note recorded: "${content.substring(0, 60)}..."`,
      author,
      role
    );

    this.notify();
    return true;
  }

  public requestMissingInfo(
    applicationId: string,
    fields: string[],
    message: string,
    requestedBy: string = 'Senior Reviewer (Demo)'
  ): boolean {
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return false;

    const newRfi = {
      id: `rfi-${Date.now()}`,
      requestedFields: fields,
      message,
      requestedBy,
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending Response' as const
    };

    this.applications[appIndex].missingInfoRequests = [
      newRfi,
      ...this.applications[appIndex].missingInfoRequests
    ];

    // Automatically transition to Awaiting Applicant Information if allowed
    const allowed = PERMITTED_STATUS_TRANSITIONS[this.applications[appIndex].status] || [];
    if (allowed.includes('Awaiting Applicant Information')) {
      this.applications[appIndex].status = 'Awaiting Applicant Information';
      this.applications[appIndex].timeline.unshift({
        id: `tl-${Date.now()}`,
        status: 'Awaiting Applicant Information',
        actor: requestedBy,
        role: 'Certification Assessor',
        description: `RFI Dispatched: ${message}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }

    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    this.addAuditLog(
      'RFI_DISPATCHED',
      'Application',
      this.applications[appIndex].referenceNumber,
      `Information requested from applicant: ${message}`,
      requestedBy
    );

    this.notify();
    return true;
  }

  public uploadSimulatedDocument(
    applicationId: string,
    doc: {
      name: string;
      category: ApplicationDocument['category'];
      fileName: string;
      fileSize: string;
    }
  ): boolean {
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return false;

    const newDoc: ApplicationDocument = {
      id: `doc-${Date.now()}`,
      name: doc.name,
      category: doc.category,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      version: 'v1.0 (Demo Upload)',
      status: 'Under Review',
      reviewNotes: 'Simulated file intake. Ready for technical audit inspection.'
    };

    this.applications[appIndex].documents = [newDoc, ...this.applications[appIndex].documents];
    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    this.addAuditLog(
      'DOCUMENT_UPLOADED',
      'Document',
      doc.fileName,
      `Simulated document upload: ${doc.name} (${doc.category})`,
      'Applicant QA Team'
    );

    this.notify();
    return true;
  }

  public updateDocumentStatus(
    applicationId: string,
    documentId: string,
    status: ApplicationDocument['status'],
    notes?: string
  ): boolean {
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return false;

    const docIndex = this.applications[appIndex].documents.findIndex(d => d.id === documentId);
    if (docIndex === -1) return false;

    this.applications[appIndex].documents[docIndex].status = status;
    if (notes) {
      this.applications[appIndex].documents[docIndex].reviewNotes = notes;
    }

    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);

    this.addAuditLog(
      'DOCUMENT_STATUS_CHANGED',
      'Document',
      this.applications[appIndex].documents[docIndex].fileName,
      `Document status updated to ${status}. Notes: ${notes || 'None'}`
    );

    this.notify();
    return true;
  }

  // --- INSPECTIONS ---
  public getInspections(): InspectionRecord[] {
    return [...this.inspections];
  }

  public scheduleInspection(
    applicationId: string,
    scheduledDate: string,
    scheduledTime: string,
    assignedInspector: string,
    checklistItems: string[]
  ): { success: boolean; inspectionId: string } {
    const app = this.getApplicationById(applicationId);
    if (!app) return { success: false, inspectionId: '' };

    const newInspectionId = `insp-${Date.now()}`;
    const newInspection: InspectionRecord = {
      id: newInspectionId,
      inspectionRef: `HCPT-INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationId: app.id,
      applicationRef: app.referenceNumber,
      organizationName: app.organizationName,
      facilityName: app.facilityName,
      facilityAddress: app.facilityAddress,
      scheduledDate,
      scheduledTime,
      assignedInspector,
      inspectorCredentials: 'Lead Halal Assessor (ISO 17065 & SMIIC)',
      status: 'Scheduled',
      checklist: checklistItems.map((c, i) => ({
        id: `ci-${Date.now()}-${i}`,
        criterion: c,
        verified: false,
        severity: i === 0 ? 'Critical' : i === 1 ? 'Critical' : 'Major'
      }))
    };

    this.inspections = [newInspection, ...this.inspections];
    saveStorage(STORAGE_KEYS.INSPECTIONS, this.inspections);

    // Update application state
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex !== -1) {
      this.applications[appIndex].inspectionId = newInspectionId;
      this.applications[appIndex].assignedInspector = assignedInspector;
      if (this.applications[appIndex].status === 'Technical Review') {
        this.updateApplicationStatus(
          applicationId,
          'Inspection Scheduled',
          `Field inspection scheduled for ${scheduledDate} with ${assignedInspector}`,
          'Dispatch Operations Desk'
        );
      }
    }

    this.addAuditLog(
      'INSPECTION_SCHEDULED',
      'Inspection',
      newInspection.inspectionRef,
      `Scheduled for ${app.facilityName} on ${scheduledDate} (${scheduledTime}) with ${assignedInspector}`
    );

    this.notify();
    return { success: true, inspectionId: newInspectionId };
  }

  public completeInspection(
    inspectionId: string,
    outcome: InspectionRecord['outcome'],
    findingsSummary: string
  ): boolean {
    const inspIndex = this.inspections.findIndex(i => i.id === inspectionId);
    if (inspIndex === -1) return false;

    this.inspections[inspIndex].status = 'Completed';
    this.inspections[inspIndex].outcome = outcome;
    this.inspections[inspIndex].findingsSummary = findingsSummary;
    this.inspections[inspIndex].checklist.forEach(c => (c.verified = true));

    saveStorage(STORAGE_KEYS.INSPECTIONS, this.inspections);

    // Advance application if appropriate
    const appId = this.inspections[inspIndex].applicationId;
    const app = this.getApplicationById(appId);
    if (app && app.status === 'Inspection Scheduled') {
      this.updateApplicationStatus(
        appId,
        'Inspection Completed',
        `Field audit concluded with outcome: ${outcome}`,
        this.inspections[inspIndex].assignedInspector
      );
    }

    this.addAuditLog(
      'INSPECTION_COMPLETED',
      'Inspection',
      this.inspections[inspIndex].inspectionRef,
      `Inspection concluded with outcome: ${outcome}. Findings: ${findingsSummary}`,
      this.inspections[inspIndex].assignedInspector
    );

    this.notify();
    return true;
  }

  // --- CERTIFICATES ---
  public getCertificates(): CertificateRecord[] {
    return [...this.certificates];
  }

  public getCertificateById(id: string): CertificateRecord | undefined {
    return this.certificates.find(c => c.id === id || c.certificateNumber === id);
  }

  public issueCertificateForApplication(
    applicationId: string,
    standard: string = 'OIC/SMIIC 1:2019 / GSO 2055-1:2015'
  ): { success: boolean; certificate?: CertificateRecord; message: string } {
    const app = this.getApplicationById(applicationId);
    if (!app) return { success: false, message: 'Application not found.' };

    if (app.status !== 'Approved' && app.status !== 'Decision Pending') {
      return {
        success: false,
        message: 'A formal compliance approval decision must be recorded before certificate issuance.'
      };
    }

    const certNum = `HCPT-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().substring(0, 10);
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      applicationId: app.id,
      applicationRef: app.referenceNumber,
      organizationName: app.organizationName,
      facilityName: app.facilityName,
      facilityAddress: app.facilityAddress,
      jurisdiction: `${app.country} & International Export Protocol`,
      governingStandard: standard,
      scopeOfCertification: `Manufacturing and handling of certified products under ${app.category} classification`,
      certifiedProducts: app.products.map(p => p.name),
      issueDate,
      expiryDate,
      status: 'Active',
      cryptographicSignature: `ECDSA-P384:HCPT-SIG:${Math.random().toString(36).substring(2, 6).toUpperCase()}-DIGITAL`,
      sha256Digest: mockHash,
      verificationHash: `V-${certNum.slice(-4)}-REGISTRY`,
      signatories: [
        { role: 'Chairman of Shariah Supervisory Board', name: 'Sheikh M. Noorudeen', designation: 'Senior Islamic Jurist' },
        { role: 'Director General of Certification', name: 'Dr. Tariq Al-Hashimi', designation: 'Technical Assurance Lead' }
      ]
    };

    this.certificates = [newCert, ...this.certificates];
    saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);

    // Update app status to Certificate Issued
    this.updateApplicationStatus(
      applicationId,
      'Certificate Issued',
      `Certificate ${certNum} generated and cryptographically sealed.`,
      'Certification Directorate'
    );

    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    if (appIndex !== -1) {
      this.applications[appIndex].certificateId = newCert.id;
      saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    }

    this.addAuditLog(
      'CERTIFICATE_ISSUED',
      'Certificate',
      certNum,
      `Cryptographic certificate issued for ${app.organizationName} covering ${app.products.length} products.`
    );

    this.notify();
    return { success: true, certificate: newCert, message: `Certificate ${certNum} issued successfully.` };
  }

  // --- ORGANIZATIONS ---
  public getOrganizations(): Organization[] {
    return [...this.organizations];
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find(o => o.id === id);
  }

  // --- RENEWALS & AUDITS ---
  public getRenewals(): RenewalRecord[] {
    return [...this.renewals];
  }

  public getAuditHistory(): AuditHistoryEvent[] {
    return [...this.auditLogs];
  }

  // --- INQUIRIES & MESSAGES ---
  public getInquiries(): StoredInquiry[] {
    return [...this.inquiries];
  }

  public addInquiry(inquiry: Omit<StoredInquiry, 'status' | 'receivedAt'> & { status?: StoredInquiry['status']; receivedAt?: string }): StoredInquiry {
    const newRecord: StoredInquiry = {
      ...inquiry,
      status: inquiry.status || 'NEW',
      receivedAt: inquiry.receivedAt || new Date().toISOString()
    };
    this.inquiries = [newRecord, ...this.inquiries];
    saveStorage(STORAGE_KEYS.INQUIRIES, this.inquiries);
    this.notify();
    return newRecord;
  }

  public updateInquiryStatus(confirmationId: string, status: StoredInquiry['status']): boolean {
    const item = this.inquiries.find(i => i.confirmationId === confirmationId);
    if (item) {
      item.status = status;
      saveStorage(STORAGE_KEYS.INQUIRIES, this.inquiries);
      this.notify();
      return true;
    }
    return false;
  }

  // --- VISITOR LOCATIONS ---
  public getVisitorLocations(): VisitorLocationRecord[] {
    return [...this.visitorLocations];
  }

  public recordVisitorLocation(loc: Omit<VisitorLocationRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): VisitorLocationRecord {
    const newRecord: VisitorLocationRecord = {
      id: loc.id || `loc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      city: loc.city || 'Unknown City',
      region: loc.region || '',
      country: loc.country || 'Unknown Country',
      countryCode: (loc.countryCode || 'UN').toUpperCase(),
      flag: loc.flag || '🌐',
      timestamp: loc.timestamp || new Date().toISOString()
    };
    this.visitorLocations = [newRecord, ...this.visitorLocations].slice(0, 100);
    saveStorage(STORAGE_KEYS.VISITOR_LOCATIONS, this.visitorLocations);
    this.notify();
    return newRecord;
  }

  // --- SUPPORT CONVERSATIONS ---
  public getSupportConversations(filter?: { status?: string; search?: string; unreadOnly?: boolean }): SupportConversation[] {
    let result = [...this.supportConversations];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(c => c.status === filter.status);
    }
    if (filter?.unreadOnly) {
      result = result.filter(c => c.unreadByAdmin);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      result = result.filter(c =>
        (c.customer.name && c.customer.name.toLowerCase().includes(s)) ||
        (c.customer.email && c.customer.email.toLowerCase().includes(s)) ||
        (c.customer.organization && c.customer.organization.toLowerCase().includes(s)) ||
        c.id.toLowerCase().includes(s) ||
        c.messages.some(m => m.text.toLowerCase().includes(s))
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getSupportConversationById(id: string): SupportConversation | null {
    return this.supportConversations.find(c => c.id === id) || null;
  }

  public createSupportConversation(conv: SupportConversation): SupportConversation {
    this.supportConversations = [conv, ...this.supportConversations];
    saveStorage(STORAGE_KEYS.SUPPORT_CONVERSATIONS, this.supportConversations);
    this.notify();
    return conv;
  }

  public updateSupportConversation(id: string, updates: Partial<SupportConversation>): SupportConversation | null {
    const idx = this.supportConversations.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.supportConversations[idx] = {
      ...this.supportConversations[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.SUPPORT_CONVERSATIONS, this.supportConversations);
    this.notify();
    return this.supportConversations[idx];
  }

  public addSupportMessage(conversationId: string, message: SupportMessage): SupportMessage {
    const idx = this.supportConversations.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      this.supportConversations[idx].messages.push(message);
      this.supportConversations[idx].updatedAt = new Date().toISOString();
      saveStorage(STORAGE_KEYS.SUPPORT_CONVERSATIONS, this.supportConversations);
      this.notify();
    }
    return message;
  }

  public addInternalStaffNote(conversationId: string, note: InternalStaffNote): InternalStaffNote {
    const idx = this.supportConversations.findIndex(c => c.id === conversationId);
    if (idx !== -1) {
      if (!this.supportConversations[idx].internalNotes) {
        this.supportConversations[idx].internalNotes = [];
      }
      this.supportConversations[idx].internalNotes!.push(note);
      this.supportConversations[idx].updatedAt = new Date().toISOString();
      saveStorage(STORAGE_KEYS.SUPPORT_CONVERSATIONS, this.supportConversations);
      this.notify();
    }
    return note;
  }

  public getSupportStats(): SupportStatsSummary {
    const list = this.supportConversations;
    return {
      total: list.length,
      awaitingHuman: list.filter(c => c.status === 'awaiting_human').length,
      activeHuman: list.filter(c => c.status === 'human_handling').length,
      aiHandled: list.filter(c => c.handlingMode === 'ai' && c.status !== 'resolved').length,
      resolved: list.filter(c => c.status === 'resolved').length,
      unreadCount: list.filter(c => c.unreadByAdmin).length
    };
  }

  // --- RESET ---
  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ORGANIZATIONS);
    localStorage.removeItem(STORAGE_KEYS.INSPECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.RENEWALS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.VISITOR_LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.SUPPORT_CONVERSATIONS);

    this.applications = [...INITIAL_APPLICATIONS];
    this.organizations = [...INITIAL_ORGANIZATIONS];
    this.inspections = [...INITIAL_INSPECTIONS];
    this.certificates = [...INITIAL_CERTIFICATES];
    this.renewals = [...INITIAL_RENEWALS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.inquiries = [...INITIAL_INQUIRIES];
    this.visitorLocations = [...INITIAL_VISITOR_LOCATIONS];
    this.supportConversations = [...INITIAL_SUPPORT_CONVERSATIONS];

    this.notify();
  }
}

export const demoStore = new DemoStore();
