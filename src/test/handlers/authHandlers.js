import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const { username, password } = await request.json();
    if (username === 'admin' && password === 'admin123') {
      return HttpResponse.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token: 'mock-jwt-token-xyz',
          type: 'Bearer',
          id: 1,
          username: 'admin',
          fullName: 'Administrador',
          role: 'ADMIN',
        },
      });
    }
    return HttpResponse.json(
      {
        success: false,
        message: 'Credenciales inválidas',
        errorCode: 'INVALID_CREDENTIALS',
      },
      { status: 401 }
    );
  }),

  http.get('*/api/v1/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        username: 'admin',
        fullName: 'Administrador',
        role: 'ADMIN',
      },
    });
  }),
];
