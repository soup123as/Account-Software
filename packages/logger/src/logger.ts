import { pino, type Logger, type LoggerOptions } from 'pino';

/**
 * Paths removed from every log line. Structured logs must never contain
 * credentials, tokens or secrets (see docs/architecture/security.md).
 */
export const REDACTED_PATHS = [
  'password',
  '*.password',
  'token',
  '*.token',
  'accessToken',
  '*.accessToken',
  'refreshToken',
  '*.refreshToken',
  'secret',
  '*.secret',
  'apiKey',
  '*.apiKey',
  'authorization',
  '*.authorization',
  'cookie',
  '*.cookie',
  'headers.authorization',
  'headers.cookie',
  'headers["x-api-key"]',
  'req.headers.authorization',
  'req.headers.cookie',
];

export function createLogger(options: { level: LoggerOptions['level']; service: string }): Logger {
  return pino({
    level: options.level ?? 'info',
    base: { service: options.service },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
}

export type { Logger };
