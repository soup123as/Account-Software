import { z } from 'zod';

/** UUID primary keys (all tables use UUIDs). */
export const uuidSchema = z.uuid();

/** ISO 3166-1 alpha-2 country code, e.g. `AU`. Existence is checked against the database. */
export const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, 'Must be an ISO 3166-1 alpha-2 country code.');

/** ISO 4217 alphabetic currency code, e.g. `AUD`. Existence is checked against the database. */
export const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, 'Must be an ISO 4217 currency code.');

/** Calendar date without time zone, e.g. an invoice date or fiscal period boundary. */
export const isoDateSchema = z.iso.date();

/**
 * Monetary / quantity input. Amounts are transported as strings to avoid
 * JSON number -> IEEE-754 conversion. Up to 16 integer digits and 4 fractional
 * digits, matching NUMERIC(20,4) storage.
 */
export const decimalStringSchema = z
  .string()
  .trim()
  .regex(/^-?\d{1,16}(\.\d{1,4})?$/, 'Must be a decimal string with at most 4 decimal places.');

export const nonNegativeDecimalStringSchema = decimalStringSchema.refine(
  (value) => !value.startsWith('-'),
  'Must not be negative.',
);

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 25;

/** Cursor pagination query, used by all list endpoints. */
export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  cursor: z.string().min(1).max(512).optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const dateRangeSchema = z
  .object({ from: isoDateSchema, to: isoDateSchema })
  .refine((range) => range.from <= range.to, {
    message: '`from` must be on or before `to`.',
    path: ['to'],
  });

export type DateRange = z.infer<typeof dateRangeSchema>;
