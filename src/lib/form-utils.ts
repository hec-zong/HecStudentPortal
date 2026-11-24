import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldValues,
  type Resolver,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { z } from 'zod';

/**
 * Creates a typed form with Zod validation.
 * Use this hook instead of useForm directly to enforce validation boundaries.
 */
export function useZodForm<TFieldValues extends FieldValues = FieldValues>(
  schema: z.ZodType<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema as never) as unknown as Resolver<TFieldValues>,
  });
}
