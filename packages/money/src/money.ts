import { Decimal, MoneyError, toDecimal, type DecimalInput } from './decimal.js';
import { assertScale, roundDecimal, toDecimalJsRounding, type RoundingMode } from './rounding.js';

const CURRENCY_CODE = /^[A-Z]{3}$/;

export function assertCurrencyCode(code: string): void {
  if (!CURRENCY_CODE.test(code)) {
    throw new MoneyError(`"${code}" is not an ISO 4217 alphabetic currency code.`);
  }
}

/**
 * Immutable monetary amount in a single currency.
 *
 * Money carries full decimal precision; it is only rounded when the caller
 * explicitly calls `round()` with a scale and mode. The scale (minor units)
 * is supplied by the caller from currency configuration in the database —
 * it is intentionally not hard-coded here.
 */
export class Money {
  private constructor(
    readonly amount: Decimal,
    readonly currency: string,
  ) {}

  static of(amount: DecimalInput, currency: string): Money {
    assertCurrencyCode(currency);
    return new Money(toDecimal(amount), currency);
  }

  static zero(currency: string): Money {
    return Money.of('0', currency);
  }

  /** Sums a non-empty list, or returns zero in `currency` for an empty list. */
  static sum(values: readonly Money[], currency: string): Money {
    return values.reduce((total, value) => total.plus(value), Money.zero(currency));
  }

  plus(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.plus(other.amount), this.currency);
  }

  minus(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.minus(other.amount), this.currency);
  }

  /** Multiplies by a quantity, rate or percentage factor. Result is NOT rounded. */
  times(factor: DecimalInput): Money {
    return new Money(this.amount.times(toDecimal(factor)), this.currency);
  }

  negate(): Money {
    return new Money(this.amount.negated(), this.currency);
  }

  abs(): Money {
    return new Money(this.amount.abs(), this.currency);
  }

  round(scale: number, mode: RoundingMode): Money {
    return new Money(roundDecimal(this.amount, scale, mode), this.currency);
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  isNegative(): boolean {
    return this.amount.isNegative() && !this.amount.isZero();
  }

  isPositive(): boolean {
    return this.amount.isPositive() && !this.amount.isZero();
  }

  compare(other: Money): -1 | 0 | 1 {
    this.assertSameCurrency(other);
    return this.amount.comparedTo(other.amount) as -1 | 0 | 1;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.amount.equals(other.amount);
  }

  /**
   * Splits this amount across ratios so that the parts always sum exactly to
   * the original amount rounded to `scale`. Remainder units are distributed
   * deterministically by largest fractional remainder, ties broken by index.
   */
  allocate(ratios: readonly DecimalInput[], scale: number, mode: RoundingMode): Money[] {
    assertScale(scale);
    if (ratios.length === 0) {
      throw new MoneyError('Cannot allocate across zero ratios.');
    }
    const weights = ratios.map((ratio) => toDecimal(ratio));
    if (weights.some((weight) => weight.isNegative())) {
      throw new MoneyError('Allocation ratios must not be negative.');
    }
    const totalWeight = weights.reduce((sum, weight) => sum.plus(weight), new Decimal(0));
    if (totalWeight.isZero()) {
      throw new MoneyError('Allocation ratios must not all be zero.');
    }

    const total = roundDecimal(this.amount, scale, mode);
    const unit = new Decimal(1).dividedBy(new Decimal(10).pow(scale));
    const direction = total.isNegative() ? -1 : 1;

    const exactShares = weights.map((weight) => total.times(weight).dividedBy(totalWeight));
    const parts = exactShares.map((share) =>
      share.toDecimalPlaces(scale, toDecimalJsRounding('DOWN')),
    );
    const allocated = parts.reduce((sum, part) => sum.plus(part), new Decimal(0));
    let remainingUnits = total.minus(allocated).abs().dividedBy(unit).toNumber();

    const order = exactShares
      .map((share, index) => ({ index, remainder: share.minus(parts[index]!).abs() }))
      .sort((a, b) => b.remainder.comparedTo(a.remainder) || a.index - b.index);

    for (let i = 0; remainingUnits > 0; i = (i + 1) % order.length, remainingUnits -= 1) {
      const target = order[i]!.index;
      parts[target] = parts[target]!.plus(unit.times(direction));
    }

    return parts.map((part) => new Money(part, this.currency));
  }

  /** Fixed-point string at the given scale. Throws if rounding would be required. */
  toFixed(scale: number): string {
    assertScale(scale);
    if (!this.amount.equals(this.amount.toDecimalPlaces(scale))) {
      throw new MoneyError(
        `Amount ${this.amount.toString()} has more than ${String(scale)} decimal places; round it explicitly first.`,
      );
    }
    return this.amount.toFixed(scale);
  }

  toString(): string {
    return `${this.amount.toString()} ${this.currency}`;
  }

  toJSON(): { amount: string; currency: string } {
    return { amount: this.amount.toString(), currency: this.currency };
  }

  private assertSameCurrency(other: Money): void {
    if (other.currency !== this.currency) {
      throw new MoneyError(
        `Currency mismatch: cannot combine ${this.currency} with ${other.currency}. Convert explicitly first.`,
      );
    }
  }
}
