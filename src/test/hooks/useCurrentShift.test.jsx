import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentShift } from '../../hooks/useCurrentShift';

describe('useCurrentShift Hook', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('Obtiene el turno actual activo con sus métricas desde la API mockeada', async () => {
    const { result } = renderHook(() => useCurrentShift(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.status).toBe('OPEN');
    expect(result.current.data?.openingFund).toBe(10000);
    expect(result.current.data?.totalSales).toBe(45000);
  });
});
