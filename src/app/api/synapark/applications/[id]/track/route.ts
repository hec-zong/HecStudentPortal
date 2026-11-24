import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';
import { resubmitDocumentSchema } from '@/lib/schemas';

/**
 * GET /api/synapark/applications/[id]/track
 * Returns detailed application state, current stage, complete stage pipeline,
 * and the Comments / Rejection Audit Trail with reviewer remarks.
 *
 * POST /api/synapark/applications/[id]/track
 * Allows student to re-upload a document or submit a response note to a rejection trail item.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const decodedId = decodeURIComponent(id);
    const detail = await portalService.getApplicationTrack(decodedId);
    return NextResponse.json(detail);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to track application';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    const validated = resubmitDocumentSchema.safeParse({
      ...body,
      applicationId: decodedId,
    });

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await portalService.resubmitDocument(validated.data);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Document resubmission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
