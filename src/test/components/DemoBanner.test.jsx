import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../server';
import { http, HttpResponse } from 'msw';
import { DemoBanner } from '../../components/layout/DemoBanner';

function renderDemoBanner() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DemoBanner />
    </QueryClientProvider>
  );
}

describe('DemoBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pos_token', 'mock-token');
  });

  it('se muestra cuando el tenant es demo y su estado es ACTIVE', async () => {
    server.use(
      http.get('*/api/v1/tenant/me', () => {
        return HttpResponse.json({
          success: true,
          data: {
            id: 1,
            name: 'Demo Burger Local',
            storeName: 'Demo Burger Local',
            slug: 'demo-burger',
            isDemo: true,
            demoStatus: 'ACTIVE',
            demoTrialEndsAt: '2026-09-10T12:00:00',
          },
        });
      })
    );

    renderDemoBanner();

    await waitFor(() => {
      expect(screen.getByText(/Modo Playground/i)).toBeInTheDocument();
      expect(screen.getByText(/Activar mi cuenta/i)).toBeInTheDocument();
    });

    const link = screen.getByRole('link', { name: /activar mi cuenta/i });
    expect(link.getAttribute('href')).toContain('demo-burger');
  });

  it('se oculta cuando el tenant no es demo (isDemo = false)', async () => {
    server.use(
      http.get('*/api/v1/tenant/me', () => {
        return HttpResponse.json({
          success: true,
          data: {
            id: 1,
            name: 'Bar Real',
            storeName: 'Bar Real',
            slug: 'bar-real',
            isDemo: false,
            demoStatus: null,
          },
        });
      })
    );

    renderDemoBanner();

    await waitFor(() => {
      expect(screen.queryByText(/Modo Playground/i)).not.toBeInTheDocument();
    });
  });
});
