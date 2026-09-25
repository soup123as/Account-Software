import { Injectable, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';
import { ValidationError } from '@gap/shared';
import { toFieldIssues } from '@gap/validation';

/**
 * Validates and transforms a request body/query/param with a Zod schema.
 * Usage: `@Body(new ZodValidationPipe(createThingSchema)) input: CreateThing`.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new ValidationError('The request is invalid.', {
        details: toFieldIssues(result.error),
      });
    }
    return result.data;
  }
}
