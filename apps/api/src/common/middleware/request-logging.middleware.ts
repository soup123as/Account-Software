import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { Logger } from 'pino';
import { getRequestContext } from '../types/request-context.js';

/**
 * Emits one structured line per request once the response has finished.
 * The query string is omitted because it can carry tokens (e.g. password
 * reset links); bodies and headers are never logged.
 */
export function requestLoggingMiddleware(logger: Logger): RequestHandler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();
    response.on('finish', () => {
      const context = getRequestContext(request);
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const status = response.statusCode;
      const errorCode = response.locals.errorCode as string | undefined;
      const fields = {
        requestId: context?.requestId,
        userId: context?.userId ?? null,
        organizationId: context?.organizationId ?? null,
        method: request.method,
        path: request.originalUrl.split('?')[0],
        status,
        durationMs: Math.round(durationMs * 100) / 100,
        ...(errorCode ? { errorCode } : {}),
      };
      if (status >= 500) {
        logger.error(fields, 'request failed');
      } else if (status >= 400) {
        logger.warn(fields, 'request rejected');
      } else {
        logger.info(fields, 'request completed');
      }
    });
    next();
  };
}
