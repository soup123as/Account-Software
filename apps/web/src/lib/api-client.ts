import {
  ErrorCode,
  REQUEST_ID_HEADER,
  isApiFailure,
  type ApiResponse,
  type ApiErrorBody,
} from '@gap/shared';
import { env } from './env';

/** Error thrown for any non-success API response, carrying the server's safe error body. */
export class ApiRequestError extends Error {
  readonly code: ApiErrorBody['code'];
  readonly status: number;
  readonly requestId: string | undefined;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = body.code;
    this.requestId = body.requestId;
  }
}

export interface ApiRequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly baseUrl?: string;
}

/**
 * Typed fetch wrapper for the platform API. Unwraps the `{ success, data }`
 * envelope and converts failures (including network errors and non-JSON
 * responses) into ApiRequestError. Authorization headers are attached in Phase 1.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${options.baseUrl ?? env.VITE_API_URL}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: {
        accept: 'application/json',
        ...(options.body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      credentials: 'include',
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      ...(options.signal ? { signal: options.signal } : {}),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiRequestError(0, {
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message: 'Unable to reach the server.',
    });
  }

  const payload: unknown = await response.json().catch(() => undefined);
  if (isApiFailure(payload)) {
    throw new ApiRequestError(response.status, payload.error);
  }
  if (!response.ok || typeof payload !== 'object' || payload === null) {
    const requestId = response.headers.get(REQUEST_ID_HEADER) ?? undefined;
    throw new ApiRequestError(response.status, {
      code:
        response.status >= 500 || response.status === 0
          ? ErrorCode.INTERNAL_ERROR
          : ErrorCode.VALIDATION_ERROR,
      message: 'Unexpected response from the server.',
      ...(requestId ? { requestId } : {}),
    });
  }
  return (payload as Extract<ApiResponse<T>, { success: true }>).data;
}
