import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../services/tenantService';
import { getTenantSlug } from '../api/axiosClient';
import { getImageUrl } from '../utils/imageUrl';

export const hexToRgb = (hex) => {
  if (!hex || !hex.startsWith('#')) return '99, 102, 241';
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return '99, 102, 241';
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

export const updateFavicon = (logoUrl) => {
  if (typeof document === 'undefined') return;
  const resolvedUrl = logoUrl ? getImageUrl(logoUrl) : null;
  const targetHref = (resolvedUrl && typeof resolvedUrl === 'string' && resolvedUrl.trim())
    ? resolvedUrl.trim()
    : '/icon-R.png';

  // Remove existing icon links to force browser refresh
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach((el) => el.remove());

  const newLink = document.createElement('link');
  newLink.rel = 'icon';
  const cleanHref = targetHref.toLowerCase().split('?')[0];
  if (cleanHref.endsWith('.svg')) {
    newLink.type = 'image/svg+xml';
  } else if (cleanHref.endsWith('.png')) {
    newLink.type = 'image/png';
  } else if (cleanHref.endsWith('.ico')) {
    newLink.type = 'image/x-icon';
  } else if (cleanHref.endsWith('.jpg') || cleanHref.endsWith('.jpeg')) {
    newLink.type = 'image/jpeg';
  } else if (cleanHref.endsWith('.webp')) {
    newLink.type = 'image/webp';
  }
  newLink.href = targetHref;
  document.head.appendChild(newLink);

  let appleLink = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = targetHref;
};

export const getPageTitleForPath = (pathname, storeName) => {
  const cleanPath = (pathname || '').split('?')[0].replace(/\/+$/, '') || '/';
  const name = storeName || 'Roosty Agenda';

  if (cleanPath === '/superadmin') {
    return 'SuperAdmin | Roosty Agenda';
  }

  let section = 'Reservar Turno';
  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/book') {
    section = 'Reservar Turno';
  } else if (cleanPath === '/book/status') {
    section = 'Estado de Reserva';
  } else if (cleanPath === '/book/confirmation') {
    section = 'Turno Confirmado';
  } else if (cleanPath === '/agenda') {
    section = 'Agenda';
  } else if (cleanPath === '/appointments') {
    section = 'Turnos';
  } else if (cleanPath.startsWith('/clients/')) {
    section = 'Ficha de Cliente';
  } else if (cleanPath === '/clients') {
    section = 'Clientes';
  } else if (cleanPath === '/cashier') {
    section = 'Caja y Turnos';
  } else if (cleanPath === '/dashboard') {
    section = 'Métricas';
  } else if (cleanPath === '/admin/services') {
    section = 'Servicios';
  } else if (cleanPath === '/admin/waitlist') {
    section = 'Lista de Espera';
  } else if (cleanPath.startsWith('/admin')) {
    section = 'Configuración';
  } else if (cleanPath === '/login') {
    section = 'Ingreso Staff';
  } else if (cleanPath === '/auto-login') {
    section = 'Accediendo';
  } else if (cleanPath === '/demo-expired') {
    section = 'Demo Expirada';
  }

  return `${name} | ${section}`;
};

export const applyTenantTheme = (tenant, customSubTitle) => {
  if (!tenant || typeof document === 'undefined') return;

  // 1. Dynamic Primary Colors
  const primaryColor = tenant.primaryColor || '#6366f1';
  const rgb = hexToRgb(primaryColor);
  document.documentElement.style.setProperty('--primary-color', primaryColor);
  document.documentElement.style.setProperty('--accent-color', primaryColor);
  document.documentElement.style.setProperty('--primary-rgb', rgb);
  document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb}, 0.15)`);

  // 2. Dynamic Favicon
  updateFavicon(tenant.logoUrl);

  // 3. Dynamic Title (Always uses the tenant's store name and current route or custom title)
  const storeName = tenant.storeName || tenant.name || 'Roosty Agenda';
  if (customSubTitle) {
    document.title = `${storeName} | ${customSubTitle}`;
  } else {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    document.title = getPageTitleForPath(pathname, storeName);
  }
};

export const useTenantBranding = (customSlug) => {
  const slug = customSlug || getTenantSlug();

  return useQuery({
    queryKey: ['tenant', 'public', slug],
    queryFn: async () => {
      const data = await tenantService.getPublicBranding(slug);
      if (data) {
        applyTenantTheme(data);
      }
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutos
    refetchOnWindowFocus: false,
  });
};

export const useMyTenant = (options = {}) => {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('pos_token'));
  const isEnabled = options.enabled !== undefined ? (hasToken && options.enabled) : hasToken;

  return useQuery({
    queryKey: ['tenant', 'me'],
    queryFn: async () => {
      const data = await tenantService.getMyTenant();
      if (data) applyTenantTheme(data);
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnWindowFocus: false,
    ...options,
    enabled: isEnabled,
  });
};

export const useTenantPlan = () => {
  const { data: tenant, isLoading } = useMyTenant();
  const planType = tenant?.planType || (tenant ? 'CREW' : undefined);
  const isCero = planType === 'CERO' || planType === 'FREE';
  const isNavaja = planType === 'NAVAJA' || planType === 'STARTER' || planType === 'SOLO_BARBER';
  const isCrew = planType === 'CREW' || planType === 'PRO_SALON' || planType === 'BARBER_CREW' || (!isCero && !isNavaja);
  const maxUsers = tenant?.maxUsers ?? (isCero || isNavaja ? 1 : 15);
  const maxBarbers = tenant?.maxBarbers ?? (isCero || isNavaja ? 1 : 10);
  const maxAppointmentsMonth = tenant?.maxAppointmentsMonth ?? (isCero ? 40 : 0);

  return {
    planType: planType || 'CREW',
    maxUsers,
    maxBarbers,
    maxAppointmentsMonth,
    hasSubdomain: Boolean(tenant?.hasSubdomain),
    hasDeposit: Boolean(tenant?.hasDeposit),
    hasMultiBarber: Boolean(tenant?.hasMultiBarber),
    hasCommissions: Boolean(tenant?.hasCommissions),
    hasWaitlist: Boolean(tenant?.hasWaitlist),
    isCero,
    isNavaja,
    isCrew,
    isSoloBarber: isCero || isNavaja,
    isBarberCrew: isCrew,
    isLoading,
  };
};

export const useUpdateBranding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tenantService.updateBranding(data),
    onSuccess: (updated) => {
      if (updated) applyTenantTheme(updated);
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
  });
};

export const useUpdateBookingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => tenantService.updateBookingSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
  });
};

export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: ['tenant', 'onboarding-status'],
    queryFn: () => tenantService.getOnboardingStatus(),
    staleTime: 1000 * 30, // 30s
  });
};

export const useDemoInfo = () => {
  const { data: tenant, isLoading } = useMyTenant();
  return {
    isDemo: Boolean(tenant?.isDemo),
    demoStatus: tenant?.demoStatus || null,
    demoTrialEndsAt: tenant?.demoTrialEndsAt || null,
    demoPurgeAt: tenant?.demoPurgeAt || null,
    isExpired: tenant?.demoStatus === 'EXPIRED',
    isActiveDemo: Boolean(tenant?.isDemo && tenant?.demoStatus === 'ACTIVE'),
    isLoading,
  };
};

