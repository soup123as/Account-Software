import { ErrorCode } from './error-codes.js';

export interface ErrorDetail {
  /** Dot-separated path to the offending field, e.g. `lines.0.amount`. */
  readonly path?: string;
  readonly message: string;
}

export interface AppErrorOptions {
  readonly details?: readonly ErrorDetail[];
  readonly cause?: unknown;
}

/**
 * Base class for every expected (domain or request) error.
 *
 * `message` is always safe to show to the caller. Anything sensitive belongs
 * in `cause`, which is logged server-side but never serialized to clients.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details: readonly ErrorDetail[];

  constructor(code: ErrorCode, message: string, statusCode: number, options: AppErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = new.target.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = options.details ?? [];
  }
}

export class ValidationError extends AppError {
  constructor(message = 'The request is invalid.', options?: AppErrorOptions) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, options);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication is required.', options?: AppErrorOptions) {
    super(ErrorCode.AUTHENTICATION_REQUIRED, message, 401, options);
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message = 'You do not have permission to perform this action.',
    options?: AppErrorOptions,
  ) {
    super(ErrorCode.FORBIDDEN, message, 403, options);
  }
}

/**
 * Raised when a caller references an organization they are not an active
 * member of. Returned as 404-equivalent semantics are deliberately NOT used so
 * that audit trails can distinguish tenant probing from missing records.
 */
export class TenantAccessError extends AppError {
  constructor(message = 'You do not have access to this organization.', options?: AppErrorOptions) {
    super(ErrorCode.TENANT_ACCESS_DENIED, message, 403, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.', options?: AppErrorOptions) {
    super(ErrorCode.NOT_FOUND, message, 404, options);
  }
}

export class ConflictError extends AppError {
  constructor(
    message = 'The request conflicts with the current state.',
    options?: AppErrorOptions,
  ) {
    super(ErrorCode.CONFLICT, message, 409, options);
  }
}

export class AccountingError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(ErrorCode.ACCOUNTING_ERROR, message, 422, options);
  }
}

export class TaxRuleError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(ErrorCode.TAX_RULE_ERROR, message, 422, options);
  }
}

export class DocumentError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(ErrorCode.DOCUMENT_ERROR, message, 422, options);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, options?: AppErrorOptions) {
    super(ErrorCode.PAYMENT_ERROR, message, 422, options);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'The service is temporarily unavailable.', options?: AppErrorOptions) {
    super(ErrorCode.SERVICE_UNAVAILABLE, message, 503, options);
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}
