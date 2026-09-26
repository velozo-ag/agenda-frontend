import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTenantSlug = () => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query param ?tenant=slug or ?slug=slug
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlug = urlParams.get('tenant') || urlParams.get('slug');
    if (paramSlug) {
      return paramSlug.toLowerCase().trim();
    }

    // 2. Check Route Path /book/:slug, /agenda/:slug, /menu/:slug or /m/:slug
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if ((pathParts[0] === 'book' || pathParts[0] === 'agenda' || pathParts[0] === 'menu' || pathParts[0] === 'm') 
        && pathParts[1] && pathParts[1] !== 'confirmation' && pathParts[1] !== 'status') {
      return pathParts[1].toLowerCase().trim();
    }

    // 3. Subdomain resolution (e.g. barpepito.agenda.roosty.site -> 'barpepito')
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const first = parts[0].toLowerCase().trim();
      if (first !== 'www' && first !== 'agenda' && first !== 'localhost' && first !== '127' && first !== '192' && first !== '10' && first !== '172') {
        return first;
      }
    }
  }
  return import.meta.env.VITE_TENANT_SLUG || undefined;
};

// Request Interceptor: Adjunta JWT token y Tenant Slug en headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantSlug = getTenantSlug();
    if (tenantSlug) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Desenvuelve ApiResponse y maneja errores de autenticación
axiosClient.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pos:network-online'));
    }
    // Si la respuesta sigue el esquema ApiResponse { success, data, message }
    if (response.data && typeof response.data.success === 'boolean') {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pos:network-error', { detail: { message: 'Sin conexión con el servidor' } }));
      }
    }

    if (status === 401) {
      localStorage.removeItem('pos_token');
      localStorage.removeItem('pos_user');
      
      const isPublicPath = typeof window !== 'undefined' && (
        window.location.pathname === '/' ||
        window.location.pathname === '/book' ||
        window.location.pathname.startsWith('/book/') ||
        window.location.pathname.startsWith('/agenda/') ||
        window.location.pathname === '/auto-login' ||
        window.location.pathname === '/demo-expired' ||
        window.location.pathname === '/menu' ||
        window.location.pathname.startsWith('/menu/') ||
        window.location.pathname.startsWith('/m/')
      );

      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && !isPublicPath && !error.config?.url?.includes('/auth/login')) {
        window.location.href = '/login';
      }
    }

    if (status === 403 && (errorData?.errorCode === 'TENANT_INACTIVE' || errorData?.message?.toLowerCase().includes('desactivado') || errorData?.message?.toLowerCase().includes('suspendido'))) {
      localStorage.removeItem('pos_token');
      localStorage.removeItem('pos_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?error=tenant_inactive';
      }
    }

    const message = errorData?.message || error.message || 'Error en la solicitud';
    const customError = new Error(message);
    customError.status = status;
    customError.errorCode = errorData?.errorCode;
    customError.fieldErrors = errorData?.fieldErrors;
    customError.raw = errorData;

    return Promise.reject(customError);
  }
);

export default axiosClient;
