import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantBrandingSettingsView } from '../../components/admin/TenantBrandingSettingsView';
import { AuthProvider } from '../../context/AuthContext';

describe('TenantBrandingSettingsView Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('pos_token', 'mock');
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <TenantBrandingSettingsView />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('Renderiza el formulario de configuración', async () => {
    renderComponent();

    try {
      const el = await screen.findByDisplayValue('Demo Bar & Taphouse');
      expect(el).toBeInTheDocument();
    } catch (e) {
      screen.debug();
      throw e;
    }
  });

  it('Permite guardar los cambios de identidad', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Guardar Identidad de Marca/i })).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /Guardar Identidad de Marca/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Identidad de marca guardada exitosamente/i)).toBeInTheDocument();
    });
  });
});
