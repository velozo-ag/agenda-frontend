import { http, HttpResponse } from 'msw';

export const mockTables = [
  {
    id: 1,
    name: 'Mesa 1',
    sectorId: 1,
    sectorName: 'Salón',
    capacity: 4,
    pax: 0,
    status: 'FREE',
    activeOrderId: null,
    activeOrderTotal: 0,
    activeOrderItemCount: 0,
    active: true,
  },
  {
    id: 2,
    name: 'Mesa 2',
    sectorId: 1,
    sectorName: 'Salón',
    capacity: 4,
    pax: 2,
    status: 'OCCUPIED',
    activeOrderId: 101,
    activeOrderTotal: 8500,
    activeOrderItemCount: 2,
    active: true,
  },
  {
    id: 3,
    name: 'Mesa 3',
    sectorId: 2,
    sectorName: 'Patio',
    capacity: 6,
    pax: 4,
    status: 'WAITING_BILL',
    activeOrderId: 102,
    activeOrderTotal: 15400,
    activeOrderItemCount: 4,
    active: true,
  },
];

export const mockSectors = [
  { id: 1, name: 'Salón', displayOrder: 1, active: true },
  { id: 2, name: 'Patio', displayOrder: 2, active: true },
];

export const tableHandlers = [
  http.get('*/api/v1/tables', () => {
    return HttpResponse.json({
      success: true,
      data: mockTables,
    });
  }),

  http.get('*/api/v1/sectors', () => {
    return HttpResponse.json({
      success: true,
      data: mockSectors,
    });
  }),

  http.post('*/api/v1/tables/:id/open', async ({ params, request }) => {
    const { pax, waiter } = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Mesa abierta exitosamente',
      data: {
        id: Number(params.id),
        name: `Mesa ${params.id}`,
        status: 'OCCUPIED',
        pax: pax || 2,
        waiter: waiter || 'Admin',
        activeOrderId: 200,
      },
    });
  }),
];
