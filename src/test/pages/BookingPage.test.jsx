import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingPage } from '../../pages/BookingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../hooks/useBooking', () => ({
  usePublicServices: () => ({ data: { data: [] }, isLoading: false }),
  usePublicCategories: () => ({ data: { data: [] } }),
  usePublicBarbers: () => ({ data: { data: [] }, isLoading: false }),
  usePublicAvailableSlots: () => ({ data: { data: [] }, isLoading: false }),
  useAvailableDaysForService: () => ({ daysWithSlots: new Set(), isCheckingDays: false }),
  useCreatePublicAppointment: () => ({ mutate: vi.fn(), isPending: false }),
  useSalonInfo: () => ({ data: { data: { name: 'Test Salon' } }, isLoading: false }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null })
}));

const queryClient = new QueryClient();

describe('BookingPage', () => {
  it('renders correctly without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookingPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Initial step is 0, so it should render the hero section
    expect(screen.getByText(/Test Salon/i)).toBeInTheDocument();
    expect(screen.getByText(/Reservar Turno/i)).toBeInTheDocument();
  });
});
