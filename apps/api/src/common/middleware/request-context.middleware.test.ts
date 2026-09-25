import { describe, expect, it } from 'vitest';
import { resolveRequestId } from './request-context.middleware.js';

describe('resolveRequestId', () => {
  it('keeps a well-formed incoming id', () => {
    expect(resolveRequestId('req_01HZX3ABCDEF')).toBe('req_01HZX3ABCDEF');
  });

  it.each([undefined, '', 'short', 'has spaces in it', 'x'.repeat(200), 'line\nbreak-injection'])(
    'replaces unsafe id %j with a UUID',
    (incoming) => {
      expect(resolveRequestId(incoming)).toMatch(/^[0-9a-f-]{36}$/);
    },
  );

  it('uses the first value of a repeated header', () => {
    expect(resolveRequestId(['first-request-id', 'second-request-id'])).toBe('first-request-id');
  });
});
