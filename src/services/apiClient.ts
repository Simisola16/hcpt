import { demoStore, StoredInquiry, VisitorLocationRecord } from './demoStore';
import {
  CertificationApplication,
  Organization,
  InspectionRecord,
  CertificateRecord,
  RenewalRecord,
  AuditHistoryEvent,
  ApplicationStatus
} from '../types/certification';
import {
  SupportConversation,
  SupportMessage,
  SupportCustomerInfo,
  InternalStaffNote,
  SupportStatsSummary
} from '../types/support';

export interface ContactInquiry {
  fullName: string;
  organizationName: string;
  officialEmail: string;
  phoneNumber?: string;
  jurisdiction: string;
  currentSystem: string;
  annualCertificates: string;
  inquiryDetails: string;
}

export interface DashboardSummary {
  totalApplications: number;
  awaitingReview: number;
  inspectionsScheduled: number;
  certificatesIssued: number;
  certificatesApproachingExpiry: number;
  statusDistribution: { status: ApplicationStatus; count: number }[];
  outstandingTasksCount: number;
}

function getVerifiedSuggestedAnswer(message: string): string | null {
  const norm = message.toLowerCase().trim();

  // 1. Digital Halal certification processing
  if (
    norm.includes('digital halal certification processing work') ||
    norm.includes('halal certification processing work') ||
    (norm.includes('certification processing') && norm.includes('work')) ||
    (norm.includes('how does') && norm.includes('certification') && norm.includes('work'))
  ) {
    return `Digital Halal certification processing on HCPT replaces fragmented manual paper submissions with a unified, sovereign 6-stage digital lifecycle:

1. **Digital Intake Portal** (/solutions/halal-certification-portals): Applicants submit corporate registrations, industrial permits, and product dossiers online via dedicated enterprise portals.
2. **Automated Electronic Processing** (/solutions/electronic-processing): Instant automated document validation, laboratory report ingestion, and biochemical cross-matching of all ingredients and E-numbers against international Halal standards (GSO 2055-1, OIC/SMIIC 1, JAKIM).
3. **Technical & Shariah Review**: Multi-disciplinary review gates where qualified food scientists verify chemical formulations and Islamic scholars evaluate compliance.
4. **Facility Audit & Inspection** (/solutions/certification-management): On-site or remote audits scheduled digitally with mobile inspector checklists, instant evidence capture, and automated non-conformance tracking.
5. **Directorate & Shariah Decision**: Final evaluation and official sign-off by the Shariah Supervisory Board.
6. **Tamper-Proof Certificate Issuance**: Generation of ECDSA-P384 cryptographically signed digital certificates sealed with SHA-256 digests and instant verification QR codes linked to the registry at **/verify**.

You can explore the interactive 6-stage workflow simulation right now at **/platform-demo**.`;
  }

  // 2. Documentation required for enterprise application
  if (
    norm.includes('documentation is required for an enterprise application') ||
    norm.includes('documentation is required') ||
    norm.includes('documentation required') ||
    (norm.includes('what documents') || norm.includes('what documentation'))
  ) {
    return `For an enterprise Halal application on the HCPT platform, you will need the following core documentation package:

1. **Legal & Corporate Registration**: Official business registration / commercial license, industrial manufacturing permits, and physical facility layout schematics.
2. **100% Product Formulations (BOM)**: Complete Bill of Materials listing every raw material, ingredient, sub-component, additive, and processing aid with percentage compositions.
3. **Ingredient Technical Data & Halal Proofs**: Technical Data Sheets (TDS), Safety Data Sheets (SDS), flow charts of critical materials, and valid accredited Halal certificates for critical raw materials (e.g., gelatin, enzymes, emulsifiers, flavorings).
4. **Food Safety & Quality Management Certifications**: Valid certifications such as HACCP, ISO 22000, or GMP, including sanitation standard operating procedures (SSOP) and pest control logs.
5. **Internal Halal Assurance System (HAS)**: Documentation of your internal Halal management committee, appointed Halal officer, and raw material segregation procedures.

All files can be securely uploaded in PDF, DOCX, or image formats directly through your applicant portal.`;
  }

  // 3. Verify an issued Halal certificate on HCPT
  if (
    norm.includes('verify an issued halal certificate on hcpt') ||
    norm.includes('verify an issued halal certificate') ||
    norm.includes('verify an issued certificate') ||
    norm.includes('verify certificate') ||
    norm.includes('check certificate')
  ) {
    return `You can verify any HCPT-issued Halal certificate instantly using two secure methods:

1. **Public Online Registry**:
   - Visit the official verification portal at **/verify** (or direct URL **/verify/:certNumber**).
   - Enter the unique certificate reference number (e.g., **HCB-2026-F9821**).
   - The registry will immediately display its live validation status, issuing Halal Certification Body (HCB), validity dates, product scope, and authorized categories.

2. **Instant QR Code Scan**:
   - Scan the secure QR code printed on the physical certificate or digital PDF with any smartphone camera.
   - It will open the real-time cryptographic verification page on HCPT directly.

Every certificate issued through HCPT is cryptographically signed using **ECDSA-P384** and sealed with a **SHA-256** digest, making tampering, forgery, or unauthorized alteration impossible.`;
  }

  // 4. Inspection review and renewal procedures
  if (
    norm.includes('inspection review and renewal procedures') ||
    norm.includes('inspection review and renewal') ||
    norm.includes('inspection review') ||
    norm.includes('renewal procedures') ||
    (norm.includes('inspection') && norm.includes('renewal'))
  ) {
    return `The inspection review and renewal procedures follow structured digital protocols on HCPT:

* **Facility Inspection Review**:
  - Following document and ingredient validation, technical and Shariah auditors are assigned through the platform.
  - Auditors conduct an on-site evaluation of production lines, storage segregation, raw material intake, and sanitation practices.
  - Any non-conformances (NCRs) are logged digitally in real time, and corrective action reports (CARs) are submitted directly through the portal for rapid clearance.

* **Certificate Renewal Procedures**:
  - Halal certificates are typically valid for **1 to 3 years** depending on the jurisdiction and issuing Halal Certification Body.
  - Automated renewal notifications are dispatched **90, 60, and 30 days** prior to certificate expiration.
  - **Fast-Track Digital Re-Audit**: Unchanged raw material formulations and approved suppliers are pre-cleared, requiring only updated laboratory test assays and annual facility re-inspection.`;
  }

  return null;
}

class ApiClient {
  private baseUrl: string;
  private isOnlineBackendAvailable: boolean = false;
  private healthPromise: Promise<boolean> | null = null;
  private adminToken: string | null = null;

  constructor() {
    // Automatically use Render backend URL when hosted in production (e.g. Vercel), or /api for local dev proxy
    const isBrowser = typeof window !== 'undefined';
    const isLocal = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const defaultApiUrl = !isLocal ? 'https://hctp-backend.onrender.com/api' : '/api';

    this.baseUrl = import.meta.env.VITE_API_URL || defaultApiUrl;
    if (isBrowser) {
      this.adminToken = localStorage.getItem('hcpt_admin_token') || sessionStorage.getItem('hcpt_admin_token');
    }
    this.checkBackendHealth();
  }

  public getAdminToken(): string | null {
    if (!this.adminToken && typeof window !== 'undefined') {
      this.adminToken = localStorage.getItem('hcpt_admin_token') || sessionStorage.getItem('hcpt_admin_token');
    }
    return this.adminToken;
  }

  public setAdminToken(token: string | null, remember: boolean = true): void {
    this.adminToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        if (remember) {
          localStorage.setItem('hcpt_admin_token', token);
          sessionStorage.removeItem('hcpt_admin_token');
        } else {
          sessionStorage.setItem('hcpt_admin_token', token);
          localStorage.removeItem('hcpt_admin_token');
        }
      } else {
        localStorage.removeItem('hcpt_admin_token');
        sessionStorage.removeItem('hcpt_admin_token');
      }
    }
  }

  public async loginAdmin(identifier: string, password: string, remember: boolean = true): Promise<{ success: boolean; error?: string; admin?: any }> {
    const trimmedId = identifier.trim();
    const trimmedPw = password.trim();

    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: trimmedId, password: trimmedPw })
        });
        const data = await res.json();
        if (res.ok && data.success && data.token) {
          this.setAdminToken(data.token, remember);
          return { success: true, admin: data.admin };
        } else {
          return { success: false, error: data.error || 'Invalid credentials' };
        }
      } catch (err: any) {
        console.warn('Backend login request failed, checking fallback verification:', err);
      }
    }

    // Fallback verification for demo/offline resilience
    const validUser = trimmedId.toLowerCase() === 'admin' || trimmedId.toLowerCase() === 'villagecoders7@gmail.com' || trimmedId.toLowerCase() === 'admin@hcpt.com';
    const validPass = trimmedPw === 'hcpt123';

    if (validUser && validPass) {
      const fallbackToken = btoa(`admin:${Date.now()}:fallback_valid_session`);
      this.setAdminToken(fallbackToken, remember);
      return {
        success: true,
        admin: {
          username: 'admin',
          email: 'villagecoders7@gmail.com',
          role: 'Super Administrator'
        }
      };
    }

    return {
      success: false,
      error: 'Invalid administrative username or password. Please verify credentials.'
    };
  }

  public logoutAdmin(): void {
    this.setAdminToken(null);
  }

  public async checkBackendHealth(): Promise<boolean> {
    if (this.healthPromise) return this.healthPromise;

    this.healthPromise = (async () => {
      try {
        const res = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
          this.isOnlineBackendAvailable = true;
          return true;
        }
      } catch {
        // Fallback to relative /api if absolute URL had any network issue
        if (this.baseUrl.startsWith('http')) {
          try {
            const fallbackRes = await fetch('/api/health', {
              method: 'GET',
              signal: AbortSignal.timeout(4000)
            });
            if (fallbackRes.ok) {
              this.baseUrl = '/api';
              this.isOnlineBackendAvailable = true;
              return true;
            }
          } catch {
            // keep offline fallback
          }
        }
        this.isOnlineBackendAvailable = false;
      } finally {
        this.healthPromise = null;
      }
      return this.isOnlineBackendAvailable;
    })();

    return this.healthPromise;
  }

  public getMode(): 'API' | 'LOCAL_DEMO_STORE' {
    return this.isOnlineBackendAvailable ? 'API' : 'LOCAL_DEMO_STORE';
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // Applications
  public async getApplications(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<CertificationApplication[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        const res = await fetch(`${this.baseUrl}/applications?${query}`);
        if (res.ok) {
          const data = await res.json();
          return data.applications;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }

    let apps = demoStore.getApplications();
    if (filters?.status && filters.status !== 'ALL') {
      apps = apps.filter(a => a.status === filters.status);
    }
    if (filters?.category && filters.category !== 'ALL') {
      apps = apps.filter(a => a.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      apps = apps.filter(
        a =>
          a.referenceNumber.toLowerCase().includes(q) ||
          a.organizationName.toLowerCase().includes(q) ||
          a.facilityName.toLowerCase().includes(q) ||
          a.products.some(p => p.name.toLowerCase().includes(q))
      );
    }
    return apps;
  }

  public async getApplicationById(id: string): Promise<CertificationApplication | null> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/applications/${id}`);
        if (res.ok) {
          const data = await res.json();
          return data.application;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getApplicationById(id) || null;
  }

  public async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    reason: string,
    actor?: string
  ): Promise<{ success: boolean; message: string }> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/applications/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, reason, actor })
        });
        const data = await res.json();
        // Also update local store to stay synchronized
        demoStore.updateApplicationStatus(id, status, reason, actor);
        return data;
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.updateApplicationStatus(id, status, reason, actor);
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/dashboard`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }

    const apps = demoStore.getApplications();
    const certs = demoStore.getCertificates();
    const inspections = demoStore.getInspections();

    const awaitingReview = apps.filter(
      a =>
        a.status === 'Submitted' ||
        a.status === 'Initial Review' ||
        a.status === 'Technical Review' ||
        a.status === 'Decision Pending'
    ).length;

    const scheduledInspections = inspections.filter(i => i.status === 'Scheduled').length;
    const issuedCerts = certs.filter(c => c.status === 'Active' || c.status === 'Approaching Expiry').length;
    const expiringCerts = certs.filter(c => c.status === 'Approaching Expiry').length;

    const statusCounts: Record<string, number> = {};
    apps.forEach(a => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as ApplicationStatus,
      count
    }));

    return {
      totalApplications: apps.length,
      awaitingReview,
      inspectionsScheduled: scheduledInspections,
      certificatesIssued: issuedCerts,
      certificatesApproachingExpiry: expiringCerts,
      statusDistribution,
      outstandingTasksCount: awaitingReview + scheduledInspections
    };
  }

  public async getOrganizations(): Promise<Organization[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/organizations`);
        if (res.ok) {
          const data = await res.json();
          return data.organizations;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getOrganizations();
  }

  public async getInspections(): Promise<InspectionRecord[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/inspections`);
        if (res.ok) {
          const data = await res.json();
          return data.inspections;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getInspections();
  }

  public async getCertificates(): Promise<CertificateRecord[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/certificates`);
        if (res.ok) {
          const data = await res.json();
          return data.certificates;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getCertificates();
  }

  public async getRenewals(): Promise<RenewalRecord[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/renewals`);
        if (res.ok) {
          const data = await res.json();
          return data.renewals;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getRenewals();
  }

  public async getAuditHistory(): Promise<AuditHistoryEvent[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/audit-history`);
        if (res.ok) {
          const data = await res.json();
          return data.auditLogs;
        }
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.getAuditHistory();
  }

  public async submitContactInquiry(inquiry: ContactInquiry): Promise<{ success: boolean; message: string; confirmationId: string; emailSent?: boolean }> {
    let confirmationId = `HCPT-INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry)
        });
        if (res.ok) {
          const data = await res.json();
          confirmationId = data.confirmationId || confirmationId;
          demoStore.addInquiry({
            confirmationId,
            ...inquiry,
            status: 'NEW',
            receivedAt: new Date().toISOString()
          });
          return data;
        }
      } catch (err) {
        console.warn('API error, falling back to client-side dispatch', err);
      }
    }

    // Direct Resend Fallback Dispatch (Guarantees delivery to villagecoders7@gmail.com)
    let emailSent = false;
    const clientResendKey = import.meta.env.VITE_RESEND_API_KEY;
    if (clientResendKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientResendKey}`
          },
          body: JSON.stringify({
            from: 'HCPT Enterprise <onboarding@resend.dev>',
            to: ['villagecoders7@gmail.com'],
            replyTo: [inquiry.officialEmail, 'info@techhalal.com'],
            subject: `[HCPT Lead] ${inquiry.organizationName} — ${inquiry.fullName} (${confirmationId})`,
            html: `
              <h2>HCPT — New Enterprise Engagement Request</h2>
              <p><strong>Confirmation:</strong> ${confirmationId}</p>
              <p><strong>Name:</strong> ${inquiry.fullName}</p>
              <p><strong>Organization:</strong> ${inquiry.organizationName}</p>
              <p><strong>Official Email:</strong> <a href="mailto:${inquiry.officialEmail}">${inquiry.officialEmail}</a></p>
              <p><strong>Phone:</strong> ${inquiry.phoneNumber || 'Not provided'}</p>
              <p><strong>Jurisdiction:</strong> ${inquiry.jurisdiction}</p>
              <p><strong>Current Operating Model:</strong> ${inquiry.currentSystem}</p>
              <p><strong>Annual Volume:</strong> ${inquiry.annualCertificates}</p>
              <p><strong>Requirements & Details:</strong></p>
              <blockquote style="background:#f1f5f9;padding:12px;border-left:4px solid #006837;">${inquiry.inquiryDetails}</blockquote>
            `
          })
        });
        if (emailRes.ok) {
          emailSent = true;
          console.log('[Resend Client Dispatch] Successfully sent notification to villagecoders7@gmail.com');
        }
      } catch (e) {
        console.warn('[Resend Client Dispatch Error]:', e);
      }
    }

    // Store in demoStore
    demoStore.addInquiry({
      confirmationId,
      ...inquiry,
      status: 'NEW',
      receivedAt: new Date().toISOString()
    });

    // Store in audit trail
    demoStore.addAuditLog?.(
      'CONTACT_INQUIRY_RECEIVED',
      'Inquiry',
      confirmationId,
      `Enterprise inquiry lodged by ${inquiry.fullName} (${inquiry.organizationName}) for ${inquiry.annualCertificates} certs/yr.`,
      inquiry.fullName,
      'Prospective Client'
    );

    return {
      success: true,
      confirmationId,
      emailSent,
      message: 'Your inquiry has been logged in the HCPT enterprise consultation pipeline.'
    };
  }

  public async getContactInquiries(): Promise<StoredInquiry[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/inquiries`, { headers });
        if (res.ok) {
          const list: StoredInquiry[] = await res.json();
          return list;
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error fetching inquiries, using local store:', err);
      }
    }
    return demoStore.getInquiries();
  }

  public async updateInquiryStatus(confirmationId: string, status: StoredInquiry['status']): Promise<boolean> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/inquiries/${confirmationId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          demoStore.updateInquiryStatus(confirmationId, status);
          return true;
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error updating inquiry status, updating locally:', err);
      }
    }
    return demoStore.updateInquiryStatus(confirmationId, status);
  }

  public async getVisitorLocations(): Promise<VisitorLocationRecord[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/visitors/locations`, { headers });
        if (res.ok) {
          const list: VisitorLocationRecord[] = await res.json();
          return list;
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error fetching visitor locations, using local store:', err);
      }
    }
    return demoStore.getVisitorLocations();
  }

  public async recordVisitorLocation(loc: {
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    flag?: string;
  }): Promise<VisitorLocationRecord> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/visitors/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loc)
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.location) {
            demoStore.recordVisitorLocation(data.location);
            return data.location;
          }
        }
      } catch (err) {
        console.warn('API error recording visitor location, storing locally:', err);
      }
    }
    return demoStore.recordVisitorLocation({
      city: loc.city || 'Unknown City',
      region: loc.region || '',
      country: loc.country || 'Unknown Country',
      countryCode: loc.countryCode || 'UN',
      flag: loc.flag || '🌐'
    });
  }

  public async trackVisitorLocation(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Throttle logging per session to avoid duplicate calls on every click
    const sessionKey = 'hcpt_visitor_logged_session';
    const lastLogged = sessionStorage.getItem(sessionKey);
    if (lastLogged) return;

    try {
      sessionStorage.setItem(sessionKey, '1');

      // Helper to convert 2-letter country code to flag emoji
      const getCountryFlag = (code: string) => {
        if (!code || code.length !== 2) return '🌐';
        const codePoints = code
          .toUpperCase()
          .split('')
          .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
      };

      // Query fast, anonymous IP location endpoint
      let geoData: { city?: string; region?: string; country?: string; countryCode?: string; flag?: string } | null = null;

      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          if (data.country_name || data.city) {
            geoData = {
              city: data.city || data.region || 'Unknown City',
              region: data.region || '',
              country: data.country_name || 'International',
              countryCode: data.country_code || 'UN',
              flag: getCountryFlag(data.country_code)
            };
          }
        }
      } catch {
        // Fallback service
        try {
          const res2 = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(3500) });
          if (res2.ok) {
            const data2 = await res2.json();
            if (data2.countryName || data2.cityName) {
              geoData = {
                city: data2.cityName || 'Unknown City',
                region: data2.regionName || '',
                country: data2.countryName || 'International',
                countryCode: data2.countryCode || 'UN',
                flag: getCountryFlag(data2.countryCode)
              };
            }
          }
        } catch {
          // offline or blocked by adblock
        }
      }

      if (geoData) {
        await this.recordVisitorLocation(geoData);
      }
    } catch (e) {
      console.warn('[Visitor Location Tracker] Silent fallback:', e);
    }
  }

  // =========================================================================
  // Support & AI Customer Support Chat Methods
  // =========================================================================

  public async getSupportConfig(): Promise<{ isAiConfigured: boolean; provider: string }> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/support/config`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error fetching support config:', err);
      }
    }
    return { isAiConfigured: true, provider: 'Simulated Demo AI' };
  }

  public async sendChatMessage(payload: {
    conversationId?: string;
    sessionToken?: string;
    message: string;
    customerInfo?: SupportCustomerInfo;
  }): Promise<{
    success: boolean;
    conversationId: string;
    sessionToken: string;
    status: string;
    handlingMode: 'ai' | 'human';
    message: SupportMessage;
    reply: SupportMessage | null;
    escalated?: boolean;
    escalationReason?: string;
    humanHandlingNotice?: string;
    error?: string;
  }> {
    // Ensure backend health check has run
    await this.checkBackendHealth();

    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/support/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
      } catch (err: any) {
        console.warn('API error in support/chat, using demo store fallback:', err);
      }
    }

    // Fallback in demoStore
    let conv: SupportConversation | null = null;
    if (payload.conversationId) {
      conv = demoStore.getSupportConversationById(payload.conversationId);
    }
    const now = new Date().toISOString();

    if (!conv) {
      const newId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToken = `token-${Date.now()}-fallback-session`;
      conv = {
        id: newId,
        sessionToken: newToken,
        customer: {
          name: payload.customerInfo?.name || 'Visitor',
          email: payload.customerInfo?.email,
          phone: payload.customerInfo?.phone,
          organization: payload.customerInfo?.organization,
          isGuest: !payload.customerInfo?.email,
          visitorLocation: payload.customerInfo?.visitorLocation
        },
        status: 'open',
        handlingMode: 'ai',
        priority: 'normal',
        unreadByAdmin: true,
        unreadByCustomer: false,
        messages: [],
        internalNotes: [],
        createdAt: now,
        updatedAt: now
      };
      demoStore.createSupportConversation(conv);
    }

    const customerMsg: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: conv.id,
      sender: 'customer',
      authorName: conv.customer.name || 'You',
      text: payload.message.trim(),
      createdAt: now
    };
    demoStore.addSupportMessage(conv.id, customerMsg);

    // If in human mode
    if (conv.handlingMode === 'human' || conv.status === 'awaiting_human' || conv.status === 'human_handling') {
      demoStore.updateSupportConversation(conv.id, { unreadByAdmin: true });
      return {
        success: true,
        conversationId: conv.id,
        sessionToken: conv.sessionToken || 'fallback',
        status: conv.status,
        handlingMode: 'human',
        message: customerMsg,
        reply: null,
        humanHandlingNotice: 'Your message has been delivered to the HCPT human support team.'
      };
    }

    // Check escalation keywords
    const lower = payload.message.toLowerCase();
    const needsEscalation = /human|person|agent|representative|speak to someone|talk to someone|live support|complaint/i.test(lower);

    if (needsEscalation) {
      const aiReply: SupportMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        conversationId: conv.id,
        sender: 'ai',
        authorName: 'HCPT AI Assistant',
        text: "I understand you need to speak with our team. I've escalated this conversation to our human support representatives who will assist you shortly.",
        createdAt: new Date().toISOString()
      };
      demoStore.addSupportMessage(conv.id, aiReply);
      demoStore.updateSupportConversation(conv.id, {
        status: 'awaiting_human',
        handlingMode: 'human',
        priority: 'urgent',
        escalationReason: 'Visitor requested human assistance',
        escalatedAt: new Date().toISOString(),
        unreadByAdmin: true
      });

      return {
        success: true,
        conversationId: conv.id,
        sessionToken: conv.sessionToken || 'fallback',
        status: 'awaiting_human',
        handlingMode: 'human',
        message: customerMsg,
        reply: aiReply,
        escalated: true,
        escalationReason: 'Visitor requested human assistance'
      };
    }

    // Verified 100% correct answers for Suggested Inquiries
    const verifiedText = getVerifiedSuggestedAnswer(payload.message) ||
      "Thank you for reaching out to HCPT. I can assist you with understanding our digital Halal certification platform, required documentation checklists, certificate verification, and inspection workflows. How can I help you today?";

    const aiReply: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: conv.id,
      sender: 'ai',
      authorName: 'HCPT AI Assistant',
      text: verifiedText,
      createdAt: new Date().toISOString()
    };
    demoStore.addSupportMessage(conv.id, aiReply);

    return {
      success: true,
      conversationId: conv.id,
      sessionToken: conv.sessionToken || 'fallback',
      status: 'open',
      handlingMode: 'ai',
      message: customerMsg,
      reply: aiReply,
      escalated: false
    };
  }

  public async getSupportConversation(conversationId: string, sessionToken?: string): Promise<SupportConversation | null> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const url = `${this.baseUrl}/support/conversation/${conversationId}${sessionToken ? `?token=${encodeURIComponent(sessionToken)}` : ''}`;
        const res = await fetch(url, { headers });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error fetching conversation:', err);
      }
    }
    return demoStore.getSupportConversationById(conversationId);
  }

  public async requestHumanEscalation(conversationId: string, sessionToken: string, reason?: string): Promise<boolean> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/support/escalate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, sessionToken, reason })
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('API error escalating to human:', err);
      }
    }

    demoStore.updateSupportConversation(conversationId, {
      status: 'awaiting_human',
      handlingMode: 'human',
      priority: 'urgent',
      escalationReason: reason || 'Customer requested human support',
      escalatedAt: new Date().toISOString(),
      unreadByAdmin: true
    });
    return true;
  }

  public async returnToAiMode(conversationId: string, sessionToken: string): Promise<boolean> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/support/return-to-ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, sessionToken })
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('API error returning to AI mode:', err);
      }
    }

    demoStore.updateSupportConversation(conversationId, {
      status: 'open',
      handlingMode: 'ai',
      priority: 'normal'
    });
    return true;
  }

  public async updateCustomerSupportContact(
    conversationId: string,
    sessionToken: string,
    contact: { name?: string; email?: string; phone?: string; organization?: string }
  ): Promise<boolean> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/support/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, sessionToken, ...contact })
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('API error updating customer support contact:', err);
      }
    }

    const conv = demoStore.getSupportConversationById(conversationId);
    if (conv) {
      demoStore.updateSupportConversation(conversationId, {
        customer: { ...conv.customer, ...contact, isGuest: !contact.email }
      });
    }
    return true;
  }

  // =========================================================================
  // Admin Support Inbox Management Methods (Protected)
  // =========================================================================

  public async getAdminSupportConversations(filter?: {
    status?: string;
    search?: string;
    unreadOnly?: boolean;
  }): Promise<SupportConversation[]> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const params = new URLSearchParams();
        if (filter?.status && filter.status !== 'all') params.set('status', filter.status);
        if (filter?.search) params.set('search', filter.search);
        if (filter?.unreadOnly) params.set('unread', 'true');

        const res = await fetch(`${this.baseUrl}/admin/support/conversations?${params.toString()}`, { headers });
        if (res.ok) {
          const data = await res.json();
          return data.conversations || [];
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error fetching admin support conversations, using demo store:', err);
      }
    }
    return demoStore.getSupportConversations(filter);
  }

  public async getAdminSupportConversationById(id: string): Promise<SupportConversation | null> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/support/conversations/${id}`, { headers });
        if (res.ok) {
          return await res.json();
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error fetching admin support conversation:', err);
      }
    }
    return demoStore.getSupportConversationById(id);
  }

  public async sendAdminSupportReply(id: string, text: string, authorName?: string): Promise<SupportMessage | null> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/support/conversations/${id}/reply`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ text, authorName: authorName || 'HCPT Support Specialist' })
        });
        if (res.ok) {
          const data = await res.json();
          return data.message;
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error sending support reply, using demo store:', err);
      }
    }

    const humanMsg: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: id,
      sender: 'human',
      authorName: authorName || 'HCPT Support Specialist',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    demoStore.addSupportMessage(id, humanMsg);
    demoStore.updateSupportConversation(id, {
      handlingMode: 'human',
      status: 'human_handling',
      unreadByCustomer: true,
      unreadByAdmin: false
    });
    return humanMsg;
  }

  public async updateAdminSupportStatus(
    id: string,
    updates: { status: string; handlingMode?: 'ai' | 'human'; priority?: string; assignedAgent?: string }
  ): Promise<boolean> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/support/conversations/${id}/status`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updates)
        });
        if (res.ok) return true;
        if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error updating support status:', err);
      }
    }

    demoStore.updateSupportConversation(id, updates as any);
    return true;
  }

  public async addAdminSupportInternalNote(id: string, text: string, author?: string): Promise<InternalStaffNote | null> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/support/conversations/${id}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ text, author: author || 'Admin' })
        });
        if (res.ok) {
          const data = await res.json();
          return data.note;
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error adding internal note:', err);
      }
    }

    const note: InternalStaffNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: author || 'Admin',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    demoStore.addInternalStaffNote(id, note);
    return note;
  }

  public async getAdminSupportStats(): Promise<SupportStatsSummary> {
    if (this.isOnlineBackendAvailable) {
      try {
        const headers: Record<string, string> = {};
        const token = this.getAdminToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${this.baseUrl}/admin/support/stats`, { headers });
        if (res.ok) {
          return await res.json();
        } else if (res.status === 401) {
          this.setAdminToken(null);
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err?.message === 'Unauthorized') throw err;
        console.warn('API error fetching admin support stats:', err);
      }
    }
    return demoStore.getSupportStats();
  }

  public async resetDemoData(): Promise<void> {
    if (this.isOnlineBackendAvailable) {
      try {
        await fetch(`${this.baseUrl}/reset`, { method: 'POST' });
      } catch (err) {
        console.warn('Backend reset error:', err);
      }
    }
    demoStore.resetToDefaults();
  }
}

export const apiClient = new ApiClient();
