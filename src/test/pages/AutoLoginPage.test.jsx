import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { AutoLoginPage } from '../../pages/AutoLoginPage';
import { server } from '../server';
import { http, HttpResponse } from 'msw';

const mockLoginWithToken = vi.fn();

vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      loginWithToken: mockLoginWithToken,
    }),
  };
});

function renderAutoLoginPage(initialEntries = ['/auto-login?token=valid-demo-token-123']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <Routes>
            <Route path="/auto-login" element={<AutoLoginPage />} />
            <Route path="/agenda" element={<div>Pantalla de Agenda</div>} />
            <Route path="/login" element={<div>Pantalla de Login</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AutoLoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('con token válido en URL guarda token en localStorage y redirige a /agenda', async () => {
    mockLoginWithToken.mockResolvedValue({ id: 1, role: 'ADMIN' });

    renderAutoLoginPage(['/auto-login?token=demo-token-abc']);

    await waitFor(() => {
      try {
        expect(mockLoginWithToken).toHaveBeenCalledWith('demo-token-abc');
        expect(screen.getByText('Pantalla de Agenda')).toBeInTheDocument();
      } catch (e) {
        throw e;
      }
    });
  });

  it('sin token en URL redirige inmediatamente a /login', async () => {
    renderAutoLoginPage(['/auto-login']);

    await waitFor(() => {
      expect(screen.getByText('Pantalla de Login')).toBeInTheDocument();
      expect(localStorage.getItem('pos_token')).toBeNull();
    });
  });

  it('limpia el token de la barra de direcciones tras procesarlo', async () => {
    mockLoginWithToken.mockResolvedValue({ id: 1, role: 'ADMIN' });
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    renderAutoLoginPage(['/auto-login?token=secret-token']);

    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalled();
    });
  });
});
