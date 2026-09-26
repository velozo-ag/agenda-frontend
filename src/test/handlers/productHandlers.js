import { http, HttpResponse } from 'msw';

export const mockCategories = [
  { id: 1, name: 'Cervezas', displayOrder: 1, active: true },
  { id: 2, name: 'Hamburguesas', displayOrder: 2, active: true },
  { id: 3, name: 'Tragos', displayOrder: 3, active: true },
];

export const mockProducts = [
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Cervezas',
    name: 'IPA Artesanal',
    description: 'Pinta 500ml',
    price: 3500.0,
    available: true,
    active: true,
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: 'Cervezas',
    name: 'Golden Ale',
    description: 'Pinta 500ml',
    price: 3200.0,
    available: true,
    active: true,
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: 'Hamburguesas',
    name: 'Burger Doble Cheddar',
    description: 'Con papas fritas',
    price: 8500.0,
    available: true,
    active: true,
  },
];

export const mockMenuCategories = [
  {
    id: 1,
    name: 'Cervezas',
    displayOrder: 1,
    items: [
      {
        id: 1,
        name: 'IPA Artesanal',
        description: 'Pinta 500ml',
        price: 3500.0,
        available: true,
        imageUrl: null,
      },
      {
        id: 2,
        name: 'Golden Ale',
        description: 'Pinta 500ml',
        price: 3200.0,
        available: true,
        imageUrl: null,
      },
    ],
  },
  {
    id: 2,
    name: 'Hamburguesas',
    displayOrder: 2,
    items: [
      {
        id: 3,
        name: 'Burger Doble Cheddar',
        description: 'Con papas fritas',
        price: 8500.0,
        available: true,
        imageUrl: null,
      },
    ],
  },
];

export const productHandlers = [
  http.get('*/api/v1/menu', () => {
    return HttpResponse.json({
      success: true,
      data: mockMenuCategories,
    });
  }),

  http.get('*/api/v1/categories', () => {
    return HttpResponse.json({
      success: true,
      data: mockCategories,
    });
  }),

  http.get('*/api/v1/products', () => {
    return HttpResponse.json({
      success: true,
      data: mockProducts,
    });
  }),

  http.patch('*/api/v1/products/:id/toggle-availability', ({ params }) => {
    const prod = mockProducts.find((p) => p.id === Number(params.id)) || mockProducts[0];
    return HttpResponse.json({
      success: true,
      data: { ...prod, available: !prod.available },
    });
  }),
];
