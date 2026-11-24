import { NextRequest, NextResponse } from 'next/server';
import { portalService } from '@/services/portalService';

/**
 * GET /api/student/bootstrap
 * Returns the student session bootstrap data:
 * - isFirstTimeUser flag
 * - student profile
 * - HEC wallet / attested credentials
 * - urgent pending tasks
 * - recent application list
 *
 * Query params:
 * - ?userType=first_time | returning (defaults to returning)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userTypeParam = searchParams.get('userType');
    const userType =
      userTypeParam === 'first_time' ? 'first_time' : 'returning';

    const data = await portalService.getStudentBootstrap(userType);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to bootstrap student session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
