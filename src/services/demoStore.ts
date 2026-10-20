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
  INITIAL_APPLICATIONS,
  INITIAL_ORGANIZATIONS,
  INITIAL_INSPECTIONS,
  INITIAL_CERTIFICATES,
  INITIAL_RENEWALS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  APPLICATIONS: 'hcpt_demo_applications_v1',
  ORGANIZATIONS: 'hcpt_demo_organizations_v1',
  INSPECTIONS: 'hcpt_demo_inspections_v1',
  CERTIFICATES: 'hcpt_demo_certificates_v1',
  RENEWALS: 'hcpt_demo_renewals_v1',
  AUDIT_LOGS: 'hcpt_demo_audit_logs_v1'
};

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
  private listeners: (() => void)[] = [];

  constructor() {
    this.applications = loadStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.organizations = loadStorage(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    this.inspections = loadStorage(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
    this.certificates = loadStorage(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    this.renewals = loadStorage(STORAGE_KEYS.RENEWALS, INITIAL_RENEWALS);
    this.auditLogs = loadStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
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

  private addAuditLog(
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

  // --- RESET ---
  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ORGANIZATIONS);
    localStorage.removeItem(STORAGE_KEYS.INSPECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.RENEWALS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);

    this.applications = [...INITIAL_APPLICATIONS];
    this.organizations = [...INITIAL_ORGANIZATIONS];
    this.inspections = [...INITIAL_INSPECTIONS];
    this.certificates = [...INITIAL_CERTIFICATES];
    this.renewals = [...INITIAL_RENEWALS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    this.notify();
  }
}

export const demoStore = new DemoStore();
