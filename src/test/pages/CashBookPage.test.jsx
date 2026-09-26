import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CashBookPage } from '../../pages/CashBookPage';
import { POSContext } from '../../context/POSContext';
import { AuthContext } from '../../context/AuthContext';

describe('CashBookPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockCashRegister = {
    isOpen: true,
    id: 1,
    openedAt: '2026-08-16T12:00:00Z',
    openingAmount: 10000,
    currentCash: 30500,
  };

  const mockPOSContext = {
    cashRegister: mockCashRegister,
    currentShift: { id: 1, status: 'OPEN' },
    recordCashMovement: vi.fn(),
  };

  const mockAuthContext = {
    user: { id: 1, username: 'admin', fullName: 'Admin User', role: 'ADMIN' },
    isAuthenticated: true,
  };

  it('Renderiza la cabecera del libro diario y botones de acción', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <POSContext.Provider value={mockPOSContext}>
              <CashBookPage />
            </POSContext.Provider>
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { name: /Libro Diario/i })).toBeInTheDocument();
    expect(screen.getByText(/Ingreso Extra/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrar Egreso/i)).toBeInTheDocument();
  });
});
