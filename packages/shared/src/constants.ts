/** Header used to correlate a request across web, API, worker and logs. */
export const REQUEST_ID_HEADER = 'x-request-id';

/** Header clients send to make mutating financial requests safe to retry (Phase 8+). */
export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

/** Queue names are namespaced at runtime with QUEUE_PREFIX. */
export const QueueName = {
  SYSTEM: 'system',
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];
