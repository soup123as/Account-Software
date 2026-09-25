import { Writable } from 'node:stream';
import { pino } from 'pino';
import { describe, expect, it } from 'vitest';
import { REDACTED_PATHS } from './logger.js';

function capture() {
  const lines: string[] = [];
  const stream = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      lines.push(chunk.toString());
      callback();
    },
  });
  const logger = pino({ redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' } }, stream);
  return { logger, lines };
}

describe('log redaction', () => {
  it('removes credentials and tokens', () => {
    const { logger, lines } = capture();
    logger.info(
      {
        password: 'hunter2',
        user: { password: 'hunter2', accessToken: 'eyJ.secret' },
        headers: { authorization: 'Bearer eyJ.secret', cookie: 'session=abc' },
        apiKey: 'sk_live_123',
      },
      'login attempt',
    );
    const output = lines.join('');
    expect(output).not.toContain('hunter2');
    expect(output).not.toContain('eyJ.secret');
    expect(output).not.toContain('session=abc');
    expect(output).not.toContain('sk_live_123');
    expect(output).toContain('[REDACTED]');
  });
});
