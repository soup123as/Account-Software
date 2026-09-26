import type { Request } from 'express';

/**
 * Per-request metadata attached by middleware. `userId` / `organizationId` are
 * populated by the authentication (Phase 1) and tenant-resolution (Phase 2)
 * layers; until then they remain null.
 */
export interface RequestContext {
  readonly requestId: string;
  userId: string | null;
  organizationId: string | null;
}

export type ContextualRequest = Request & { context: RequestContext };

export function getRequestContext(request: Request): RequestContext | undefined {
  return (request as Partial<ContextualRequest>).context;
}
