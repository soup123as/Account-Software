import type { Decimal as DecimalJs } from 'decimal.js';
import { Decimal } from './decimal.js';

/**
 * Explicit rounding modes. Which mode applies (e.g. per-line vs per-invoice
 * tax rounding) is a country/tax-rule configuration decision made by the
 * caller — this package never chooses one implicitly.
 */
export const RoundingMode = {
  /** 2.5 -> 3, -2.5 -> -3 (away from zero on ties). */
  HALF_UP: 'HALF_UP',
  /** 2.5 -> 2, -2.5 -> -2 (towards zero on ties). */
  HALF_DOWN: 'HALF_DOWN',
  /** Banker's rounding: 2.5 -> 2, 3.5 -> 4. */
  HALF_EVEN: 'HALF_EVEN',
  /** Away from zero. */
  UP: 'UP',
  /** Towards zero (truncate). */
  DOWN: 'DOWN',
  /** Towards +infinity. */
  CEILING: 'CEILING',
  /** Towards -infinity. */
  FLOOR: 'FLOOR',
} as const;

export type RoundingMode = (typeof RoundingMode)[keyof typeof RoundingMode];

const DECIMAL_JS_MODE: Record<RoundingMode, DecimalJs.Rounding> = {
  HALF_UP: Decimal.ROUND_HALF_UP,
  HALF_DOWN: Decimal.ROUND_HALF_DOWN,
  HALF_EVEN: Decimal.ROUND_HALF_EVEN,
  UP: Decimal.ROUND_UP,
  DOWN: Decimal.ROUND_DOWN,
  CEILING: Decimal.ROUND_CEIL,
  FLOOR: Decimal.ROUND_FLOOR,
};

export function toDecimalJsRounding(mode: RoundingMode): DecimalJs.Rounding {
  return DECIMAL_JS_MODE[mode];
}

export function assertScale(scale: number): void {
  if (!Number.isInteger(scale) || scale < 0 || scale > 12) {
    throw new RangeError(`Scale must be an integer between 0 and 12, received ${String(scale)}.`);
  }
}

export function roundDecimal(value: Decimal, scale: number, mode: RoundingMode): Decimal {
  assertScale(scale);
  return value.toDecimalPlaces(scale, toDecimalJsRounding(mode));
}
