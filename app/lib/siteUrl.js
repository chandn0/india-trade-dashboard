/**
 * Resolves the canonical site base URL.
 *
 * Resolution Priority:
 * 1. Explicit NEXT_PUBLIC_SITE_URL
 * 2. VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL (normalized to https://)
 * 3. Local development fallback: http://localhost:3000
 *
 * Trailing slashes are stripped to ensure clean, consistent URL formatting.
 *
 * @param {Record<string, string | undefined>} [env=process.env]
 * @returns {string} Normalized canonical base URL without trailing slash
 */
export function getSiteUrl(env = process.env) {
  const explicit = env?.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return normalizeUrl(explicit);
  }

  const vercelHost = env?.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env?.VERCEL_URL?.trim();
  if (vercelHost) {
    return normalizeUrl(vercelHost, true);
  }

  return 'http://localhost:3000';
}

function normalizeUrl(rawUrl, defaultHttps = false) {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    const isLocal = url.startsWith('localhost') || url.startsWith('127.0.0.1');
    const protocol = defaultHttps || !isLocal ? 'https' : 'http';
    url = `${protocol}://${url}`;
  }
  return url.replace(/\/+$/, '');
}
