import { describe, expect, it } from 'vitest';
import { isApiFailure, ok } from './envelope.js';

describe('API envelope', () => {
  it('wraps data in a success envelope', () => {
    expect(ok({ id: 1 })).toEqual({ success: true, data: { id: 1 } });
  });

  it('detects failure envelopes', () => {
    expect(isApiFailure({ success: false, error: { code: 'NOT_FOUND', message: 'x' } })).toBe(true);
    expect(isApiFailure({ success: true, data: null })).toBe(false);
    expect(isApiFailure(null)).toBe(false);
  });
});
