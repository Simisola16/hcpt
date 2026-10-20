import { demoStore } from './demoStore';
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

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
    this.checkBackendHealth();
  }

  private async checkBackendHealth(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isOnlineBackendAvailable = true;
      }
    } catch {
      this.isOnlineBackendAvailable = false;
    }
  }

  public getMode(): 'API' | 'LOCAL_DEMO_STORE' {
    return this.isOnlineBackendAvailable ? 'API' : 'LOCAL_DEMO_STORE';
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
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/applications/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, reason })
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.warn('API error, falling back to local demo store', err);
      }
    }
    return demoStore.updateApplicationStatus(id, status, reason);
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
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
    return demoStore.getOrganizations();
  }

  public async getInspections(): Promise<InspectionRecord[]> {
    return demoStore.getInspections();
  }

  public async getCertificates(): Promise<CertificateRecord[]> {
    return demoStore.getCertificates();
  }

  public async getRenewals(): Promise<RenewalRecord[]> {
    return demoStore.getRenewals();
  }

  public async getAuditHistory(): Promise<AuditHistoryEvent[]> {
    return demoStore.getAuditHistory();
  }

  public async submitContactInquiry(inquiry: ContactInquiry): Promise<{ success: boolean; message: string; confirmationId: string }> {
    if (this.isOnlineBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error, falling back to local response', err);
      }
    }

    // Realistic simulation with confirmation ID
    const confirmationId = `HCPT-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Store in audit trail
    demoStore['addAuditLog']?.(
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
      message: 'Your inquiry has been logged. An HCPT enterprise systems consultant will review your jurisdictional requirements.'
    };
  }
}

export const apiClient = new ApiClient();
