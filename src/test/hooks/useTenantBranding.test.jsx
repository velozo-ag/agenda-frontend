import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyTenant, useKitchenDispatchConfig, useTenantPlan } from '../../hooks/useTenantBranding';

describe('useTenantBranding Hooks', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it('useMyTenant retorna los datos del tenant autenticado', async () => {
    const { result } = renderHook(() => useMyTenant(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.storeName).toBe('Demo Bar & Taphouse');
    expect(result.current.data.slug).toBe('demo-bar');
    expect(result.current.data.kitchenDispatchMode).toBe('PRINT_TICKET');
  });

  it('useKitchenDispatchConfig retorna la configuración de despacho derivada', async () => {
    const { result } = renderHook(() => useKitchenDispatchConfig(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.dispatchMode).toBe('PRINT_TICKET');
      expect(result.current.isTicketMode).toBe(true);
      expect(result.current.isKitchenEnabled).toBe(true);
      expect(result.current.showKdsNav).toBe(false);
    });
  });

  it('useTenantPlan calcula correctamente las feature flags del plan', async () => {
    const { result } = renderHook(() => useTenantPlan(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.hasTables).toBeDefined();
      expect(result.current.hasKds).toBeDefined();
      expect(result.current.planType).toBeDefined();
    });
  });
});
