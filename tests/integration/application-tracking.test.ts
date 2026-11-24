import { expect, test, describe } from 'vitest';
import { portalService } from '@/services/portalService';

describe('HEC E-Portal - Application Tracking & Worker Portal Pipeline Suite', () => {
  describe('Application List & Status Filtering Contract', () => {
    test('fetches full list of submitted applications for student', async () => {
      const applications = await portalService.getApplications();

      expect(applications).toBeDefined();
      expect(applications.length).toBeGreaterThanOrEqual(4);

      const appIds = applications.map((a) => a.id);
      expect(appIds).toContain('#APP-2024-9981');
      expect(appIds).toContain('#APP-2024-1022');
      expect(appIds).toContain('#App-001');
      expect(appIds).toContain('#App-002');
    });

    test('accurately classifies applications across statutory status categories', async () => {
      const applications = await portalService.getApplications();

      const inProcess = applications.filter((a) => a.status === 'in_progress');
      expect(inProcess.length).toBeGreaterThan(0);

      const resubmit = applications.filter(
        (a) => a.status === 'resubmit_required'
      );
      expect(resubmit.length).toBeGreaterThan(0);
      expect(resubmit.some((a) => a.id === '#APP-2024-9981')).toBe(true);
      expect(resubmit[0].actionRequired).toBe(true);

      const completed = applications.filter(
        (a) => a.status === 'approved' || a.status === 'dispatched'
      );
      expect(completed.length).toBeGreaterThan(0);
      expect(completed.some((a) => a.id === '#APP-2024-1022')).toBe(true);
    });
  });

  describe('Vertical Stage Timeline & Worker Portal Reviewer Assignment', () => {
    test('retrieves sequential 6-stage verification timeline for #APP-2024-9981', async () => {
      const app = await portalService.getApplicationTrack('#APP-2024-9981');

      expect(app).toBeDefined();
      expect(app.id).toBe('#APP-2024-9981');
      expect(app.totalStages).toBe(6);
      expect(app.stages).toHaveLength(6);

      const stageKeys = app.stages.map((s) => s.stage);
      expect(stageKeys).toEqual([
        'submitted',
        'scrutiny',
        'l1_controller',
        'l2_controller',
        'attestation',
        'completed_dispatched',
      ]);

      // Stage 1 (submitted) is approved
      expect(app.stages[0].status).toBe('approved');

      // Stage 2 (scrutiny) is approved with assigned Scrutiny Officer
      expect(app.stages[1].status).toBe('approved');
      expect(app.stages[1].assignedWorker?.name).toBe('Nasir Mehmood');
      expect(app.stages[1].assignedWorker?.role).toBe(
        'Scrutiny Officer - Desk 04'
      );

      // Stage 3 (l1_controller) has resubmit_required with assigned Assistant Director
      expect(app.stages[2].status).toBe('resubmit_required');
      expect(app.stages[2].assignedWorker?.name).toBe('Dr. Farhan Akhtar');
      expect(app.stages[2].assignedWorker?.role).toBe(
        'Assistant Director Attestation'
      );
    });

    test('retrieves completed application #APP-2024-1022 with minted digital asset and courier info', async () => {
      const app = await portalService.getApplicationTrack('#APP-2024-1022');

      expect(app).toBeDefined();
      expect(app.overallStatus).toBe('dispatched');
      expect(app.currentStage).toBe('completed_dispatched');

      // All 6 stages approved
      for (const stage of app.stages) {
        expect(stage.status).toBe('approved');
      }

      // Courier dispatch details present
      expect(app.dispatchInfo).toBeDefined();
      expect(app.dispatchInfo?.courierName).toBe('Leopard Courier Services');
      expect(app.dispatchInfo?.trackingNumber).toBe('LEO-982138914');
    });
  });

  describe('Stage-Wise Comments & Rejection Trail Interactive Resolution', () => {
    test('contains specific reviewer objection with re-upload permission for #APP-2024-9981', async () => {
      const app = await portalService.getApplicationTrack('#APP-2024-9981');

      expect(app.commentsTrail.length).toBeGreaterThan(0);

      const objection = app.commentsTrail.find(
        (c) => c.stage === 'l1_controller'
      );
      expect(objection).toBeDefined();
      expect(objection?.type).toBe('resubmit_required');
      expect(objection?.isReuploadAllowed).toBe(true);
      expect(objection?.affectedDocumentType).toBe('Transcript');
      expect(objection?.reviewerRole).toBe('Assistant Director Attestation');
      expect(objection?.comment).toContain('Transcript page 2 scan is blurry');
    });

    test('resolves reviewer objection and updates stage back to in_progress via resubmitDocument', async () => {
      const result = await portalService.resubmitDocument({
        applicationId: '#APP-2024-9981',
        rejectionTrailId: 'cm-02',
        documentType: 'Transcript',
        newDocumentUrl:
          'https://storage.hec.gov.pk/mock/bs_transcript_page2_600dpi_flatbed.pdf',
        studentNote: 'Attached 600 DPI flatbed scan of Transcript Page 2.',
      });

      expect(result.success).toBe(true);
      expect(result.application).toBeDefined();
      expect(result.application.overallStatus).toBe('in_progress');

      // Verify the objection is marked resolved
      const resolvedComment = result.application.commentsTrail.find(
        (c) => c.id === 'cm-02'
      );
      expect(resolvedComment?.resolvedAt).toBeDefined();
      expect(resolvedComment?.reuploadedDocUrl).toBe(
        'https://storage.hec.gov.pk/mock/bs_transcript_page2_600dpi_flatbed.pdf'
      );
      expect(resolvedComment?.studentResponseNote).toBe(
        'Attached 600 DPI flatbed scan of Transcript Page 2.'
      );

      // Verify stage 3 (l1_controller) status transitioned back to in_progress
      const l1Stage = result.application.stages.find(
        (s) => s.stage === 'l1_controller'
      );
      expect(l1Stage?.status).toBe('in_progress');
    });
  });
});
