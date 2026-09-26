import type { JobHandler } from './registry.js';
import { heartbeatJob } from './scheduled-tasks/heartbeat.job.js';

/**
 * Every job handler the worker can process. Feature phases add their handlers
 * here (emails, invoice PDFs, reports, exports, notifications, compliance).
 */
export const jobHandlers: readonly JobHandler[] = [heartbeatJob];
