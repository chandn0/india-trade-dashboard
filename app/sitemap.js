import { getSiteUrl } from './lib/siteUrl.js';

export default function sitemap() {
  const base = getSiteUrl();
  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/products`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/petroleum`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
