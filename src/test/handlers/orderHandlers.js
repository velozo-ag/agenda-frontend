import { http, HttpResponse } from 'msw';

export const mockOrderItem1 = {
  id: 201,
  orderId: 101,
  productId: 1,
  productName: 'IPA Artesanal',
  quantity: 2,
  unitPrice: 3500.0,
  subtotal: 7000.0,
  notes: null,
};

export const mockOrderItem2 = {
  id: 202,
  orderId: 101,
  productId: 2,
  productName: 'Golden Ale',
  quantity: 1,
  unitPrice: 3200.0,
  subtotal: 3200.0,
  notes: 'Sin hielo',
};

export const mockActiveOrder = {
  id: 101,
  tableId: 2,
  tableName: 'Mesa 2',
  type: 'DINE_IN',
  status: 'OPEN',
  pax: 2,
  waiterName: 'Admin',
  items: [mockOrderItem1, mockOrderItem2],
  subtotal: 10200.0,
  discount: 0.0,
  total: 10200.0,
  kitchenNotes: 'Mesa con reserva',
  createdAt: new Date().toISOString(),
};

export const mockQuickSaleOrder = {
  id: 105,
  tableId: null,
  tableName: 'Venta Rápida / Mostrador',
  type: 'QUICK_SALE',
  status: 'OPEN',
  pax: 1,
  waiterName: 'Admin',
  items: [],
  subtotal: 0.0,
  discount: 0.0,
  total: 0.0,
  kitchenNotes: null,
  createdAt: new Date().toISOString(),
};

export const orderHandlers = [
  http.get('*/api/v1/orders/table/:tableId', ({ params }) => {
    const tableId = Number(params.tableId);
    if (tableId === 2) {
      return HttpResponse.json({
        success: true,
        data: mockActiveOrder,
      });
    }
    // Mesa libre o sin orden activa
    return HttpResponse.json({
      success: true,
      data: null,
    });
  }),

  http.get('*/api/v1/orders/:id', ({ params }) => {
    if (params.id === 'kitchen' || isNaN(Number(params.id))) {
      return;
    }
    const id = Number(params.id);
    if (id === 101) {
      return HttpResponse.json({ success: true, data: mockActiveOrder });
    }
    if (id === 105) {
      return HttpResponse.json({ success: true, data: mockQuickSaleOrder });
    }
    return HttpResponse.json({ success: true, data: { ...mockActiveOrder, id } });
  }),

  http.post('*/api/v1/orders/quick-sale', () => {
    return HttpResponse.json({
      success: true,
      data: mockQuickSaleOrder,
    });
  }),

  http.post('*/api/v1/orders/:id/items', async ({ request, params }) => {
    const body = await request.json();
    const newItem = {
      id: Date.now(),
      orderId: Number(params.id),
      productId: body.productId || 1,
      productName: 'Producto Agregado',
      quantity: body.quantity || 1,
      unitPrice: 3500.0,
      subtotal: (body.quantity || 1) * 3500.0,
      notes: body.notes || null,
    };
    return HttpResponse.json({
      success: true,
      data: newItem,
    });
  }),

  http.put('*/api/v1/orders/:id/items/:itemId/quantity', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...mockOrderItem1,
        id: Number(params.itemId),
        quantity: body.quantity,
        subtotal: body.quantity * 3500.0,
      },
    });
  }),

  http.patch('*/api/v1/orders/:id/items/:itemId/notes', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        ...mockOrderItem1,
        id: Number(params.itemId),
        notes: body.notes,
      },
    });
  }),

  http.delete('*/api/v1/orders/:id/items/:itemId', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('*/api/v1/orders/:id/items', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/api/v1/orders/:id/march', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Tanda marchada a cocina exitosamente',
      data: {
        orderId: Number(params.id),
        tableName: 'Mesa 2',
        sectorName: 'Salón',
        waiterName: 'Admin',
        kitchenNotes: 'Mesa con reserva',
        marchedAt: new Date().toISOString(),
        totalNewlyMarchedItems: 2,
        newlyMarchedItems: [
          {
            id: 201,
            productId: 1,
            productName: 'IPA Artesanal',
            quantity: 2,
            notes: null,
            ready: false,
            sentToKitchen: true,
            sentToKitchenAt: new Date().toISOString(),
          },
          {
            id: 202,
            productId: 2,
            productName: 'Golden Ale',
            quantity: 1,
            notes: 'Sin hielo',
            ready: false,
            sentToKitchen: true,
            sentToKitchenAt: new Date().toISOString(),
          },
        ],
      },
    });
  }),
];
