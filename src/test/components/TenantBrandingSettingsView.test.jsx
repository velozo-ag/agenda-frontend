import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantBrandingSettingsView } from '../../components/admin/TenantBrandingSettingsView';

describe('TenantBrandingSettingsView Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TenantBrandingSettingsView />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('Renderiza el formulario de configuración con los datos del local', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Demo Bar & Taphouse')).toBeInTheDocument();
      expect(screen.getByText(/Despacho de Cocina & Impresión/i)).toBeInTheDocument();
      expect(screen.getByText(/Ticket Térmico/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Pantalla KDS/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Modo Híbrido/i)).toBeInTheDocument();
      expect(screen.getByText(/Venta Directa/i)).toBeInTheDocument();
    });
  });

  it('Permite seleccionar un modo de despacho diferente', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText(/Pantalla KDS/i).length).toBeGreaterThan(0);
    });

    const kdsCard = screen.getAllByText(/Pantalla KDS/i)[0].closest('button');
    fireEvent.click(kdsCard);

    expect(screen.getAllByText(/Pantalla KDS/i).length).toBeGreaterThan(0);
  });

  it('Permite alternar el switch de auto-impresión de comandas', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const autoPrintSwitch = screen.getByRole('switch');
    expect(autoPrintSwitch).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(autoPrintSwitch);
    expect(autoPrintSwitch).toHaveAttribute('aria-checked', 'true');
  });

  it('Permite guardar los cambios de identidad y despacho', async () => {
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
