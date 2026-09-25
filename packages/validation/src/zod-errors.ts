import type { z } from 'zod';

export interface FieldIssue {
  readonly path: string;
  readonly message: string;
}

/** Flattens Zod issues into the `details` shape used by the API error envelope. */
export function toFieldIssues(error: z.ZodError): FieldIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}
