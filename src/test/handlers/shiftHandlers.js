import { http, HttpResponse } from 'msw';

export const mockCurrentShift = {
  id: 1,
  userId: 1,
  cashierName: 'Admin',
  status: 'OPEN',
  openingFund: 10000.0,
  openedAt: new Date().toISOString(),
  closedAt: null,
  totalSales: 45000.0,
  cashSales: 20000.0,
  debitSales: 15000.0,
  creditSales: 5000.0,
  qrSales: 5000.0,
  totalIncomes: 2000.0,
  totalExpenses: 1500.0,
  expectedCash: 30500.0, // 10000 + 20000 + 2000 - 1500
  actualCash: null,
  difference: null,
  ordersCount: 8,
};

export const shiftHandlers = [
  http.get('*/api/v1/shifts/current', () => {
    return HttpResponse.json({
      success: true,
      data: mockCurrentShift,
    });
  }),

  http.post('*/api/v1/shifts/open', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...mockCurrentShift,
        openingFund: body.openingFund || 10000.0,
        openedAt: new Date().toISOString(),
        totalSales: 0.0,
        cashSales: 0.0,
        ordersCount: 0,
      },
    });
  }),

  http.post('*/api/v1/shifts/close', async ({ request }) => {
    const body = await request.json();
    const actualCash = body.actualCash ?? 30500.0;
    return HttpResponse.json({
      success: true,
      data: {
        ...mockCurrentShift,
        status: 'CLOSED',
        closedAt: new Date().toISOString(),
        actualCash,
        difference: actualCash - mockCurrentShift.expectedCash,
        notes: body.notes || 'Cierre de turno normal',
      },
    });
  }),

  http.get('*/api/v1/shifts/history', () => {
    return HttpResponse.json({
      success: true,
      data: {
        content: [
          {
            ...mockCurrentShift,
            status: 'CLOSED',
            closedAt: new Date().toISOString(),
            actualCash: 30500.0,
            difference: 0.0,
          },
        ],
        totalPages: 1,
        totalElements: 1,
        size: 10,
        number: 0,
      },
    });
  }),
];
