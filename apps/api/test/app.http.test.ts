import type { NestExpressApplication } from '@nestjs/platform-express';
import { pino } from 'pino';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/bootstrap.js';
import { loadEnv } from '../src/config/env.schema.js';

const APP_URL = 'http://localhost:5173';

describe('API HTTP surface', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const env = loadEnv({
      NODE_ENV: 'test',
      APP_URL,
      // Nothing listens on port 1: readiness must report the database as down.
      DATABASE_URL: 'postgresql://nobody:nothing@127.0.0.1:1/none?connect_timeout=1',
    });
    app = await createApp(env, pino({ level: 'silent' }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('GET /api/v1/health returns a liveness envelope', async () => {
    const response = await http().get('/api/v1/health').expect(200);
    expect(response.body).toMatchObject({
      success: true,
      data: { status: 'ok', service: '@gap/api', environment: 'test' },
    });
    expect(typeof response.body.data.uptimeSeconds).toBe('number');
  });

  it('GET /api/v1/health/ready returns 503 with the failing dependency', async () => {
    const response = await http().get('/api/v1/health/ready').expect(503);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        details: [{ path: 'database', message: 'down' }],
      },
    });
  }, 15_000);

  it('returns the standard envelope for unknown routes without leaking internals', async () => {
    const response = await http().get('/api/v1/does-not-exist').expect(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
        requestId: expect.any(String) as string,
      },
    });
    expect(JSON.stringify(response.body)).not.toContain('does-not-exist');
  });

  it('only serves routes under the API prefix', async () => {
    await http().get('/health').expect(404);
  });

  it('rejects malformed JSON with a validation envelope', async () => {
    const response = await http()
      .post('/api/v1/health')
      .set('content-type', 'application/json')
      .send('{"broken": ')
      .expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(response.body)).not.toMatch(/SyntaxError|at JSON\.parse|stack/);
  });

  it('rejects oversized bodies', async () => {
    const response = await http()
      .post('/api/v1/health')
      .set('content-type', 'application/json')
      .send(JSON.stringify({ blob: 'x'.repeat(1_100_000) }))
      .expect(413);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('sets security headers and hides the framework', async () => {
    const response = await http().get('/api/v1/health');
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toContain("default-src 'none'");
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('propagates a safe request id and generates one otherwise', async () => {
    const echoed = await http().get('/api/v1/health').set('x-request-id', 'client-req-12345');
    expect(echoed.headers['x-request-id']).toBe('client-req-12345');

    const generated = await http()
      .get('/api/v1/health')
      .set('x-request-id', 'bad id with spaces; drop table');
    expect(generated.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('allows CORS only for the configured web origin', async () => {
    const allowed = await http()
      .options('/api/v1/health')
      .set('origin', APP_URL)
      .set('access-control-request-method', 'GET');
    expect(allowed.headers['access-control-allow-origin']).toBe(APP_URL);
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');

    const denied = await http()
      .options('/api/v1/health')
      .set('origin', 'https://evil.example')
      .set('access-control-request-method', 'GET');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});
