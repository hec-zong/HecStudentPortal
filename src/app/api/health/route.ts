import { NextResponse } from 'next/server';

/**
 * Health check endpoint.
 * Verifies the application is running and responding to API requests.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
