import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CashierPage } from '../../pages/CashierPage';
import { POSContext } from '../../context/POSContext';
import { AuthContext } from '../../context/AuthContext';

describe('CashierPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockShift = {
    id: 1,
    status: 'OPEN',
    openingFund: 10000,
    openedAt: '2026-08-16T12:00:00Z',
    cashierName: 'Admin',
    totalSales: 45000,
    cashSales: 20000,
    debitSales: 15000,
    creditSales: 5000,
    qrSales: 5000,
    totalIncomes: 2000,
    totalExpenses: 1500,
    expectedCash: 30500,
    ordersCount: 8,
  };

  const mockCashRegister = {
    isOpen: true,
    id: 1,
    openingAmount: 10000,
    cashierName: 'Admin',
    totalSales: 45000,
    salesCash: 20000,
    salesCard: 20000,
    salesQR: 5000,
    totalExpenses: 1500,
    expectedCashInDrawer: 30500,
  };

  const mockContext = {
    cashRegister: mockCashRegister,
    currentShift: mockShift,
    isLoadingShift: false,
    openCashRegister: vi.fn(),
    closeAndArchiveShift: vi.fn(),
    recordCashMovement: vi.fn(),
    tables: [],
    requestConfirmation: vi.fn(),
  };

  const mockAuthContext = {
    user: { id: 1, username: 'admin', fullName: 'Admin User', role: 'ADMIN' },
    isAuthenticated: true,
  };

  const renderComponent = (contextOverrides = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <POSContext.Provider value={{ ...mockContext, ...contextOverrides }}>
              <CashierPage />
            </POSContext.Provider>
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('Renderiza el resumen de caja del turno abierto con sus métricas', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /Cierre de Caja y Auditoría/i })).toBeInTheDocument();
    expect(screen.getByText(/Turno Activo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$45\.000/i).length).toBeGreaterThan(0);
  });

  it('Muestra el formulario de apertura cuando no hay turno activo', () => {
    renderComponent({
      currentShift: null,
      cashRegister: { isOpen: false, id: null },
    });

    expect(screen.getByText(/Turno de Caja Cerrado/i)).toBeInTheDocument();
    expect(screen.getByText(/Abrir Turno con/i)).toBeInTheDocument();
  });
});
