import { Money, MoneyError, assertCurrencyCode, toDecimal } from '@gap/money';
import type { Decimal, DecimalInput, RoundingMode } from '@gap/money';

declare const currencyCodeBrand: unique symbol;

/** An ISO 4217 alphabetic code that has passed format validation. */
export type CurrencyCode = string & { readonly [currencyCodeBrand]: true };

export function parseCurrencyCode(value: string): CurrencyCode {
  const normalized = value.trim().toUpperCase();
  assertCurrencyCode(normalized);
  return normalized as CurrencyCode;
}

/**
 * Currency metadata. Instances are loaded from the `currencies` table
 * (Phase 4) — this package deliberately ships no list of currencies.
 */
export interface CurrencyDefinition {
  readonly code: CurrencyCode;
  readonly name: string;
  readonly symbol: string;
  /** Number of minor-unit digits (e.g. 2 for AUD, 0 for JPY, 3 for KWD). */
  readonly decimalPlaces: number;
}

/**
 * A rate captured at a point in time: 1 unit of `base` = `rate` units of `quote`.
 * Once a transaction references a rate, that rate is stored on the transaction
 * and never re-derived from "today's" rate.
 */
export interface ExchangeRate {
  readonly base: CurrencyCode;
  readonly quote: CurrencyCode;
  readonly rate: Decimal;
  /** ISO date (YYYY-MM-DD) the rate is effective from. */
  readonly effectiveDate: string;
  readonly source: string;
}

export function createExchangeRate(input: {
  base: string;
  quote: string;
  rate: DecimalInput;
  effectiveDate: string;
  source: string;
}): ExchangeRate {
  const base = parseCurrencyCode(input.base);
  const quote = parseCurrencyCode(input.quote);
  if (base === quote) {
    throw new MoneyError('An exchange rate must be between two different currencies.');
  }
  const rate = toDecimal(input.rate);
  if (!rate.isPositive() || rate.isZero()) {
    throw new MoneyError('An exchange rate must be greater than zero.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.effectiveDate)) {
    throw new MoneyError('effectiveDate must be an ISO date (YYYY-MM-DD).');
  }
  if (input.source.trim() === '') {
    throw new MoneyError('An exchange rate must record its source.');
  }
  return { base, quote, rate, effectiveDate: input.effectiveDate, source: input.source.trim() };
}

/**
 * Converts `amount` using the supplied (historical) rate and rounds the result
 * with the caller-specified target scale and rounding mode.
 */
export function convert(
  amount: Money,
  rate: ExchangeRate,
  target: { readonly scale: number; readonly rounding: RoundingMode },
): Money {
  if (amount.currency !== rate.base) {
    throw new MoneyError(
      `Rate ${rate.base}/${rate.quote} cannot convert an amount in ${amount.currency}.`,
    );
  }
  return Money.of(amount.amount.times(rate.rate), rate.quote).round(target.scale, target.rounding);
}
