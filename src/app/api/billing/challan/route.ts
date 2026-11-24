import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';
import { challanPaymentSubmissionSchema } from '@/lib/schemas';
import type { CreateChallanPayload } from '@/types/portal';

/**
 * GET /api/billing/challan
 * Query or retrieve an existing E-Challan by challanNumber or applicationId.
 *
 * POST /api/billing/challan
 * Generate a new E-Challan OR submit paid receipt proof:
 * - If body contains `action: "verify_payment"`, processes paid challan receipt.
 * - Otherwise, calculates and generates a new 1-Link PSID E-Challan.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId =
      searchParams.get('applicationId') ||
      searchParams.get('challanNumber') ||
      '#APP-2024-9981';

    // Retrieve challan for application
    const app = await portalService.getApplicationTrack(applicationId);
    return NextResponse.json(app.challan);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Challan not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'verify_payment') {
      const validated = challanPaymentSubmissionSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json(
          {
            error: 'Invalid payment proof payload',
            details: validated.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      const result = await portalService.submitPaidChallan(validated.data);
      return NextResponse.json(result);
    }

    // Default: generate new challan
    const payload = body as CreateChallanPayload;
    if (!payload.applicationId || !payload.degrees) {
      return NextResponse.json(
        { error: 'Missing applicationId or degrees selection list' },
        { status: 400 }
      );
    }

    const challan = await portalService.createOrGetChallan(payload);
    return NextResponse.json(challan, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Challan operation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
