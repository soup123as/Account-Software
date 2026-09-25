import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ValidationError } from '@gap/shared';
import { paginationQuerySchema } from '@gap/validation';
import { ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  it('returns parsed, transformed data', () => {
    expect(new ZodValidationPipe(paginationQuerySchema).transform({ limit: '10' })).toEqual({
      limit: 10,
    });
  });

  it('throws ValidationError with field details', () => {
    const pipe = new ZodValidationPipe(z.object({ name: z.string().min(1) }));
    try {
      pipe.transform({ name: '' });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).details[0]?.path).toBe('name');
    }
  });
});
