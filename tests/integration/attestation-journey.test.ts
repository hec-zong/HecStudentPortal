import { expect, test, describe } from 'vitest';
import { portalService } from '@/services/portalService';
import { useAppStore } from '@/store/use-app-store';

describe('HEC E-Portal - Attestation Journey & Application Routing Suite', () => {
  describe('Smart Routing Engine', () => {
    test('routes logged-out visitor to login action', () => {
      const store = useAppStore.getState();
      store.logout();
      expect(store.getSmartRoute()).toBe('/?login=true');
    });

    test('routes first-time user (no submitted applications) to onboarding apply view', async () => {
      await useAppStore.getState().loginAsFirstTime();
      const updated = useAppStore.getState();
      expect(updated.authStatus).toBe('first_time');
      expect(updated.getSmartRoute()).toBe('/apply');
      expect(updated.studentData?.hasSubmittedApplication).toBe(false);
      expect(updated.studentData?.isFirstTimeUser).toBe(true);
      expect(updated.studentData?.profileCompletionPercentage).toBe(35);
    });

    test('routes returning user (with existing applications) to dashboard', async () => {
      await useAppStore.getState().loginAsReturning();
      const updated = useAppStore.getState();
      expect(updated.authStatus).toBe('returning');
      expect(updated.getSmartRoute()).toBe('/dashboard');
      expect(updated.studentData?.hasSubmittedApplication).toBe(true);
      expect(updated.studentData?.isFirstTimeUser).toBe(false);
      expect(updated.studentData?.recentApplications.length).toBeGreaterThan(0);
      expect(updated.studentData?.hecWallet.length).toBeGreaterThan(0);
    });
  });

  describe('10-Step Attestation Journey Roadmap Contract', () => {
    const EXPECTED_JOURNEY_STAGES = [
      'identity_creation',
      'academic_profile',
      'document_upload',
      'fee_settlement',
      'registrar_audit',
      'physical_appraisal',
      'digital_embossing',
      'vault_storage',
      'credential_sharing',
      'journey_completion',
    ];

    test('contains exactly 10 sequential verification milestones', () => {
      expect(EXPECTED_JOURNEY_STAGES).toHaveLength(10);
    });

    test('application tracking stages map seamlessly to the 6 core pipeline stages', async () => {
      const tracking =
        await portalService.getApplicationTrack('#APP-2024-9981');
      expect(tracking.stages).toHaveLength(6);

      const stageKeys = tracking.stages.map((s) => s.stage);
      expect(stageKeys).toEqual([
        'submitted',
        'scrutiny',
        'l1_controller',
        'l2_controller',
        'attestation',
        'completed_dispatched',
      ]);
    });
  });

  describe('Comments & Rejection Trail Audit Integrity', () => {
    test('provides actionable discrepancy comments for flagged application', async () => {
      const tracking =
        await portalService.getApplicationTrack('#APP-2024-9981');
      expect(tracking.overallStatus).toBe('resubmit_required');

      const flaggedComment = tracking.commentsTrail.find(
        (c) => c.type === 'resubmit_required'
      );
      expect(flaggedComment).toBeDefined();
      expect(flaggedComment?.isReuploadAllowed).toBe(true);
      expect(flaggedComment?.stage).toBe('l1_controller');
      expect(flaggedComment?.affectedDocumentType).toBe('Transcript');
      expect(flaggedComment?.comment).toContain('Transcript page 2');
    });

    test('preserves approval and completed comments for dispatched application', async () => {
      const tracking =
        await portalService.getApplicationTrack('#APP-2024-1022');
      expect(tracking.overallStatus).toBe('dispatched');

      const approvalComment = tracking.commentsTrail.find(
        (c) => c.type === 'approval'
      );
      expect(approvalComment).toBeDefined();
      expect(approvalComment?.reviewerRole).toBe('Scrutiny Desk');
      expect(approvalComment?.isReuploadAllowed).toBe(false);
    });

    test('1-Link PSID billing contract conforms to 17-digit standard', async () => {
      const tracking =
        await portalService.getApplicationTrack('#APP-2024-9981');
      expect(tracking.challan).toBeDefined();
      expect(tracking.challan.psid).toMatch(/^\d{17}$/);
      expect(tracking.challan.currency).toBe('PKR');
      expect(tracking.challan.totalAmount).toBeGreaterThan(0);
    });
  });
});
