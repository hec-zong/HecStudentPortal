import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';

/**
 * GET /api/synapark/form/[serviceId]
 * Returns the dynamic Synapark JSON Form Schema for the requested service.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await context.params;
    const formSchema = await portalService.getSynaparkForm(serviceId);
    return NextResponse.json(formSchema);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch Synapark form schema';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
