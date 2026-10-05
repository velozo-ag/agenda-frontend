import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../server';
import { http, HttpResponse } from 'msw';
import { DemoExpiredPage } from '../../pages/DemoExpiredPage';

function renderDemoExpiredPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DemoExpiredPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('DemoExpiredPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza título de vencimiento, nombre del local y link de WhatsApp de contratación', async () => {
    server.use(
      http.get('*/api/v1/tenant/public', () => {
        return HttpResponse.json({
          success: true,
          data: {
            id: 1,
            name: 'Cafetería Central',
            storeName: 'Cafetería Central',
            slug: 'cafe-central',
            isDemo: true,
            demoStatus: 'EXPIRED',
            demoPurgeAt: '2026-09-20T12:00:00',
          },
        });
      })
    );

    renderDemoExpiredPage();

    await waitFor(() => {
      expect(screen.getByText(/Período de prueba finalizado/i)).toBeInTheDocument();
      expect(screen.getByText(/Cafetería Central/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /activar roosty pos definitivo/i })).toBeInTheDocument();
    });

    const whatsappLink = screen.getByRole('link', { name: /activar roosty pos definitivo/i });
    expect(whatsappLink.getAttribute('href')).toContain('cafe-central');
  });
});
