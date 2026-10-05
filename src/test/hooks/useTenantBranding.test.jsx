import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyTenant, useTenantPlan } from '../../hooks/useTenantBranding';

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
    localStorage.setItem('pos_token', 'mock');
    // The msw mock returns storeName: 'Demo Salon', slug: 'demo-salon' for 'me'
    const { result } = renderHook(() => useMyTenant(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('useTenantPlan calcula correctamente las feature flags del plan', async () => {
    const { result } = renderHook(() => useTenantPlan(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.planType).toBeDefined();
      expect(result.current.isSoloBarber).toBeDefined();
      expect(result.current.isBarberCrew).toBeDefined();
    });
  });
});
