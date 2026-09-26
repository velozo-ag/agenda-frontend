import { http, HttpResponse } from 'msw';

export const paymentHandlers = [
  http.post('*/api/v1/payments/checkout', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Cobro completado exitosamente',
      data: {
        orderId: body.orderId,
        orderTotal: 15000,
        tipAmount: body.tipAmount || 0,
        totalPaid: (15000 + (body.tipAmount || 0)),
        totalChange: 5000,
        payments: body.payments,
        closedAt: new Date().toISOString(),
      },
    });
  }),

  http.get('*/api/v1/payments/shift/:shiftId', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 1,
          orderId: 101,
          method: 'EFECTIVO',
          amount: 8500,
          cashReceived: 10000,
          changeReturned: 1500,
          paidAt: new Date().toISOString(),
          processorName: 'Admin',
        },
      ],
    });
  }),

  http.get('*/api/v1/payments/order/:orderId', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 1,
          orderId: 101,
          method: 'EFECTIVO',
          amount: 8500,
          cashReceived: 10000,
          changeReturned: 1500,
          paidAt: new Date().toISOString(),
          processorName: 'Admin',
        },
      ],
    });
  }),
];
