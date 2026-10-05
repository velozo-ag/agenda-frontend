// Vercel Edge Middleware: Intercepts social media crawlers (WhatsApp, Facebook, Twitter, Telegram, etc.)
// and serves dynamic Open Graph meta tags customized for each restaurant/tenant.

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _vercel (Vercel internals)
     * - static assets with file extensions (e.g. .js, .css, .png, .jpg, .ico, .svg)
     */
    '/((?!_vercel|assets|.*\\..*).*)',
  ],
};

const BOT_USER_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'telegrambot',
  'slackbot',
  'linkedinbot',
  'discordbot',
  'skypeuripreview',
  'googlebot',
  'bingbot',
  'applebot',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'pinterest',
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

function resolveFullImageUrl(url, apiOrigin) {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const cleanOrigin = (apiOrigin || 'https://api-pos.roosty.site').replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${cleanOrigin}${cleanPath}`;
}

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  // Only intercept if the requester is a social bot / crawler
  if (!isCrawler(userAgent)) {
    return; // Pass through to standard React SPA for human users
  }

  const url = new URL(request.url);
  const hostname = url.hostname;

  // 1. Resolve tenant slug from query param, path, or subdomain
  let slug = url.searchParams.get('tenant') || url.searchParams.get('slug');

  if (!slug) {
    const pathParts = url.pathname.split('/').filter(Boolean);
    if ((pathParts[0] === 'menu' || pathParts[0] === 'm') && pathParts[1]) {
      slug = pathParts[1];
    }
  }

  if (!slug && hostname) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const first = parts[0].toLowerCase().trim();
      if (!['www', 'localhost', '127', '192', '10', '172'].includes(first)) {
        slug = first;
      }
    }
  }

  // 2. Determine API base URL
  const envApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://api-pos.roosty.site/api/v1';
  let apiBase = envApiUrl.trim();
  if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
    apiBase = `https://${apiBase}`;
  }
  const apiOrigin = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '').replace(/\/+$/, '');

  let branding = null;

  if (slug) {
    try {
      const endpoint = `${apiBase.replace(/\/+$/, '')}/tenant/public?tenant=${encodeURIComponent(slug)}`;
      const res = await fetch(endpoint, {
        headers: {
          'X-Tenant-Slug': slug,
          'Accept': 'application/json',
        },
        // Fast timeout for social bots (3 seconds max)
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          branding = json.data;
        } else if (json?.id) {
          branding = json;
        }
      }
    } catch (err) {
      // Graceful fallback to generic branding on timeout or error
    }
  }

  // 3. Extract dynamic metadata fields
  const storeName = branding?.storeName || branding?.name || (slug ? slug.toUpperCase() : 'Reservas Online');
  
  let description = branding?.heroSubtitle || branding?.heroTitle || '';
  if (!description) {
    const hours = branding?.openingHours ? ` • Horario: ${branding.openingHours}` : '';
    const address = branding?.address ? ` • ${branding.address}` : '';
    description = `Mirá nuestra carta digital en vivo, hacé tu pedido y consultá promociones${hours}${address}.`;
  }

  const rawImage = branding?.heroUrl || branding?.logoUrl || '';
  const ogImageUrl = slug ? `${apiBase.replace(/\/+$/, '')}/booking/${encodeURIComponent(slug)}/banner.png` : (resolveFullImageUrl(rawImage, apiOrigin) || `${url.origin}/logo.png`);
  const canonicalUrl = url.href;

  // 4. Return custom dynamic HTML with Open Graph & Twitter meta tags
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(storeName)} | Reservas Online</title>
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph / WhatsApp / Facebook / Telegram -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(storeName)} | Reservas Online">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(storeName)}">
  <meta property="og:site_name" content="${escapeHtml(storeName)}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(storeName)} | Reservas Online">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImageUrl}">

  <!-- Canonical & Instant Redirect for human users if opened -->
  <link rel="canonical" href="${canonicalUrl}">
  <meta http-equiv="refresh" content="0; url=${canonicalUrl}">
</head>
<body style="font-family: sans-serif; background: #09090b; color: #f4f4f5; padding: 2rem; text-align: center;">
  <h1>${escapeHtml(storeName)}</h1>
  <p>${escapeHtml(description)}</p>
  ${ogImageUrl ? `<img src="${ogImageUrl}" alt="${escapeHtml(storeName)}" style="max-width: 100%; height: auto; border-radius: 1rem; margin: 1rem 0;" />` : ''}
  <br>
  <a href="${canonicalUrl}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #000; font-weight: bold; border-radius: 9999px; text-decoration: none;">Ver Reservas Online</a>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
