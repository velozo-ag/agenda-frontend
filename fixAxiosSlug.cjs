const fs = require('fs');
let c = fs.readFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/api/axiosClient.js', 'utf8');

const newLogic = `
export const getTenantSlug = () => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query param ?tenant=slug or ?slug=slug
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlug = urlParams.get('tenant') || urlParams.get('slug');
    if (paramSlug) {
      return paramSlug.toLowerCase().trim();
    }

    // 2. Check Route Path /book/:slug, /agenda/:slug
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
  return null;
};
`;

c = c.replace(/export const getTenantSlug = \(\) => \{[\s\S]*?return null;\s*\};/m, newLogic.trim());
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1);
fs.writeFileSync('C:/Users/agusv/OneDrive/Desktop/Dev/aa-barber/frontend-barber/src/api/axiosClient.js', c, 'utf8');
