import { Decimal as DecimalJs } from 'decimal.js';

/**
 * Isolated Decimal constructor for financial arithmetic.
 *
 * - 40 significant digits comfortably exceeds NUMERIC(20,4) storage and
 *   intermediate products (amount x rate x quantity).
 * - The default rounding mode is irrelevant for correctness because every
 *   rounding in this package passes an explicit mode; it is set to banker's
 *   rounding only so that accidental implicit rounding is unbiased.
 * - Exponential notation is disabled for string output within realistic ranges.
 */
export const Decimal = DecimalJs.clone({
  precision: 40,
  rounding: DecimalJs.ROUND_HALF_EVEN,
  toExpNeg: -40,
  toExpPos: 40,
});

export type Decimal = InstanceType<typeof Decimal>;

export type DecimalInput = string | bigint | number | Decimal;

const DECIMAL_STRING = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;

/**
 * Converts input to a Decimal without ever passing through binary floating point.
 *
 * JavaScript numbers are accepted ONLY when they are safe integers; fractional
 * numbers are rejected because `0.1` is already imprecise before it reaches us.
 */
export function toDecimal(value: DecimalInput): Decimal {
  if (value instanceof Decimal) {
    return value;
  }
  if (typeof value === 'bigint') {
    return new Decimal(value.toString());
  }
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new MoneyError(
        `Refusing to convert non-integer JavaScript number ${String(value)}; pass a decimal string instead.`,
      );
    }
    return new Decimal(value);
  }
  const trimmed = value.trim();
  if (!DECIMAL_STRING.test(trimmed)) {
    throw new MoneyError(`"${value}" is not a valid decimal amount.`);
  }
  return new Decimal(trimmed);
}

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyError';
  }
}
