import { describe, expect, it } from 'vitest';
import {
  countryCodeSchema,
  currencyCodeSchema,
  dateRangeSchema,
  decimalStringSchema,
  nonNegativeDecimalStringSchema,
  paginationQuerySchema,
  toFieldIssues,
  uuidSchema,
} from './index.js';

describe('identifier schemas', () => {
  it('accepts UUIDs only', () => {
    expect(uuidSchema.safeParse('0b8f8a4e-7a57-4d0f-9b9c-3f0e0a1f3b11').success).toBe(true);
    expect(uuidSchema.safeParse('123').success).toBe(false);
  });

  it('normalizes ISO codes', () => {
    expect(countryCodeSchema.parse(' au ')).toBe('AU');
    expect(currencyCodeSchema.parse('inr')).toBe('INR');
    expect(countryCodeSchema.safeParse('AUS').success).toBe(false);
    expect(currencyCodeSchema.safeParse('A$').success).toBe(false);
  });
});

describe('decimalStringSchema', () => {
  it.each(['0', '10', '-10.5', '1234567890123456.1234'])('accepts %s', (value) => {
    expect(decimalStringSchema.safeParse(value).success).toBe(true);
  });

  it.each(['1.23456', '1e5', '12345678901234567', 'NaN', '', '1,000'])('rejects %s', (value) => {
    expect(decimalStringSchema.safeParse(value).success).toBe(false);
  });

  it('rejects numbers (must be transported as strings)', () => {
    expect(decimalStringSchema.safeParse(10.5).success).toBe(false);
  });

  it('can forbid negatives', () => {
    expect(nonNegativeDecimalStringSchema.safeParse('-1').success).toBe(false);
    expect(nonNegativeDecimalStringSchema.safeParse('1').success).toBe(true);
  });
});

describe('paginationQuerySchema', () => {
  it('applies defaults and coerces query strings', () => {
    expect(paginationQuerySchema.parse({})).toEqual({ limit: 25 });
    expect(paginationQuerySchema.parse({ limit: '50' }).limit).toBe(50);
  });

  it('caps page size to protect the database', () => {
    expect(paginationQuerySchema.safeParse({ limit: '1000' }).success).toBe(false);
    expect(paginationQuerySchema.safeParse({ limit: '0' }).success).toBe(false);
  });
});

describe('dateRangeSchema', () => {
  it('requires from <= to', () => {
    expect(dateRangeSchema.safeParse({ from: '2026-01-01', to: '2026-12-31' }).success).toBe(true);
    const result = dateRangeSchema.safeParse({ from: '2026-12-31', to: '2026-01-01' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldIssues(result.error)).toEqual([
        { path: 'to', message: '`from` must be on or before `to`.' },
      ]);
    }
  });

  it('rejects impossible dates', () => {
    expect(dateRangeSchema.safeParse({ from: '2026-02-30', to: '2026-03-01' }).success).toBe(false);
  });
});
