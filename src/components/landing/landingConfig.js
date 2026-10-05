// Configuracion centralizada de la landing (agenda.roosty.com.ar)
export const LANDING_CONFIG = {
  name: 'Roosty Agenda',
  whatsappNumber: '5493482626653',
  rootDomain: 'agenda.roosty.site',
};

export const getWhatsAppLink = (message) => {
  const base = `https://wa.me/${LANDING_CONFIG.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

export const WHATSAPP_SALES_LINK = getWhatsAppLink('Hola, quiero conocer más sobre Roosty Agenda para mi barbería');

// Construye la URL de acceso del nuevo tenant.
// En produccion: https://{slug}.agenda.roosty.site/login
// En local (localhost / IP privada): /login?slug={slug} sobre el mismo origen.
export const buildTenantLoginUrl = (slug) => {
  if (typeof window === 'undefined') return '#';
  const { hostname, protocol, host } = window.location;
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname) ||
    hostname.endsWith('.local');
  if (isLocal) return `${protocol}//${host}/login?slug=${encodeURIComponent(slug)}`;
  return `https://${slug}.${LANDING_CONFIG.rootDomain}/login`;
};

export const buildTenantAutoLoginUrl = (slug, token) => {
  if (typeof window === 'undefined') return '#';
  const { hostname, protocol, host } = window.location;
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname) ||
    hostname.endsWith('.local');
  if (isLocal) return `${protocol}//${host}/auto-login?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`;
  return `https://${slug}.${LANDING_CONFIG.rootDomain}/auto-login?token=${encodeURIComponent(token)}`;
};
