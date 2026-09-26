/**
 * Stable, machine-readable error codes returned in the API error envelope.
 * Clients may branch on these values, so existing codes must never be renamed.
 */
export const ErrorCode = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  TENANT_ACCESS_DENIED: 'TENANT_ACCESS_DENIED',
  ACCOUNTING_ERROR: 'ACCOUNTING_ERROR',
  TAX_RULE_ERROR: 'TAX_RULE_ERROR',
  DOCUMENT_ERROR: 'DOCUMENT_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
