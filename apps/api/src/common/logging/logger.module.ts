import { Global, Module, type DynamicModule } from '@nestjs/common';
import type { Logger } from 'pino';

export const LOGGER = Symbol('LOGGER');

@Global()
@Module({})
export class LoggerModule {
  static forRoot(logger: Logger): DynamicModule {
    return {
      module: LoggerModule,
      providers: [{ provide: LOGGER, useValue: logger }],
      exports: [LOGGER],
    };
  }
}
