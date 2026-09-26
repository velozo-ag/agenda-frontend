import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { LoginPage } from '../../pages/LoginPage';

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Login exitoso guarda token en localStorage y redirige', async () => {
    renderLoginPage();

    const userInput = screen.getByPlaceholderText('admin');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /ingresar al sistema/i });

    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'admin123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(localStorage.getItem('pos_token')).toBe('mock-jwt-token-xyz');
    });
  });

  it('Login con credenciales incorrectas muestra mensaje de error', async () => {
    renderLoginPage();

    const userInput = screen.getByPlaceholderText('admin');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /ingresar al sistema/i });

    fireEvent.change(userInput, { target: { value: 'wronguser' } });
    fireEvent.change(passInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  it('Muestra error si se intenta enviar el formulario con campos vacíos', async () => {
    renderLoginPage();

    const userInput = screen.getByPlaceholderText('admin');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /ingresar al sistema/i });

    fireEvent.change(userInput, { target: { value: '' } });
    fireEvent.change(passInput, { target: { value: '' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Por favor complete todos los campos/i)).toBeInTheDocument();
  });
});
