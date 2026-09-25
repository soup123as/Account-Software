import type { ErrorCode } from '../errors/error-codes.js';
import type { ErrorDetail } from '../errors/app-error.js';

export interface ApiSuccess<T> {
  readonly success: true;
  readonly data: T;
}

export interface ApiErrorBody {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: readonly ErrorDetail[];
  readonly requestId?: string;
}

export interface ApiFailure {
  readonly success: false;
  readonly error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function isApiFailure(value: unknown): value is ApiFailure {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { success?: unknown }).success === false &&
    typeof (value as { error?: unknown }).error === 'object'
  );
}
