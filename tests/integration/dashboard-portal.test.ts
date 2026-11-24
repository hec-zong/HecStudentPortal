import { expect, test, describe } from 'vitest';
import { portalService } from '@/services/portalService';
import { useAppStore } from '@/store/use-app-store';

describe('HEC E-Portal - Dashboard & Secondary Portal Modules Suite', () => {
  describe('Returning Student Dashboard Data Contract', () => {
    test('provides complete KPI metrics, applications, and wallet details', async () => {
      const bootstrap = await portalService.getStudentBootstrap('returning');

      // KPI & HEC Wallet assertions
      expect(bootstrap.recentApplications.length).toBeGreaterThanOrEqual(4);
      expect(bootstrap.hecWallet.length).toBeGreaterThanOrEqual(2);
      expect(bootstrap.profileCompletionPercentage).toBe(92);
      expect(bootstrap.student.fullName).toBe('Hamza Tariq Malik');
      expect(bootstrap.student.cnic).toBe('35202-1928374-1');

      // Verify wallet items structure
      const walletFirst = bootstrap.hecWallet[0];
      expect(walletFirst).toBeDefined();
      expect(walletFirst.serialNumber).toMatch(/^HEC-ATT-/);
      expect(walletFirst.verificationHash).toMatch(/^0x/);
      expect(walletFirst.status).toBe('active');
    });

    test('surfaces prioritized task items with actionable links', async () => {
      const bootstrap = await portalService.getStudentBootstrap('returning');
      expect(bootstrap.pendingTasks.length).toBeGreaterThanOrEqual(2);

      const highPriorityTask = bootstrap.pendingTasks.find(
        (t) => t.priority === 'high'
      );
      expect(highPriorityTask).toBeDefined();
      expect(highPriorityTask?.actionType).toBe('resubmit_doc');
      expect(highPriorityTask?.applicationId).toBe('#APP-2024-9981');
      expect(highPriorityTask?.link).toContain('#APP-2024-9981');
    });

    test('recent applications include diverse operational statuses', async () => {
      const bootstrap = await portalService.getStudentBootstrap('returning');
      const statuses = bootstrap.recentApplications.map((a) => a.status);

      expect(statuses).toContain('resubmit_required');
      expect(statuses).toContain('in_progress');
      expect(statuses).toContain('approved');
      expect(statuses).toContain('dispatched');
    });
  });

  describe('Portal Navigation & User Session State', () => {
    test('supports persona simulation and retains active student data', async () => {
      const store = useAppStore.getState();

      await store.loginAsReturning();
      expect(useAppStore.getState().authStatus).toBe('returning');
      expect(useAppStore.getState().studentData?.student.fullName).toBe(
        'Hamza Tariq Malik'
      );

      await store.loginAsFirstTime();
      expect(useAppStore.getState().authStatus).toBe('first_time');
      expect(useAppStore.getState().studentData?.student.fullName).toBe(
        'Ayesha Siddiqua'
      );
    });

    test('modal management toggles seamlessly', () => {
      const store = useAppStore.getState();

      store.setActiveModal('share_proof');
      expect(useAppStore.getState().activeModal).toBe('share_proof');

      store.setActiveModal('track_lookup');
      expect(useAppStore.getState().activeModal).toBe('track_lookup');

      store.setActiveModal(null);
      expect(useAppStore.getState().activeModal).toBeNull();
    });
  });
});
