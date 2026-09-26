import { describe, expect, it } from 'vitest';
import { Money, MoneyError, RoundingMode, toDecimal } from './index.js';

describe('toDecimal', () => {
  it('parses decimal strings exactly', () => {
    expect(toDecimal('0.1').plus(toDecimal('0.2')).toString()).toBe('0.3');
  });

  it('accepts safe integers and bigint', () => {
    expect(toDecimal(42).toString()).toBe('42');
    expect(toDecimal(12345678901234567890n).toString()).toBe('12345678901234567890');
  });

  it('rejects fractional JavaScript numbers', () => {
    expect(() => toDecimal(0.1)).toThrow(MoneyError);
    expect(() => toDecimal(Number.NaN)).toThrow(MoneyError);
  });

  it.each(['', 'abc', '1e5', '1,000.00', '1.2.3', 'Infinity'])('rejects %j', (input) => {
    expect(() => toDecimal(input)).toThrow(MoneyError);
  });
});

describe('Money', () => {
  it('validates currency codes', () => {
    expect(() => Money.of('1', 'usd')).toThrow(MoneyError);
    expect(() => Money.of('1', 'US')).toThrow(MoneyError);
    expect(Money.of('1', 'AUD').currency).toBe('AUD');
  });

  it('adds without floating point error', () => {
    const total = Money.of('0.1', 'AUD').plus(Money.of('0.2', 'AUD'));
    expect(total.equals(Money.of('0.3', 'AUD'))).toBe(true);
  });

  it('refuses to combine currencies', () => {
    expect(() => Money.of('1', 'AUD').plus(Money.of('1', 'INR'))).toThrow(/Currency mismatch/);
    expect(() => Money.of('1', 'AUD').compare(Money.of('1', 'INR'))).toThrow(MoneyError);
  });

  it('keeps full precision until explicitly rounded', () => {
    const value = Money.of('10', 'USD').times('0.333333');
    expect(value.amount.toString()).toBe('3.33333');
    expect(value.round(2, RoundingMode.HALF_UP).toFixed(2)).toBe('3.33');
  });

  it.each([
    ['2.345', RoundingMode.HALF_UP, '2.35'],
    ['2.345', RoundingMode.HALF_EVEN, '2.34'],
    ['2.355', RoundingMode.HALF_EVEN, '2.36'],
    ['2.345', RoundingMode.HALF_DOWN, '2.34'],
    ['-2.345', RoundingMode.HALF_UP, '-2.35'],
    ['2.341', RoundingMode.UP, '2.35'],
    ['2.349', RoundingMode.DOWN, '2.34'],
    ['-2.341', RoundingMode.CEILING, '-2.34'],
    ['-2.341', RoundingMode.FLOOR, '-2.35'],
  ])('rounds %s with %s to %s', (input, mode, expected) => {
    expect(Money.of(input, 'USD').round(2, mode).toFixed(2)).toBe(expected);
  });

  it('supports zero-decimal and three-decimal currencies via explicit scale', () => {
    expect(Money.of('1234.5', 'JPY').round(0, RoundingMode.HALF_UP).toFixed(0)).toBe('1235');
    expect(Money.of('1.2345', 'KWD').round(3, RoundingMode.HALF_UP).toFixed(3)).toBe('1.235');
  });

  it('refuses to silently round in toFixed', () => {
    expect(() => Money.of('1.005', 'USD').toFixed(2)).toThrow(/round it explicitly/);
  });

  it('sums lists and handles empty input', () => {
    const values = ['1.10', '2.20', '3.30'].map((v) => Money.of(v, 'GBP'));
    expect(Money.sum(values, 'GBP').toFixed(2)).toBe('6.60');
    expect(Money.sum([], 'GBP').isZero()).toBe(true);
  });

  it('reports sign correctly, including negative zero', () => {
    expect(Money.of('-0', 'USD').isNegative()).toBe(false);
    expect(Money.of('-1', 'USD').isNegative()).toBe(true);
    expect(Money.of('1', 'USD').isPositive()).toBe(true);
    expect(Money.of('-1', 'USD').abs().toFixed(0)).toBe('1');
    expect(Money.of('1', 'USD').negate().toFixed(0)).toBe('-1');
  });

  it('serializes amounts as strings, never numbers', () => {
    expect(JSON.parse(JSON.stringify(Money.of('19.99', 'EUR')))).toEqual({
      amount: '19.99',
      currency: 'EUR',
    });
  });
});

describe('Money.allocate', () => {
  const sumOf = (parts: Money[]) => Money.sum(parts, parts[0]!.currency);

  it('splits evenly with deterministic remainder distribution', () => {
    const parts = Money.of('100', 'USD').allocate(['1', '1', '1'], 2, RoundingMode.HALF_EVEN);
    expect(parts.map((p) => p.toFixed(2))).toEqual(['33.34', '33.33', '33.33']);
    expect(sumOf(parts).toFixed(2)).toBe('100.00');
  });

  it('respects weights and always reconciles to the total', () => {
    const parts = Money.of('0.05', 'USD').allocate(['3', '7'], 2, RoundingMode.HALF_UP);
    // Exact shares 0.015 / 0.035 tie on remainder; the lower index wins.
    expect(parts.map((p) => p.toFixed(2))).toEqual(['0.02', '0.03']);
    expect(sumOf(parts).toFixed(2)).toBe('0.05');
  });

  it('handles negative amounts', () => {
    const parts = Money.of('-10', 'AUD').allocate(['1', '1', '1'], 2, RoundingMode.HALF_UP);
    expect(parts.map((p) => p.toFixed(2))).toEqual(['-3.34', '-3.33', '-3.33']);
    expect(sumOf(parts).toFixed(2)).toBe('-10.00');
  });

  it('rejects invalid ratios', () => {
    const amount = Money.of('10', 'AUD');
    expect(() => amount.allocate([], 2, RoundingMode.HALF_UP)).toThrow(MoneyError);
    expect(() => amount.allocate(['0', '0'], 2, RoundingMode.HALF_UP)).toThrow(MoneyError);
    expect(() => amount.allocate(['-1', '2'], 2, RoundingMode.HALF_UP)).toThrow(MoneyError);
  });

  it('is exact across many random-looking splits', () => {
    const amount = Money.of('1234567.89', 'INR');
    const parts = amount.allocate(
      ['0.17', '0.29', '0.31', '0.23', '0.0001'],
      2,
      RoundingMode.HALF_EVEN,
    );
    expect(sumOf(parts).equals(amount)).toBe(true);
  });
});
