import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { REQUEST_ID_HEADER } from '@gap/shared';
import type { ContextualRequest } from '../types/request-context.js';

/** Incoming IDs are accepted only if they are short and URL-safe, to prevent log injection. */
const SAFE_REQUEST_ID = /^[A-Za-z0-9._-]{8,128}$/;

export function resolveRequestId(incoming: string | string[] | undefined): string {
  const candidate = Array.isArray(incoming) ? incoming[0] : incoming;
  return candidate && SAFE_REQUEST_ID.test(candidate) ? candidate : randomUUID();
}

export function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const requestId = resolveRequestId(request.headers[REQUEST_ID_HEADER]);
  (request as ContextualRequest).context = { requestId, userId: null, organizationId: null };
  response.setHeader(REQUEST_ID_HEADER, requestId);
  next();
}
