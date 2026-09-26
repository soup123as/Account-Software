import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError, apiRequest } from './api-client';

afterEach(() => {
  vi.unstubAllGlobals();
});

const base = { baseUrl: 'http://api.test' };

describe('apiRequest', () => {
  it('unwraps success envelopes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ success: true, data: { id: 1 } }))),
    );
    await expect(apiRequest('/x', base)).resolves.toEqual({ id: 1 });
  });

  it('surfaces the server error code, message and request id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          Response.json(
            {
              success: false,
              error: { code: 'FORBIDDEN', message: 'Nope.', requestId: 'req-123456' },
            },
            { status: 403 },
          ),
        ),
      ),
    );
    const error = await apiRequest('/x', base).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Nope.',
      requestId: 'req-123456',
    });
  });

  it('converts network failures into SERVICE_UNAVAILABLE', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    await expect(apiRequest('/x', base)).rejects.toMatchObject({
      status: 0,
      code: 'SERVICE_UNAVAILABLE',
    });
  });

  it('rejects non-envelope responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('<html>bad gateway</html>', { status: 502 }))),
    );
    await expect(apiRequest('/x', base)).rejects.toMatchObject({
      status: 502,
      code: 'INTERNAL_ERROR',
    });
  });

  it('sends JSON bodies with credentials', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(Response.json({ success: true, data: null })));
    vi.stubGlobal('fetch', fetchMock);
    await apiRequest('/x', { ...base, method: 'POST', body: { a: '1.00' } });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/x',
      expect.objectContaining({
        method: 'POST',
        body: '{"a":"1.00"}',
        credentials: 'include',
      }),
    );
  });
});
