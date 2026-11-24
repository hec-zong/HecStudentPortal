import type {
  StudentBootstrapData,
  SynaparkFormSchema,
  ApplicationSummary,
  ApplicationDetail,
  PqrUniversity,
  PqrMasterData,
  EChallan,
  CreateChallanPayload,
  SubmitPaidChallanPayload,
  ResubmitDocumentPayload,
  ApplicationSubmitPayload,
  PaymentMode,
} from '@/types/portal';

import synaparkFormFixture from '@/mocks/synapark-attestation-form.json';
import pqrDataFixture from '@/mocks/pqr-data.json';
import studentPortalFixture from '@/mocks/student-portal-data.json';

// Helper to determine whether the service is running in mock mode
export function isMockMode(): boolean {
  if (typeof process !== 'undefined') {
    const mockEnv = process.env.NEXT_PUBLIC_USE_MOCK;
    if (mockEnv === undefined) return true; // Default to mock-first
    return mockEnv === 'true' || mockEnv === '1';
  }
  return true;
}

// Configurable API base URL for live backend handoff
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.hec.gov.pk/v1';
}

// Simulates realistic network round-trip latency
async function simulateLatency(ms = 180): Promise<void> {
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'test') {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// In-memory clone of mock application details to simulate stateful mutations during session
const inMemoryApplications: Record<string, ApplicationDetail> = JSON.parse(
  JSON.stringify(studentPortalFixture.applicationsDetail)
);

/**
 * =============================================================================
 * HEC PORTAL SERVICE - SWAPPABLE SERVICE LAYER
 * =============================================================================
 *
 * In Mock Mode (NEXT_PUBLIC_USE_MOCK=true):
 *   Returns enriched fixtures with realistic latency.
 *
 * In Live Mode (NEXT_PUBLIC_USE_MOCK=false):
 *   Transparently proxies requests to the backend endpoints (Synapark engine,
 *   PQR registry, and 1-Link PSID billing API).
 */
export const portalService = {
  /**
   * Fetch initial student session state (Profile, HEC Wallet, Pending Tasks).
   */
  async getStudentBootstrap(
    userType?: 'returning' | 'first_time'
  ): Promise<StudentBootstrapData> {
    if (isMockMode()) {
      await simulateLatency(150);
      if (userType === 'first_time') {
        return studentPortalFixture.firstTimeUserBootstrap as unknown as StudentBootstrapData;
      }
      return studentPortalFixture.returningUserBootstrap as unknown as StudentBootstrapData;
    }

    const res = await fetch(`${getApiBaseUrl()}/student/bootstrap`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Bootstrap failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch the dynamic Synapark JSON Form Schema for a given service.
   */
  async getSynaparkForm(
    serviceId = 'hec-degree-attestation-v2'
  ): Promise<SynaparkFormSchema> {
    if (isMockMode()) {
      await simulateLatency(120);
      return synaparkFormFixture as unknown as SynaparkFormSchema;
    }

    const res = await fetch(`${getApiBaseUrl()}/synapark/form/${serviceId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Synapark Form failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch all applications submitted by the current authenticated student.
   */
  async getApplications(): Promise<ApplicationSummary[]> {
    if (isMockMode()) {
      await simulateLatency(150);
      return studentPortalFixture.returningUserBootstrap
        .recentApplications as ApplicationSummary[];
    }

    const res = await fetch(`${getApiBaseUrl()}/synapark/applications`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok)
      throw new Error(`Applications fetch failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch granular tracking pipeline & reviewer comment/rejection trail for an application.
   */
  async getApplicationTrack(applicationId: string): Promise<ApplicationDetail> {
    if (isMockMode()) {
      await simulateLatency(160);
      const app =
        inMemoryApplications[applicationId] ||
        inMemoryApplications['#APP-2024-9981'];
      if (!app) {
        throw new Error(`Application ${applicationId} not found`);
      }
      return app;
    }

    const res = await fetch(
      `${getApiBaseUrl()}/synapark/applications/${encodeURIComponent(applicationId)}/track`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) throw new Error(`Tracking failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch accredited universities from Pakistan Qualification Register (PQR).
   */
  async getPqrUniversities(
    query?: string,
    province?: string
  ): Promise<PqrUniversity[]> {
    if (isMockMode()) {
      await simulateLatency(100);
      let list = pqrDataFixture.universities as PqrUniversity[];
      if (province) {
        list = list.filter(
          (u) => u.province.toLowerCase() === province.toLowerCase()
        );
      }
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.shortName.toLowerCase().includes(q) ||
            u.city.toLowerCase().includes(q)
        );
      }
      return list;
    }

    const searchParams = new URLSearchParams();
    if (query) searchParams.set('search', query);
    if (province) searchParams.set('province', province);

    const res = await fetch(
      `${getApiBaseUrl()}/pqr/universities?${searchParams.toString()}`
    );
    if (!res.ok)
      throw new Error(`PQR Universities fetch failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Fetch entire PQR Master Data including universities, degree levels, programs, and boards.
   */
  async getPqrMasterData(): Promise<PqrMasterData> {
    if (isMockMode()) {
      await simulateLatency(120);
      return pqrDataFixture as unknown as PqrMasterData;
    }

    const res = await fetch(`${getApiBaseUrl()}/pqr/master-data`);
    if (!res.ok)
      throw new Error(`PQR Master Data fetch failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Generate or retrieve 1-Link PSID E-Challan based on selected documents.
   */
  async createOrGetChallan(payload: CreateChallanPayload): Promise<EChallan> {
    if (isMockMode()) {
      await simulateLatency(200);

      // Compute total amount based on documents
      let totalAmount = 0;
      const itemsBreakdown = [];

      for (const deg of payload.degrees) {
        for (const doc of deg.selectedDocuments) {
          if (doc.attestOriginal) {
            totalAmount += doc.originalFee;
            itemsBreakdown.push({
              description: `Original ${doc.type} (${deg.degreeLevel})`,
              quantity: 1,
              unitPrice: doc.originalFee,
              total: doc.originalFee,
            });
          }
          if (doc.copiesCount > 0) {
            const copiesCost = doc.copiesCount * doc.copyFee;
            totalAmount += copiesCost;
            itemsBreakdown.push({
              description: `${doc.type} Photocopy (${deg.degreeLevel})`,
              quantity: doc.copiesCount,
              unitPrice: doc.copyFee,
              total: copiesCost,
            });
          }
        }
      }

      if (totalAmount === 0) totalAmount = 1000;

      const random10 = Math.floor(1000000000 + Math.random() * 9000000000);
      const challanNumber = `HEC-CH-2024-${Math.floor(10000 + Math.random() * 90000)}`;
      const psid = `10009${random10}01`; // 17 digits: 1-Link PSID standard

      const now = new Date();
      const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const challan: EChallan = {
        challanNumber,
        psid,
        applicationId: payload.applicationId,
        studentCnic: '35202-1928374-1',
        studentName: 'Hamza Tariq Malik',
        issueDate: now.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        itemsBreakdown,
        totalAmount,
        currency: 'PKR',
        status: 'unpaid',
        paymentMode: '1link_atm_mobile',
      };

      return challan;
    }

    const res = await fetch(`${getApiBaseUrl()}/billing/challan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok)
      throw new Error(`Challan generation failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Submit payment proof (receipt upload and transaction reference).
   */
  async submitPaidChallan(
    payload: SubmitPaidChallanPayload
  ): Promise<{ success: boolean; challan: EChallan }> {
    if (isMockMode()) {
      await simulateLatency(250);
      const mockChallan: EChallan = {
        challanNumber: payload.challanNumber,
        psid: '10009823481239102',
        applicationId: '#APP-2024-9981',
        studentCnic: '35202-1928374-1',
        studentName: 'Hamza Tariq Malik',
        issueDate: '2026-11-20',
        dueDate: '2026-11-27',
        itemsBreakdown: [
          {
            description: 'Attestation Fee (Verified)',
            quantity: 1,
            unitPrice: 2700,
            total: 2700,
          },
        ],
        totalAmount: 2700,
        currency: 'PKR',
        status: 'paid',
        paymentMode: payload.paymentMode,
        paidReceiptUrl: payload.paidReceiptUrl,
        paidAt: payload.paidAt,
        transactionReference: payload.transactionReference,
        bankBranch: payload.bankBranch,
      };

      return { success: true, challan: mockChallan };
    }

    const res = await fetch(
      `${getApiBaseUrl()}/billing/challan/verify-payment`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok)
      throw new Error(`Payment submission failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Student re-upload of a flagged document in response to reviewer comments.
   */
  async resubmitDocument(
    payload: ResubmitDocumentPayload
  ): Promise<{ success: boolean; application: ApplicationDetail }> {
    if (isMockMode()) {
      await simulateLatency(200);
      const app =
        inMemoryApplications[payload.applicationId] ||
        inMemoryApplications['#APP-2024-9981'];

      // Mark the corresponding rejection trail as resolved
      const trail = app.commentsTrail.find(
        (t) => t.id === payload.rejectionTrailId
      );
      if (trail) {
        trail.resolvedAt = new Date().toISOString();
        trail.reuploadedDocUrl = payload.newDocumentUrl;
        trail.studentResponseNote = payload.studentNote;
      }

      // Transition the stage back to in_progress
      const currentStageObj = app.stages.find(
        (s) => s.stage === app.currentStage
      );
      if (currentStageObj) {
        currentStageObj.status = 'in_progress';
      }
      app.overallStatus = 'in_progress';

      return { success: true, application: app };
    }

    const res = await fetch(
      `${getApiBaseUrl()}/synapark/applications/${encodeURIComponent(payload.applicationId)}/resubmit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok)
      throw new Error(`Document resubmission failed: HTTP ${res.status}`);
    return res.json();
  },

  /**
   * Submit complete Synapark Attestation application to worker portal.
   */
  async submitApplication(payload: ApplicationSubmitPayload): Promise<{
    success: boolean;
    applicationId: string;
    trackingId: string;
    challan: EChallan;
  }> {
    if (isMockMode()) {
      await simulateLatency(300);
      const appNum = Math.floor(1000 + Math.random() * 9000);
      const newAppId = `#APP-2026-${appNum}`;
      const trackingId = `HEC-SYN-${appNum}-ISB`;

      const challan = await this.createOrGetChallan({
        applicationId: newAppId,
        degrees: payload.attestationSelection || [],
      });

      if (payload.formData?.transactionReference) {
        challan.status = 'paid';
        challan.transactionReference = String(
          payload.formData.transactionReference
        );
        challan.paidReceiptUrl = String(
          payload.formData.paidReceiptUrl ||
            'https://storage.hec.gov.pk/mock/paid-challan.pdf'
        );
        challan.paidAt = String(
          payload.formData.paidAt || new Date().toISOString()
        );
        challan.paymentMode =
          (payload.formData.paymentMode as PaymentMode) || '1link_atm_mobile';
        challan.bankBranch = payload.formData.bankBranch as string | undefined;
      }

      const now = new Date().toISOString();
      const newApplication: ApplicationDetail = {
        id: newAppId,
        trackingId,
        serviceType: 'Degree & Transcript Attestation',
        submittedAt: now,
        overallStatus: 'in_progress',
        currentStage: 'scrutiny',
        currentStageIndex: 1,
        totalStages: 6,
        stages: [
          {
            stage: 'submitted',
            title: 'Application Received & Logged',
            description:
              'Application submitted via Synapark workflow engine with verified e-challan.',
            status: 'approved',
            startedAt: now,
            completedAt: now,
            assignedWorker: {
              name: 'Synapark Ingestion Bot',
              role: 'Automated Gateway',
              department: 'HEC Digital Services',
            },
          },
          {
            stage: 'scrutiny',
            title: 'Preliminary Scrutiny & NADRA Check',
            description:
              'Document validation, CNIC biometrics check, and PQR qualification verification.',
            status: 'in_progress',
            startedAt: now,
            assignedWorker: {
              name: 'Muhammad Asim',
              role: 'Scrutiny Officer',
              department: 'Scrutiny Wing',
            },
          },
          {
            stage: 'l1_controller',
            title: 'L1 Controller Review',
            description:
              'Academic qualification integrity check against university PQR gazettes.',
            status: 'pending',
            assignedWorker: {
              name: 'Dr. Farhan Qureshi',
              role: 'Assistant Director (Accreditation)',
              department: 'Degree Verification Division',
            },
          },
          {
            stage: 'l2_controller',
            title: 'L2 Controller Endorsement',
            description:
              'Final supervisory validation and forensic hologram authorization.',
            status: 'pending',
            assignedWorker: {
              name: 'Saima Nazir',
              role: 'Deputy Director (Attestation)',
              department: 'Attestation Directorate',
            },
          },
          {
            stage: 'attestation',
            title: 'Physical Embossing & QR Affixing',
            description:
              'Embossing physical parchment with HEC high-security hologram and dynamic QR code.',
            status: 'pending',
            assignedWorker: {
              name: 'Attestation Vault Officer',
              role: 'Security Officer',
              department: 'Security Vault',
            },
          },
          {
            stage: 'completed_dispatched',
            title: 'Courier Dispatch / Ready for Collection',
            description:
              'Physical documents handed to designated courier or made ready for collection.',
            status: 'pending',
          },
        ],
        commentsTrail: [],
        selectedDegrees: payload.attestationSelection || [],
        challan,
      };

      // Store in memory so tracking page can immediately locate this application
      inMemoryApplications[newAppId] = newApplication;

      // Also prepend to recent applications in returningUserBootstrap
      const recentList = studentPortalFixture.returningUserBootstrap
        .recentApplications as ApplicationSummary[];
      if (Array.isArray(recentList)) {
        recentList.unshift({
          id: newAppId,
          serviceName: 'Degree & Transcript Attestation',
          submittedAt: now,
          status: 'in_progress',
          statusLabel: 'Under Scrutiny',
          currentStage: 'Preliminary Scrutiny & NADRA Check',
          amountPaid: challan.totalAmount,
          actionRequired: false,
        });
      }

      return {
        success: true,
        applicationId: newAppId,
        trackingId,
        challan,
      };
    }

    const res = await fetch(`${getApiBaseUrl()}/synapark/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok)
      throw new Error(`Application submission failed: HTTP ${res.status}`);
    return res.json();
  },
};
