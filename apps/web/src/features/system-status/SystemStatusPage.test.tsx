import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { SystemStatusPage } from './SystemStatusPage';

function mockFetch(implementation: () => Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(implementation));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SystemStatusPage', () => {
  it('shows a loading state, then the API details when healthy', async () => {
    mockFetch(() =>
      Promise.resolve(
        Response.json({
          success: true,
          data: {
            status: 'ok',
            service: '@gap/api',
            version: '0.1.0',
            environment: 'test',
            uptimeSeconds: 5,
            timestamp: '2026-09-25T10:00:00.000Z',
          },
        }),
      ),
    );
    renderWithProviders(<SystemStatusPage />);

    expect(screen.getByText('Checking…')).toBeInTheDocument();
    expect(await screen.findByText('Operational')).toBeInTheDocument();
    expect(screen.getByText('0.1.0')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'System status' })).toBeInTheDocument();
  });

  it('shows an accessible error state when the API is unreachable', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    renderWithProviders(<SystemStatusPage />);

    expect(await screen.findByText('Unreachable')).toBeInTheDocument();
    expect(screen.getByText(/could not be reached/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check again' })).toBeEnabled();
  });
});
