import { http, HttpResponse } from 'msw';

export const mockSuperAdminTenants = [
  {
    id: 1,
    name: 'Demo Bar & Taphouse',
    storeName: 'Demo Bar & Taphouse',
    slug: 'demo-bar',
    active: true,
    isDemo: false,
    hasDelivery: true,
    hasTables: true,
    hasKds: true,
    hasQrMenu: true,
    maxTables: 30,
    maxUsers: 15,
    planType: 'PRO_SALON',
    createdAt: new Date().toISOString(),
    totalProducts: 45,
    totalCategories: 6,
    totalTables: 15,
    totalStaff: 4,
    totalOrders: 320,
    totalOrdersCount: 320,
    totalRevenue: 2850000.0,
    revenueThisMonth: 850000.0,
    daysSinceLastActivity: 2,
    hasOpenShift: true,
    contactWhatsapp: '+5491144445555',
    contactEmail: 'demo@bar.com',
  },
  {
    id: 2,
    name: 'Craft Cervecería',
    storeName: 'Craft Cervecería',
    slug: 'craft-beer',
    active: false,
    isDemo: true,
    hasDelivery: false,
    hasTables: true,
    hasKds: false,
    hasQrMenu: true,
    maxTables: 8,
    maxUsers: 5,
    planType: 'STARTER_TAKEAWAY',
    createdAt: new Date().toISOString(),
    totalProducts: 20,
    totalCategories: 3,
    totalTables: 8,
    totalStaff: 2,
    totalOrders: 50,
    totalOrdersCount: 50,
    totalRevenue: 420000.0,
    revenueThisMonth: 120000.0,
    daysSinceLastActivity: 20,
    hasOpenShift: false,
    contactWhatsapp: null,
    contactEmail: 'craft@beer.com',
  },
];

export const superAdminHandlers = [
  http.get('*/api/v1/superadmin/tenants', () => {
    return HttpResponse.json({
      success: true,
      data: mockSuperAdminTenants,
    });
  }),

  http.post('*/api/v1/superadmin/tenants', async ({ request }) => {
    const body = await request.json();
    const newTenant = {
      id: Date.now(),
      name: body.name || 'Nuevo Bar',
      slug: body.slug || 'nuevo-bar',
      active: true,
      createdAt: new Date().toISOString(),
      totalProducts: 0,
      totalCategories: 0,
      totalTables: 0,
      totalStaff: 1,
      totalOrdersCount: 0,
      totalRevenue: 0.0,
    };
    return HttpResponse.json({
      success: true,
      message: 'Local gastronómico provisionado exitosamente',
      data: newTenant,
    });
  }),

  http.patch('*/api/v1/superadmin/tenants/:id/toggle-active', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Estado del local actualizado',
      data: {
        id: Number(params.id),
        active: false,
      },
    });
  }),

  http.post('*/api/v1/superadmin/tenants/:id/import-menu', () => {
    return HttpResponse.json({
      success: true,
      message: 'Carta importada exitosamente',
      data: {
        categoriesCount: 5,
        productsCount: 30,
      },
    });
  }),

  // Demos
  http.get('*/api/v1/superadmin/demos', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 10,
          name: 'Demo Pizza Local',
          storeName: 'Demo Pizza Local',
          slug: 'demo-pizza',
          contactEmail: 'owner@pizza.com',
          contactWhatsapp: '+5491144445555',
          ownerName: 'Carlos Pérez',
          demoStatus: 'ACTIVE',
          demoTrialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          demoPurgeAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemainingTrial: 3,
          daysUntilPurge: 10,
          totalOrdersPaid: 5,
          lastOrderAt: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: 11,
          name: 'Demo Cafe Expirado',
          storeName: 'Café Central Demo',
          slug: 'cafe-demo',
          contactEmail: 'owner@cafe.com',
          contactWhatsapp: null,
          ownerName: 'María López',
          demoStatus: 'EXPIRED',
          demoTrialEndsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          demoPurgeAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemainingTrial: 0,
          daysUntilPurge: 5,
          totalOrdersPaid: 0,
          lastOrderAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.patch('*/api/v1/superadmin/demos/:tenantId/extend', async ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: params.tenantId, daysRemainingTrial: 10 },
    });
  }),

  http.post('*/api/v1/superadmin/demos/:tenantId/convert', async ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: params.tenantId, isDemo: false },
    });
  }),

  http.post('*/api/v1/superadmin/demos/:tenantId/resend-email', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({
      success: true,
      data: body.email || 'agusvelozo04@gmail.com',
      message: 'Email de bienvenida reenviado exitosamente',
    });
  }),

  // Tenants actions
  http.put('*/api/v1/superadmin/tenants/:tenantId', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { id: 1, ...body },
    });
  }),

  http.patch('*/api/v1/superadmin/tenants/:tenantId/reset-admin-password', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Contraseña reseteada correctamente',
    });
  }),

  http.delete('*/api/v1/superadmin/tenants/:tenantId', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Tenant eliminado',
    });
  }),

  // Stats
  http.get('*/api/v1/superadmin/stats/global', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalTenants: 5,
        activeTenants: 4,
        suspendedTenants: 1,
        demoTenantsActive: 2,
        demoTenantsExpired: 1,
        realTenants: 2,
        totalRevenue: 285000.0,
        totalOrdersPaid: 350,
        avgOrderValue: 814.29,
        tenantsWithOpenShift: 1,
        totalProducts: 120,
        totalUsers: 18,
      },
    });
  }),

  // Shifts
  http.get('*/api/v1/superadmin/shifts/open', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          shiftId: 5,
          tenantId: 2,
          tenantName: 'Bar El Parroón',
          tenantSlug: 'el-parron',
          openedByUsername: 'admin-parron',
          openedByFullName: 'Carlos García',
          openedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          elapsedMinutes: 120,
          initialFund: 5000.0,
          currentOrdersPaid: 8,
          currentCashSales: 12500.0,
        },
      ],
    });
  }),

  // Audit
  http.get('*/api/v1/superadmin/audit', () => {
    return HttpResponse.json({
      success: true,
      data: {
        content: [
          {
            id: 1,
            actorUsername: 'SUPER_ADMIN',
            action: 'PROVISION',
            entityType: 'TENANT',
            entityId: 2,
            entityName: 'el-parron',
            details: null,
            createdAt: new Date().toISOString(),
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 50,
        number: 0,
      },
    });
  }),

  // Clone catalog
  http.post('*/api/v1/superadmin/tenants/:sourceId/clone-catalog-to/:targetId', async () => {
    return HttpResponse.json({
      success: true,
      data: { categoriesCloned: 4, productsCloned: 18 },
    });
  }),
];
