import { http, HttpResponse } from 'msw';

export const mockTenantBranding = {
  id: 1,
  name: 'Demo Bar & Taphouse',
  slug: 'demo-bar',
  storeName: 'Demo Bar & Taphouse',
  heroTitle: 'Cervezas Artesanales & Cocina',
  heroSubtitle: 'Pedí desde tu mesa o descubrí nuestra carta digital',
  primaryColor: '#f59e0b',
  logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
  heroUrl: null,
  address: 'Av. Corrientes 1234, CABA',
  phone: '+54 11 1234-5678',
  instagramUrl: 'https://instagram.com/demobar',
  contactEmail: 'demo@bar.com',
  contactWhatsapp: '+5491144445555',
  kitchenDispatchMode: 'PRINT_TICKET',
  autoPrintKitchenTicket: false,
  hasDelivery: true,
  deliveryEnabled: true,
  pickupEnabled: true,
};

export const mockOnboardingStatus = {
  hasProducts: true,
  hasTables: true,
  hasBranding: true,
  hasShifts: true,
  completedSteps: 4,
  totalSteps: 4,
  progressPercentage: 100,
  allCompleted: true,
};

export const tenantHandlers = [
  http.get('*/api/v1/tenant/me', () => {
    return HttpResponse.json({
      success: true,
      data: mockTenantBranding,
    });
  }),

  http.get('*/api/v1/tenant/public', () => {
    return HttpResponse.json({
      success: true,
      data: mockTenantBranding,
    });
  }),

  http.get('*/api/v1/tenant/public/:slug', () => {
    return HttpResponse.json({
      success: true,
      data: mockTenantBranding,
    });
  }),

  http.put('*/api/v1/tenant/branding', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Identidad visual actualizada',
      data: {
        ...mockTenantBranding,
        ...body,
      },
    });
  }),

  http.get('*/api/v1/tenant/onboarding-status', () => {
    return HttpResponse.json({
      success: true,
      data: mockOnboardingStatus,
    });
  }),
];
