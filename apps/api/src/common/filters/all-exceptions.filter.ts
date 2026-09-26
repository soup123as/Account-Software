import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Logger } from 'pino';
import { ZodError } from 'zod';
import { AppError, ErrorCode, type ApiFailure, type ErrorDetail } from '@gap/shared';
import { toFieldIssues } from '@gap/validation';
import { getRequestContext } from '../types/request-context.js';

interface NormalizedError {
  readonly status: number;
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: readonly ErrorDetail[];
}

const STATUS_TO_CODE: Readonly<Record<number, ErrorCode>> = {
  400: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.AUTHENTICATION_REQUIRED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  405: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  413: ErrorCode.VALIDATION_ERROR,
  415: ErrorCode.VALIDATION_ERROR,
  422: ErrorCode.VALIDATION_ERROR,
  429: ErrorCode.RATE_LIMITED,
  503: ErrorCode.SERVICE_UNAVAILABLE,
};

const SAFE_MESSAGES: Readonly<Record<number, string>> = {
  400: 'The request is invalid.',
  401: 'Authentication is required.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  405: 'The requested resource was not found.',
  409: 'The request conflicts with the current state.',
  413: 'The request body is too large.',
  415: 'Unsupported content type.',
  422: 'The request is invalid.',
  429: 'Too many requests. Please try again later.',
  503: 'The service is temporarily unavailable.',
};

/**
 * Converts every thrown value into the standard error envelope:
 *   { success: false, error: { code, message, details?, requestId } }
 *
 * Raw database errors, stack traces and framework internals are NEVER
 * returned to clients in any environment; they are logged server-side.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const requestId = getRequestContext(request)?.requestId;
    const normalized = normalize(exception);

    if (normalized.status >= 500 && !(exception instanceof AppError)) {
      this.logger.error({ requestId, err: exception }, 'unhandled error');
    }

    const body: ApiFailure = {
      success: false,
      error: {
        code: normalized.code,
        message: normalized.message,
        ...(normalized.details && normalized.details.length > 0
          ? { details: normalized.details }
          : {}),
        ...(requestId ? { requestId } : {}),
      },
    };

    response.locals.errorCode = normalized.code;
    response.status(normalized.status).json(body);
  }
}

export function normalize(exception: unknown): NormalizedError {
  if (exception instanceof AppError) {
    return {
      status: exception.statusCode,
      code: exception.code,
      message: exception.message,
      details: exception.details,
    };
  }

  if (exception instanceof ZodError) {
    return {
      status: HttpStatus.BAD_REQUEST,
      code: ErrorCode.VALIDATION_ERROR,
      message: 'The request is invalid.',
      details: toFieldIssues(exception),
    };
  }

  // Framework HTTP exceptions (404 route, throttling, etc.) and body-parser
  // errors (malformed JSON, payload too large) expose a 4xx status.
  const status =
    exception instanceof HttpException ? exception.getStatus() : clientErrorStatus(exception);
  if (status !== undefined && status < 500) {
    return {
      status,
      code: STATUS_TO_CODE[status] ?? ErrorCode.VALIDATION_ERROR,
      message: SAFE_MESSAGES[status] ?? 'The request could not be processed.',
    };
  }
  if (status === HttpStatus.SERVICE_UNAVAILABLE) {
    return { status, code: ErrorCode.SERVICE_UNAVAILABLE, message: SAFE_MESSAGES[503]! };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred.',
  };
}

function clientErrorStatus(exception: unknown): number | undefined {
  if (typeof exception !== 'object' || exception === null) {
    return undefined;
  }
  const candidate =
    (exception as { status?: unknown; statusCode?: unknown }).status ??
    (exception as { statusCode?: unknown }).statusCode;
  return typeof candidate === 'number' && candidate >= 400 && candidate < 500
    ? candidate
    : undefined;
}
