import { http, HttpResponse } from 'msw';

export const mockKitchenOrders = [
  {
    id: 101,
    tableId: 2,
    tableName: 'Mesa 2',
    sectorName: 'Salón',
    waiterName: 'Admin',
    kitchenNotes: 'Mesa con reserva',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    totalItems: 2,
    pendingItems: 1,
    allReady: false,
    items: [
      {
        id: 201,
        orderId: 101,
        productId: 1,
        productName: 'Hamburguesa Doble',
        quantity: 2,
        notes: 'Sin cebolla',
        ready: false,
        sentToKitchen: true,
        sentToKitchenAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 202,
        orderId: 101,
        productId: 2,
        productName: 'Papas con Cheddar',
        quantity: 1,
        notes: null,
        ready: true,
        sentToKitchen: true,
        sentToKitchenAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: 102,
    tableId: 5,
    tableName: 'Mesa 5',
    sectorName: 'Patio',
    waiterName: 'Mozo 1',
    kitchenNotes: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 min ago (demorado)
    totalItems: 1,
    pendingItems: 1,
    allReady: false,
    items: [
      {
        id: 203,
        orderId: 102,
        productId: 3,
        productName: 'Pizza Napolitana',
        quantity: 1,
        notes: 'Bien cocida',
        ready: false,
        sentToKitchen: true,
        sentToKitchenAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
    ],
  },
  {
    id: 103,
    type: 'DELIVERY',
    tableName: 'Delivery - Lucas Silva',
    sectorName: 'Envíos a Domicilio',
    customerName: 'Lucas Silva',
    customerPhone: '11-4567-8901',
    deliveryAddress: 'Av. Corrientes 1234',
    kitchenNotes: 'Sin aderezos',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    totalItems: 1,
    pendingItems: 1,
    allReady: false,
    items: [
      {
        id: 204,
        orderId: 103,
        productId: 4,
        productName: 'Milanesa a Caballo',
        quantity: 1,
        notes: null,
        ready: false,
        sentToKitchen: true,
        sentToKitchenAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ],
  },
];

export const kitchenHandlers = [
  http.get('*/api/v1/orders/kitchen', () => {
    return HttpResponse.json({
      success: true,
      data: mockKitchenOrders,
    });
  }),

  http.patch('*/api/v1/orders/:orderId/items/:itemId/ready', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Plato marcado como listo',
      data: {
        id: Number(params.orderId),
        items: [],
      },
    });
  }),

  http.patch('*/api/v1/orders/:orderId/ready-all', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Todos los ítems marcados como listos',
      data: {
        id: Number(params.orderId),
        items: [],
      },
    });
  }),
];
