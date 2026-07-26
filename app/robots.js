import { getSiteUrl } from './lib/siteUrl.js';

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  };
}
