import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuperAdminPage } from '../../pages/SuperAdminPage';
import { AuthContext } from '../../context/AuthContext';

describe('SuperAdminPage Component', () => {
  let queryClient;

  const mockAuthContext = {
    user: { id: 99, username: 'superadmin', fullName: 'Super Admin', role: 'SUPER_ADMIN' },
    isAuthenticated: true,
  };

  beforeEach(() => {
    localStorage.setItem('pos_token', 'mock-token');
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <SuperAdminPage />
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('Renderiza la cabecera y el panel de SuperAdmin', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Panel Super-Administrador/i)).toBeInTheDocument();
      expect(screen.getByText(/SAAS MASTER/i)).toBeInTheDocument();
    });
  });

  it('Abre el modal de provisión al hacer clic en "Dar de Alta Nuevo Local" y muestra planes', async () => {
    renderComponent();

    const newLocalButton = await screen.findByRole('button', { name: /Dar de Alta Nuevo Local/i });
    fireEvent.click(newLocalButton);

    expect(screen.getByRole('heading', { name: /Dar de Alta Nuevo Local/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Starter Takeaway/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pro Salón/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Business Enterprise/i).length).toBeGreaterThan(0);
  });

  it('Permite buscar un local en el filtro', async () => {
    renderComponent();

    const searchInput = await screen.findByPlaceholderText(/Buscar por nombre o subdominio/i);
    fireEvent.change(searchInput, { target: { value: 'Demo' } });

    expect(searchInput.value).toBe('Demo');
  });

  describe('Tab Demos', () => {
    it('renderiza la lista de demos con su estado y días restantes', async () => {
      renderComponent();

      const demosTabButton = await screen.findByRole('button', { name: /Demos/i });
      fireEvent.click(demosTabButton);

      expect(await screen.findByText('Pipeline de Demos')).toBeInTheDocument();
      expect(await screen.findByText('Demo Burger Bar')).toBeInTheDocument();
      expect(screen.getByText(/5d restantes/i)).toBeInTheDocument();
      expect(screen.getByText(/🟢 Activo/i)).toBeInTheDocument();
    });

    it('muestra botón "Extender" y abre modal para sumar días', async () => {
      renderComponent();

      const demosTabButton = await screen.findByRole('button', { name: /Demos/i });
      fireEvent.click(demosTabButton);

      const extendButton = await screen.findByRole('button', { name: /Extender/i });
      fireEvent.click(extendButton);

      expect(await screen.findByText(/Extender Trial/i)).toBeInTheDocument();
    });

    it('muestra botón "Convertir a Pago" y abre modal con selector de plan', async () => {
      renderComponent();

      const demosTabButton = await screen.findByRole('button', { name: /Demos/i });
      fireEvent.click(demosTabButton);

      const convertButton = await screen.findByRole('button', { name: /Convertir a Pago/i });
      fireEvent.click(convertButton);

      expect(await screen.findByText(/Elegir el plan real del cliente/i)).toBeInTheDocument();
    });

    it('muestra botón "Reenviar Email" y abre modal de reenvío', async () => {
      renderComponent();

      const demosTabButton = await screen.findByRole('button', { name: /Demos/i });
      fireEvent.click(demosTabButton);

      const resendButton = await screen.findByRole('button', { name: /Reenviar Email/i });
      fireEvent.click(resendButton);

      expect(await screen.findByText(/Reenviar Email de Bienvenida/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enviar Ahora/i })).toBeInTheDocument();
    });
  });

  describe('Tab Stats', () => {
    it('muestra KPIs globales de SaaS (total tenants, demos activos, facturación)', async () => {
      renderComponent();

      const statsTabButton = await screen.findByRole('button', { name: /Stats/i });
      fireEvent.click(statsTabButton);

      expect(await screen.findByText('Dashboard SaaS')).toBeInTheDocument();
      expect(await screen.findByText('Total Locales')).toBeInTheDocument();
      expect(screen.getByText('Demos Activos')).toBeInTheDocument();
      expect(screen.getByText('Facturación Total')).toBeInTheDocument();
    });

    it('muestra lista de tenants sin actividad si existen', async () => {
      renderComponent();

      const statsTabButton = await screen.findByRole('button', { name: /Stats/i });
      fireEvent.click(statsTabButton);

      expect(await screen.findByText(/⚠️ Sin Actividad hace más de 14 días/i)).toBeInTheDocument();
      expect(screen.getByText(/20d sin actividad/i)).toBeInTheDocument();
    });
  });

  describe('Acciones en tarjetas de Tenant', () => {
    it('muestra badge "Sin actividad" si daysSinceLastActivity > 14', async () => {
      renderComponent();

      await screen.findByText('Demo Bar');
      expect(screen.getByText(/⚠️ Sin actividad/i)).toBeInTheDocument();
    });

    it('muestra badge "Turno Abierto" si hasOpenShift es true', async () => {
      renderComponent();

      await screen.findByText('Bar Central');
      expect(screen.getByText(/🟢 Turno Abierto/i)).toBeInTheDocument();
    });

    it('abre modal de reset password al hacer click en el botón', async () => {
      renderComponent();

      await screen.findByText('Bar Central');
      const resetButtons = screen.getAllByRole('button', { name: /Reset PW/i });
      fireEvent.click(resetButtons[0]);

      expect(await screen.findByPlaceholderText(/Nueva contraseña \(mínimo 6 caracteres\)/i)).toBeInTheDocument();
    });

    it('solo muestra botón "Eliminar" en tenants demo', async () => {
      renderComponent();

      await screen.findByText('Demo Bar');
      const deleteButtons = screen.getAllByRole('button', { name: /^Eliminar$/i });
      expect(deleteButtons).toHaveLength(1);
    });
  });
});
