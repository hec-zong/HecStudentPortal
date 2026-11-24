'use server';

import { z } from 'zod';

/**
 * Example server action pattern.
 * All server actions must validate input at the boundary.
 */
const exampleActionSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function exampleAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const validated = exampleActionSchema.safeParse(raw);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  // Business logic goes here
  return { success: true, data: validated.data };
}
