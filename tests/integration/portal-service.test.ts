import { expect, test, describe } from 'vitest';
import { portalService } from '@/services/portalService';
import { createDynamicSynaparkStepZodSchema, cnicSchema } from '@/lib/schemas';
import { GET as getBootstrap } from '@/app/api/student/bootstrap/route';
import { GET as getPqrUniversities } from '@/app/api/pqr/universities/route';
import { GET as getApplications } from '@/app/api/synapark/applications/route';
import { NextRequest } from 'next/server';

describe('HEC Student Portal - Service & Contracts Suite', () => {
  test('bootstraps returning student session with applications and wallet', async () => {
    const bootstrap = await portalService.getStudentBootstrap('returning');
    expect(bootstrap.isFirstTimeUser).toBe(false);
    expect(bootstrap.hasSubmittedApplication).toBe(true);
    expect(bootstrap.student.cnic).toBe('35202-1928374-1');
    expect(bootstrap.hecWallet.length).toBeGreaterThan(0);
    expect(bootstrap.pendingTasks.length).toBeGreaterThan(0);
    expect(bootstrap.recentApplications.length).toBe(4);
  });

  test('bootstraps first-time student with blank applications and verify-profile task', async () => {
    const bootstrap = await portalService.getStudentBootstrap('first_time');
    expect(bootstrap.isFirstTimeUser).toBe(true);
    expect(bootstrap.hasSubmittedApplication).toBe(false);
    expect(bootstrap.recentApplications.length).toBe(0);
    expect(bootstrap.pendingTasks[0].actionType).toBe('verify_profile');
  });

  test('retrieves synapark form schema with 5 steps', async () => {
    const form = await portalService.getSynaparkForm();
    expect(form.serviceId).toBe('hec-degree-attestation-v2');
    expect(form.steps.length).toBe(5);
    expect(form.steps[0].id).toBe('step-personal-info');
    expect(form.steps[1].id).toBe('step-academic-history');
    expect(form.steps[2].id).toBe('step-attestation-selection');
    expect(form.steps[3].id).toBe('step-echallan');
    expect(form.steps[4].id).toBe('step-paid-submission');
  });

  test('dynamically compiles Synapark step into working Zod validator', async () => {
    const form = await portalService.getSynaparkForm();
    const step1 = form.steps[0];
    const zodValidator = createDynamicSynaparkStepZodSchema(step1);

    // Valid payload
    const validData = {
      cnic: '35202-1234567-1',
      fullName: 'Muhammad Ali',
      fatherOrHusbandName: 'Tariq Ali',
      dateOfBirth: '2000-01-01',
      gender: 'male',
      cnicFrontUrl: 'https://example.com/front.png',
      cnicBackUrl: 'https://example.com/back.png',
      hasSpecialNeeds: false,
    };
    const parsed = zodValidator.safeParse(validData);
    expect(parsed.success).toBe(true);

    // Invalid CNIC payload
    const invalidData = {
      ...validData,
      cnic: 'invalid-cnic-format',
    };
    const failedParse = zodValidator.safeParse(invalidData);
    expect(failedParse.success).toBe(false);
  });

  test('validates CNIC format strictly', () => {
    expect(cnicSchema.safeParse('35202-1928374-1').success).toBe(true);
    expect(cnicSchema.safeParse('3520219283741').success).toBe(false);
    expect(cnicSchema.safeParse('abcde-1234567-1').success).toBe(false);
  });

  test('fetches PQR universities with text filtering', async () => {
    const nust = await portalService.getPqrUniversities('nust');
    expect(nust.length).toBe(1);
    expect(nust[0].shortName).toBe('NUST');
    expect(nust[0].isAccredited).toBe(true);

    const punjab = await portalService.getPqrUniversities(undefined, 'Punjab');
    expect(punjab.length).toBeGreaterThan(0);
  });

  test('retrieves detailed tracking stage pipeline and rejection comments trail', async () => {
    const track = await portalService.getApplicationTrack('#APP-2024-9981');
    expect(track.id).toBe('#APP-2024-9981');
    expect(track.overallStatus).toBe('resubmit_required');
    expect(track.currentStage).toBe('l1_controller');
    expect(track.stages.length).toBe(6);

    // Rejection trail check
    expect(track.commentsTrail.length).toBeGreaterThan(0);
    const rejectionItem = track.commentsTrail.find(
      (c) => c.type === 'resubmit_required'
    );
    expect(rejectionItem).toBeDefined();
    expect(rejectionItem?.isReuploadAllowed).toBe(true);
    expect(rejectionItem?.affectedDocumentType).toBe('Transcript');
  });

  test('computes fee and generates 1-Link PSID E-Challan', async () => {
    const challan = await portalService.createOrGetChallan({
      applicationId: '#APP-TEST-001',
      degrees: [
        {
          academicRecordId: 'rec-1',
          degreeLevel: 'BS Computer Science',
          programTitle: 'BS CS',
          universityOrBoard: 'NUST',
          passingYear: 2023,
          rollNumber: '19-01',
          registrationNumber: 'REG-01',
          selectedDocuments: [
            {
              type: 'Degree',
              attestOriginal: true,
              copiesCount: 2,
              originalFee: 1000,
              copyFee: 700,
              subtotal: 2400,
            },
          ],
          itemTotal: 2400,
        },
      ],
    });

    expect(challan.psid).toBeDefined();
    expect(challan.psid.length).toBeGreaterThanOrEqual(17);
    expect(challan.totalAmount).toBe(2400);
    expect(challan.status).toBe('unpaid');
  });

  test('GET /api/student/bootstrap route handler returns 200 JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/student/bootstrap');
    const res = await getBootstrap(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.student).toBeDefined();
    expect(data.isFirstTimeUser).toBe(false);
  });

  test('GET /api/pqr/universities route handler returns list', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/pqr/universities?search=lums'
    );
    const res = await getPqrUniversities(req);
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(list.length).toBe(1);
    expect(list[0].shortName).toBe('LUMS');
  });

  test('GET /api/synapark/applications returns application list', async () => {
    const res = await getApplications();
    expect(res.status).toBe(200);
    const apps = await res.json();
    expect(apps.length).toBe(4);
  });
});
