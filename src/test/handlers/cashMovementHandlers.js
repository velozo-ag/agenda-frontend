import { http, HttpResponse } from 'msw';

export const mockCashMovements = [
  {
    id: 1,
    shiftId: 1,
    userId: 1,
    userName: 'Admin',
    type: 'INCOME',
    amount: 2000.0,
    reason: 'Cambio de billetes chicos inicial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    shiftId: 1,
    userId: 1,
    userName: 'Admin',
    type: 'EXPENSE',
    amount: 1500.0,
    reason: 'Compra de hielo urgente',
    createdAt: new Date().toISOString(),
  },
];

export const cashMovementHandlers = [
  http.get('*/api/v1/shifts/movements', () => {
    return HttpResponse.json({
      success: true,
      data: mockCashMovements,
    });
  }),

  http.post('*/api/v1/shifts/movements', async ({ request }) => {
    const body = await request.json();
    const newMovement = {
      id: Date.now(),
      shiftId: 1,
      userId: 1,
      userName: 'Admin',
      type: body.type,
      amount: body.amount,
      reason: body.reason,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      data: newMovement,
    });
  }),
];
