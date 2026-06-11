export default function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
