import { expect, test, describe } from 'vitest';
import { portalService } from '@/services/portalService';
import { pqrService } from '@/services/pqrService';
import { createDynamicSynaparkStepZodSchema } from '@/lib/schemas';
import type { SynaparkStep, AttestedDegreeSelection } from '@/types/portal';

describe('HEC E-Portal - Dynamic Form Wizard & PQR Engine Suite', () => {
  describe('Synapark Dynamic JSON Schema Engine', () => {
    test('fetches full 5-step Synapark form definition for degree attestation', async () => {
      const form = await portalService.getSynaparkForm(
        'hec-degree-attestation-v2'
      );

      expect(form).toBeDefined();
      expect(form.serviceId).toBe('hec-degree-attestation-v2');
      expect(form.steps).toHaveLength(5);

      const stepTitles = form.steps.map((s) => s.shortTitle);
      expect(stepTitles).toEqual([
        'Personal Info',
        'Academic Records',
        'Document Selection',
        'E-Challan',
        'Payment Proof',
      ]);
    });

    test('dynamically compiles Step 1 JSON definition into strict Zod schema', async () => {
      const form = await portalService.getSynaparkForm(
        'hec-degree-attestation-v2'
      );
      const step1 = form.steps[0] as SynaparkStep;

      expect(step1).toBeDefined();
      const zodSchema = createDynamicSynaparkStepZodSchema(step1);

      // Invalid: missing required fields
      const emptyResult = zodSchema.safeParse({});
      expect(emptyResult.success).toBe(false);

      // Invalid: malformed CNIC (without dashes or wrong digits)
      const invalidCnicResult = zodSchema.safeParse({
        fullName: 'Muhammad Usman',
        fatherOrHusbandName: 'Tariq Mehmood',
        cnic: '3520212345671', // missing dashes
        dateOfBirth: '1998-05-12',
        gender: 'male',
        maritalStatus: 'single',
        email: 'usman@example.com',
        mobileNumber: '+92-300-1234567',
        addressLine1: 'Street 4, Sector G-10/2',
        city: 'Islamabad',
        cnicFrontUrl: 'https://storage.hec.gov.pk/test-front.png',
        cnicBackUrl: 'https://storage.hec.gov.pk/test-back.png',
      });
      expect(invalidCnicResult.success).toBe(false);

      // Valid Step 1 data
      const validResult = zodSchema.safeParse({
        fullName: 'Muhammad Usman',
        fatherOrHusbandName: 'Tariq Mehmood',
        cnic: '35202-1234567-1',
        dateOfBirth: '1998-05-12',
        gender: 'male',
        maritalStatus: 'single',
        email: 'usman@example.com',
        mobileNumber: '+92-300-1234567',
        addressLine1: 'Street 4, Sector G-10/2',
        city: 'Islamabad',
        cnicFrontUrl: 'https://storage.hec.gov.pk/test-front.png',
        cnicBackUrl: 'https://storage.hec.gov.pk/test-back.png',
      });
      expect(validResult.success).toBe(true);
    });
  });

  describe('PQR (Pakistan Qualification Register) Cascading Lookups', () => {
    test('retrieves accredited universities with institutional codes', async () => {
      const universities = await pqrService.getUniversities();
      expect(universities.length).toBeGreaterThan(0);

      const nust = universities.find((u) => u.code === 'NUST-ISB');
      expect(nust).toBeDefined();
      expect(nust?.province).toBe('Federal');
      expect(nust?.sector).toBe('public');
      expect(nust?.isAccredited).toBe(true);
    });

    test('retrieves 6 canonical academic qualification tiers', async () => {
      const levels = await pqrService.getDegreeLevels();
      expect(levels).toHaveLength(6);

      const levelTitles = levels.map((l) => l.title);
      expect(levelTitles).toContain(
        'Bachelor Degree (4-Year BS / BSc Hons / BE)'
      );
      expect(levelTitles).toContain(
        'Master Degree (MS / MPhil / 2-Year Post-16)'
      );
      expect(levelTitles).toContain('Doctor of Philosophy (PhD)');
    });

    test('cascades accredited degree programs for a specific university', async () => {
      const programs = await pqrService.getPrograms('uni-pu-01');
      expect(programs.length).toBeGreaterThan(0);

      const seProgram = programs.find((p) =>
        p.programName.includes('Software Engineering')
      );
      expect(seProgram).toBeDefined();
      expect(seProgram?.status).toBe('accredited');
      expect(seProgram?.programDurationYears).toBe(4);
    });

    test('retrieves regional examination boards by type and province', async () => {
      const punjabBoards = await pqrService.getBoards('Punjab');
      expect(punjabBoards.length).toBeGreaterThan(0);
      expect(punjabBoards.some((b) => b.code === 'BISE-LHR')).toBe(true);
      expect(punjabBoards.some((b) => b.code === 'BISE-RWP')).toBe(true);

      const biseBoards = await pqrService.getBoards(undefined, 'BISE');
      expect(biseBoards.length).toBeGreaterThan(0);
      expect(biseBoards.some((b) => b.code === 'FBISE-ISB')).toBe(true);
    });
  });

  describe('Statutory Attestation & Billing Engine (Step 3 & Step 4)', () => {
    test('computes statutory fees accurately for documents and delivery', () => {
      const calculateTotalFee = (params: {
        attestOriginalDegree: boolean;
        degreeCopies: number;
        attestOriginalTranscript: boolean;
        transcriptCopies: number;
        deliveryMode: 'courier' | 'walkin';
      }) => {
        const originalDegreeFee = params.attestOriginalDegree ? 1000 : 0;
        const degreeCopiesFee = params.degreeCopies * 700;
        const originalTranscriptFee = params.attestOriginalTranscript
          ? 1000
          : 0;
        const transcriptCopiesFee = params.transcriptCopies * 700;
        const courierFee = params.deliveryMode === 'courier' ? 300 : 0;

        return {
          originalDegreeFee,
          degreeCopiesFee,
          originalTranscriptFee,
          transcriptCopiesFee,
          courierFee,
          totalAmount:
            originalDegreeFee +
            degreeCopiesFee +
            originalTranscriptFee +
            transcriptCopiesFee +
            courierFee,
        };
      };

      // Scenario A: 1 original degree + 2 copies + 1 original transcript + 1 copy via courier
      const scenarioA = calculateTotalFee({
        attestOriginalDegree: true,
        degreeCopies: 2,
        attestOriginalTranscript: true,
        transcriptCopies: 1,
        deliveryMode: 'courier',
      });

      // 1000 (orig deg) + 1400 (2 deg copies) + 1000 (orig trans) + 700 (1 trans copy) + 300 (courier) = 4400
      expect(scenarioA.totalAmount).toBe(4400);

      // Scenario B: 1 original degree only, walk-in pickup
      const scenarioB = calculateTotalFee({
        attestOriginalDegree: true,
        degreeCopies: 0,
        attestOriginalTranscript: false,
        transcriptCopies: 0,
        deliveryMode: 'walkin',
      });
      expect(scenarioB.totalAmount).toBe(1000);
      expect(scenarioB.courierFee).toBe(0);
    });

    test('generates itemized 1-Link PSID e-challan voucher (Step 4)', async () => {
      const sampleDegrees: AttestedDegreeSelection[] = [
        {
          academicRecordId: 'deg-01',
          degreeLevel: 'Bachelor Degree (4-Year BS)',
          programTitle: 'BS Software Engineering',
          universityOrBoard: 'NUST Islamabad',
          passingYear: 2024,
          rollNumber: 'NUST-2020-SE-041',
          registrationNumber: '00000291024',
          selectedDocuments: [
            {
              type: 'Degree',
              attestOriginal: true,
              copiesCount: 2,
              originalFee: 1000,
              copyFee: 700,
              subtotal: 2400,
            },
            {
              type: 'Transcript',
              attestOriginal: true,
              copiesCount: 0,
              originalFee: 1000,
              copyFee: 0,
              subtotal: 1000,
            },
          ],
          itemTotal: 3400,
        },
      ];

      const challan = await portalService.createOrGetChallan({
        applicationId: '#APP-2026-TEST',
        degrees: sampleDegrees,
      });

      expect(challan).toBeDefined();
      expect(challan.applicationId).toBe('#APP-2026-TEST');
      expect(challan.status).toBe('unpaid');
      expect(challan.psid).toHaveLength(17);
      expect(challan.psid.startsWith('10009')).toBe(true);
      expect(challan.challanNumber.startsWith('HEC-CH-2024-')).toBe(true);
      expect(challan.totalAmount).toBe(3400);
      expect(challan.itemsBreakdown.length).toBeGreaterThan(0);
    });
  });

  describe('Paid Challan Submission & Worker Portal Handoff (Step 5)', () => {
    test('submits application, creates record, and initializes worker scrutiny pipeline', async () => {
      const sampleDegrees: AttestedDegreeSelection[] = [
        {
          academicRecordId: 'deg-01',
          degreeLevel: 'Bachelor Degree (4-Year BS)',
          programTitle: 'BS Software Engineering',
          universityOrBoard: 'NUST Islamabad',
          passingYear: 2024,
          rollNumber: 'NUST-2020-SE-041',
          registrationNumber: '00000291024',
          selectedDocuments: [
            {
              type: 'Degree',
              attestOriginal: true,
              copiesCount: 1,
              originalFee: 1000,
              copyFee: 700,
              subtotal: 1700,
            },
          ],
          itemTotal: 1700,
        },
      ];

      const submitPayload = {
        serviceId: 'hec-degree-attestation-v2',
        formData: {
          fullName: 'Ayesha Siddiqua',
          cnic: '37405-0918273-3',
          paymentMode: '1link_atm_mobile' as const,
          transactionReference: 'FT240989123891',
          paidAt: '2026-11-24',
          paidReceiptUrl:
            'https://storage.hec.gov.pk/mock/paid-challan-ayesha.pdf',
          declarationAccepted: true,
        },
        attestationSelection: sampleDegrees,
      };

      const result = await portalService.submitApplication(submitPayload);

      expect(result.success).toBe(true);
      expect(result.applicationId).toBeDefined();
      expect(result.applicationId.startsWith('#APP-2026-')).toBe(true);
      expect(result.trackingId.startsWith('HEC-SYN-')).toBe(true);
      expect(result.challan.status).toBe('paid');
      expect(result.challan.transactionReference).toBe('FT240989123891');

      // Verify the application was stored in memory and worker scrutiny pipeline is initialized
      const trackedApp = await portalService.getApplicationTrack(
        result.applicationId
      );

      expect(trackedApp).toBeDefined();
      expect(trackedApp.id).toBe(result.applicationId);
      expect(trackedApp.overallStatus).toBe('in_progress');
      expect(trackedApp.currentStage).toBe('scrutiny');
      expect(trackedApp.currentStageIndex).toBe(1);
      expect(trackedApp.totalStages).toBe(6);

      // Verify pipeline stage 0 is approved (submitted) and stage 1 is in_progress (scrutiny)
      expect(trackedApp.stages[0].stage).toBe('submitted');
      expect(trackedApp.stages[0].status).toBe('approved');

      expect(trackedApp.stages[1].stage).toBe('scrutiny');
      expect(trackedApp.stages[1].status).toBe('in_progress');
      expect(trackedApp.stages[1].assignedWorker?.role).toBe(
        'Scrutiny Officer'
      );

      // Verify stage 2 is pending (L1 controller)
      expect(trackedApp.stages[2].stage).toBe('l1_controller');
      expect(trackedApp.stages[2].status).toBe('pending');
    });
  });

  describe('Client Demo Showcase & 5-Step Progression Contract', () => {
    test('validates complete pre-populated demo form values across all 5 steps', async () => {
      const form = await portalService.getSynaparkForm(
        'hec-degree-attestation-v2'
      );
      const step1 = form.steps[0] as SynaparkStep;

      // Import default demo values
      const { DEFAULT_DEMO_FORM_VALUES } =
        await import('@/components/dynamic-form/DynamicFormWizard');

      expect(DEFAULT_DEMO_FORM_VALUES).toBeDefined();

      // 1. Step 1 validation passes with pre-populated demo data
      const step1Zod = createDynamicSynaparkStepZodSchema(step1);
      const step1Result = step1Zod.safeParse(DEFAULT_DEMO_FORM_VALUES);
      expect(step1Result.success).toBe(true);

      // 2. Step 2 has 3 verified academic records
      const academicRecords =
        DEFAULT_DEMO_FORM_VALUES.academicRecords as unknown[];
      expect(Array.isArray(academicRecords)).toBe(true);
      expect(academicRecords.length).toBe(3);

      // 3. Step 3 has attestation selection with fees calculated
      const selections =
        DEFAULT_DEMO_FORM_VALUES.attestationSelection as AttestedDegreeSelection[];
      expect(Array.isArray(selections)).toBe(true);
      expect(selections.length).toBeGreaterThan(0);
      expect(DEFAULT_DEMO_FORM_VALUES.totalAmount).toBe(3700);

      // 4. Step 4 has PSID and challan voucher details
      expect(DEFAULT_DEMO_FORM_VALUES.psid).toBe('10009823481239102');
      expect(DEFAULT_DEMO_FORM_VALUES.challanNumber).toBe('HEC-CH-2024-88491');

      // 5. Step 5 has payment reference and declaration accepted
      expect(DEFAULT_DEMO_FORM_VALUES.transactionReference).toBe(
        'FT240989123891'
      );
      expect(DEFAULT_DEMO_FORM_VALUES.declarationAccepted).toBe(true);
    });
  });
});
