import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'auth:isPublic';

/**
 * Marks a route as reachable without authentication.
 *
 * The global authentication guard introduced in Phase 1 denies every route by
 * default and honours only this marker. Use it sparingly (health checks,
 * auth callbacks, signed webhooks) and document each usage.
 */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);
