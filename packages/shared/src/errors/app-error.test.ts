import { describe, expect, it } from 'vitest';
import {
  AccountingError,
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  TenantAccessError,
  ValidationError,
  isAppError,
} from './app-error.js';
import { ErrorCode } from './error-codes.js';

describe('AppError hierarchy', () => {
  it.each([
    [new ValidationError(), ErrorCode.VALIDATION_ERROR, 400],
    [new AuthenticationError(), ErrorCode.AUTHENTICATION_REQUIRED, 401],
    [new AuthorizationError(), ErrorCode.FORBIDDEN, 403],
    [new TenantAccessError(), ErrorCode.TENANT_ACCESS_DENIED, 403],
    [new NotFoundError(), ErrorCode.NOT_FOUND, 404],
    [new ConflictError(), ErrorCode.CONFLICT, 409],
    [new AccountingError('Debits must equal credits.'), ErrorCode.ACCOUNTING_ERROR, 422],
  ])('%s maps to %s / %i', (error, code, status) => {
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(code);
    expect(error.statusCode).toBe(status);
    expect(isAppError(error)).toBe(true);
  });

  it('uses the concrete class name', () => {
    expect(new NotFoundError().name).toBe('NotFoundError');
  });

  it('keeps the cause for server-side logging only', () => {
    const cause = new Error('duplicate key value violates unique constraint "x"');
    const error = new ConflictError('Invoice number already exists.', { cause });
    expect(error.cause).toBe(cause);
    expect(error.message).toBe('Invoice number already exists.');
  });

  it('does not treat plain errors as AppErrors', () => {
    expect(isAppError(new Error('boom'))).toBe(false);
  });
});
