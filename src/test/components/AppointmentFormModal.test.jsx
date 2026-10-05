import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppointmentFormModal } from '../../components/agenda/AppointmentFormModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../hooks/useSalonServices', () => ({
  useSalonServices: () => ({ services: [], isLoading: false })
}));

vi.mock('../../../hooks/useBarbers', () => ({
  useBarbers: () => ({ barbers: [], isLoading: false })
}));

vi.mock('../../../hooks/useAppointments', () => ({
  useCreateAppointment: () => ({ mutate: vi.fn(), isPending: false })
}));

vi.mock('../../../hooks/useTenantUsage', () => ({
  useTenantUsage: () => ({ data: { limitReached: false } })
}));

const queryClient = new QueryClient();

describe('AppointmentFormModal', () => {
  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppointmentFormModal onClose={() => {}} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Nuevo Turno')).toBeInTheDocument();
  });
});
