import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';
import type { ApplicationSubmitPayload } from '@/types/portal';

/**
 * GET /api/synapark/applications
 * Returns a summary list of applications for the authenticated student.
 *
 * POST /api/synapark/applications
 * Submits a new application into the Synapark scrutiny pipeline and generates an E-Challan.
 */
export async function GET() {
  try {
    const applications = await portalService.getApplications();
    return NextResponse.json(applications);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch applications';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ApplicationSubmitPayload;
    if (!body || !body.serviceId) {
      return NextResponse.json(
        { error: 'Invalid payload: serviceId is required' },
        { status: 400 }
      );
    }

    const result = await portalService.submitApplication(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Application submission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
