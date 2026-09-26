import { Money, MoneyError, RoundingMode } from '@gap/money';
import { describe, expect, it } from 'vitest';
import { convert, createExchangeRate, parseCurrencyCode } from './index.js';

describe('parseCurrencyCode', () => {
  it('normalizes and validates ISO 4217 format', () => {
    expect(parseCurrencyCode(' aud ')).toBe('AUD');
    expect(() => parseCurrencyCode('AU')).toThrow(MoneyError);
    expect(() => parseCurrencyCode('A1D')).toThrow(MoneyError);
  });
});

describe('createExchangeRate', () => {
  const valid = {
    base: 'AUD',
    quote: 'INR',
    rate: '55.1234',
    effectiveDate: '2026-07-01',
    source: 'test-fixture',
  };

  it('builds a validated rate', () => {
    const rate = createExchangeRate(valid);
    expect(rate.rate.toString()).toBe('55.1234');
  });

  it.each([
    [{ quote: 'AUD' }, /different currencies/],
    [{ rate: '0' }, /greater than zero/],
    [{ rate: '-1.2' }, /greater than zero/],
    [{ effectiveDate: '01/07/2026' }, /ISO date/],
    [{ source: '  ' }, /source/],
  ])('rejects %j', (override, message) => {
    expect(() => createExchangeRate({ ...valid, ...override })).toThrow(message);
  });
});

describe('convert', () => {
  const rate = createExchangeRate({
    base: 'USD',
    quote: 'JPY',
    rate: '147.385',
    effectiveDate: '2026-01-15',
    source: 'test-fixture',
  });

  it('converts with the stored rate and explicit rounding', () => {
    const result = convert(Money.of('10.01', 'USD'), rate, {
      scale: 0,
      rounding: RoundingMode.HALF_UP,
    });
    expect(result.currency).toBe('JPY');
    expect(result.toFixed(0)).toBe('1475');
  });

  it('refuses to convert from the wrong currency', () => {
    expect(() =>
      convert(Money.of('1', 'EUR'), rate, { scale: 0, rounding: RoundingMode.HALF_UP }),
    ).toThrow(MoneyError);
  });
});
