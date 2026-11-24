import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';

/**
 * GET /api/pqr/universities
 * Query accredited universities from the Pakistan Qualification Register (PQR).
 *
 * Query params:
 * - ?search=nust
 * - ?province=Punjab | Sindh | Federal | Khyber Pakhtunkhwa | Balochistan
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const province = searchParams.get('province') || undefined;

    const universities = await portalService.getPqrUniversities(
      search,
      province
    );
    return NextResponse.json(universities);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch PQR universities';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
