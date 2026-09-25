/**
 * The error hierarchy is framework-agnostic and lives in @gap/shared so the
 * worker and domain packages throw the same types. The API maps them to HTTP
 * responses in AllExceptionsFilter.
 */
export {
  AccountingError,
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DocumentError,
  ErrorCode,
  NotFoundError,
  PaymentError,
  ServiceUnavailableError,
  TaxRuleError,
  TenantAccessError,
  ValidationError,
} from '@gap/shared';
