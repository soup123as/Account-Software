import type { LoggerService } from '@nestjs/common';
import type { Logger } from 'pino';

/** Routes NestJS framework logs through the structured pino logger. */
export class NestPinoLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  log(message: unknown, context?: string): void {
    this.logger.info({ context }, stringify(message));
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, stringify(message));
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn({ context }, stringify(message));
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug({ context }, stringify(message));
  }

  verbose(message: unknown, context?: string): void {
    this.logger.trace({ context }, stringify(message));
  }

  fatal(message: unknown, context?: string): void {
    this.logger.fatal({ context }, stringify(message));
  }
}

function stringify(message: unknown): string {
  return typeof message === 'string' ? message : JSON.stringify(message);
}
