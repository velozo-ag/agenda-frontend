import { http, HttpResponse } from 'msw';

export const mockDemoRegisterResponse = {
  slug: 'burger-bros',
  token: 'mock-jwt-demo-token',
  expiresAt: '2026-09-10T12:00:00',
  user: {
    id: 99,
    username: 'burger-bros',
    fullName: 'Burger Bros',
    role: 'ADMIN',
    active: true,
  },
  adminUrl: 'http://localhost:5173/auto-login',
  menuUrl: 'http://localhost:5173/menu',
  credentials: {
    username: 'burger-bros',
    password: 'demo1234',
  },
  demoTrialEndsAt: '2026-09-10T12:00:00',
  demoPurgeAt: '2026-09-17T12:00:00',
};

export const demoHandlers = [
  http.post('*/api/v1/demo/register', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Demo creada exitosamente',
      data: {
        ...mockDemoRegisterResponse,
        slug: body.businessName ? body.businessName.toLowerCase().replace(/\s+/g, '-') : 'demo',
      },
    }, { status: 201 });
  }),
];
