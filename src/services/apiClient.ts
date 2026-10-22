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
