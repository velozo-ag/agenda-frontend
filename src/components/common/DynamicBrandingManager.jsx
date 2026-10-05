import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMyTenant, useTenantBranding, applyTenantTheme, getPageTitleForPath } from '../../hooks/useTenantBranding';
import { getTenantSlug } from '../../api/axiosClient';

/**
 * Headless component that listens to URL / route changes and automatically:
 * 1. Synchronizes document.title with the active salon's name + current page.
 * 2. Injects the salon's custom logo as the browser tab favicon (<link rel="icon">).
 * 3. Applies CSS custom properties (--primary-color, --accent-glow, etc.).
 */
export function DynamicBrandingManager() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.username === 'superadmin';

  // 1. Authenticated tenant data (disabled for SuperAdmin on master portal)
  const { data: authTenant } = useMyTenant({ enabled: isAuthenticated && !isSuperAdmin });

  // 2. Public / unauthenticated tenant resolution via slug
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const urlSlug = searchParams.get('slug') || searchParams.get('tenant') || getTenantSlug() || (isLocalhost ? 'admin' : undefined);
  
  const { data: publicTenant, error: publicTenantError } = useTenantBranding(urlSlug);

  // Active tenant
  const activeTenant = (isAuthenticated && !isSuperAdmin && authTenant) ? authTenant : publicTenant;

  useEffect(() => {
    // Si no hay slug y estamos en prod (y NO estamos ya en la landing), redirigir instantáneamente
    if (!urlSlug && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      if (window.location.hostname !== 'agenda.roosty.com.ar') {
        window.location.href = 'https://agenda.roosty.com.ar';
      }
      return;
    }
    
    if (publicTenantError && (publicTenantError.status === 404 || publicTenantError.response?.status === 404)) {
      if (typeof window !== 'undefined' && window.location.hostname !== 'agenda.roosty.com.ar') {
        window.location.href = 'https://agenda.roosty.com.ar';
      }
    }
  }, [publicTenantError, urlSlug]);

  useEffect(() => {
    if (isSuperAdmin && location.pathname.startsWith('/superadmin')) {
      document.title = 'SuperAdmin | Roosty Agenda';
      return;
    }

    if (activeTenant) {
      applyTenantTheme(activeTenant);
    } else {
      document.title = getPageTitleForPath(location.pathname, 'Roosty Agenda');
    }
  }, [location.pathname, location.search, activeTenant, isSuperAdmin]);

  return null;
}
