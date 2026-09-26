import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { ConflictError, ErrorCode, TenantAccessError } from '@gap/shared';
import { normalize } from './all-exceptions.filter.js';

describe('normalize', () => {
  it('passes through AppError code, status and safe message', () => {
    expect(normalize(new TenantAccessError())).toMatchObject({
      status: 403,
      code: ErrorCode.TENANT_ACCESS_DENIED,
    });
  });

  it('never leaks AppError causes', () => {
    const result = normalize(
      new ConflictError('Invoice number already exists.', {
        cause: new Error('duplicate key value violates unique constraint "invoices_number_key"'),
      }),
    );
    expect(JSON.stringify(result)).not.toContain('invoices_number_key');
  });

  it('maps Zod errors to field details', () => {
    const parsed = z.object({ amount: z.string() }).safeParse({ amount: 1 });
    expect(parsed.success).toBe(false);
    const result = normalize(parsed.error);
    expect(result.status).toBe(400);
    expect(result.details?.[0]?.path).toBe('amount');
  });

  it('maps framework exceptions to generic messages', () => {
    expect(normalize(new NotFoundException('Cannot GET /secret-internal-path'))).toEqual({
      status: 404,
      code: ErrorCode.NOT_FOUND,
      message: 'The requested resource was not found.',
    });
    expect(normalize(new ThrottlerException()).code).toBe(ErrorCode.RATE_LIMITED);
    expect(normalize(new ServiceUnavailableException()).code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
  });

  it('maps body-parser style errors by their 4xx status', () => {
    const malformed = Object.assign(new SyntaxError('Unexpected token } in JSON'), { status: 400 });
    expect(normalize(malformed)).toEqual({
      status: 400,
      code: ErrorCode.VALIDATION_ERROR,
      message: 'The request is invalid.',
    });
  });

  it('hides unknown and database errors behind INTERNAL_ERROR', () => {
    const dbError = Object.assign(new Error('relation "users" does not exist'), { code: 'P2010' });
    const result = normalize(dbError);
    expect(result).toEqual({
      status: 500,
      code: ErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred.',
    });
    expect(normalize('a thrown string').status).toBe(500);
    expect(normalize(Object.assign(new Error('x'), { status: 502 })).status).toBe(500);
  });
});
