import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { REQUEST_ID_HEADER, IDEMPOTENCY_KEY_HEADER } from '@gap/shared';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { NestPinoLogger } from './common/logging/nest-logger.js';
import { requestContextMiddleware } from './common/middleware/request-context.middleware.js';
import { requestLoggingMiddleware } from './common/middleware/request-logging.middleware.js';
import { type Env } from './config/env.schema.js';

/**
 * Builds a fully configured (but not listening) application. Shared by
 * main.ts and the HTTP tests so tests exercise the real middleware stack.
 */
export async function createApp(env: Env, logger: Logger): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot(env, logger), {
    logger: new NestPinoLogger(logger),
    bodyParser: false,
  });

  app.use(requestContextMiddleware);
  app.use(requestLoggingMiddleware(logger));
  app.use(
    helmet({
      // The API serves JSON only; lock the document context down entirely.
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.useBodyParser('json', { limit: '1mb' });
  app.enableCors({
    origin: [env.APP_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type', REQUEST_ID_HEADER, IDEMPOTENCY_KEY_HEADER],
    exposedHeaders: [REQUEST_ID_HEADER],
    maxAge: 600,
  });
  app.setGlobalPrefix(env.API_PREFIX);
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.enableShutdownHooks();

  return app;
}
