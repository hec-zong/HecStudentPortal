import { expect, test } from 'vitest';
import { GET } from '@/app/api/health/route';

test('health API returns ok', async () => {
  const response = await GET();
  const data = await response.json();
  expect(data.status).toBe('ok');
  expect(data.timestamp).toBeDefined();
});
