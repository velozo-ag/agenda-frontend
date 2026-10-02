/**
 * Helper to resolve media/image URLs properly across different environments (Localhost, Vercel, VPS).
 * 
 * If the URL is relative (e.g. "/uploads/1/branding/uuid.png"), it prepends the backend API host origin
 * derived from `import.meta.env.VITE_API_URL`.
 * 
 * If it's already an absolute URL (https://..., http://..., data:..., blob:...), it returns it as is.
 */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return null;
  }

  const trimmed = url.trim();

  // Already absolute or data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Relative path (like "/uploads/...")
  let apiBase = (import.meta.env.VITE_API_URL || '').trim();
  
  if (apiBase) {
    if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://') && !apiBase.startsWith('/')) {
      apiBase = `https://${apiBase}`;
    }

    if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
      // Strip "/api/v1", "/api", or trailing slashes to get origin (e.g. "https://api-pos.roosty.site")
      const backendOrigin = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '').replace(/\/+$/, '');
      const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      return `${backendOrigin}${cleanPath}`;
    }
  }

  // Fallback for local development proxy or relative domain
  return trimmed;
}

export default getImageUrl;
