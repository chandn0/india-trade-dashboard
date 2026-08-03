import { getSiteUrl } from '../lib/siteUrl.js';
import MobilityBrief from '../mobility/MobilityBrief.js';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'India consumer brands: sales, manufacturing and imports | India Trade Monitor',
  description:
    'Compare India sales, product revenue disclosure, India manufacturing and imports for leading smartphone, two-wheeler and car companies in one table.',
  alternates: { canonical: '/brands' },
  openGraph: {
    title: 'India consumer brands: sales, manufacturing and imports',
    description:
      'One table for smartphone, two-wheeler and car sales, product revenue disclosure, India manufacturing and imports.',
    type: 'article',
    url: '/brands',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India consumer brands: sales, manufacturing and imports',
    description:
      'Compare sales and sourcing for leading smartphone, two-wheeler and car companies in one table.',
  },
};

/**
 * Safely serialise a value as JSON for embedding in an inline <script> tag.
 * Escapes the sequence "</script" so the closing tag cannot be injected.
 */
function safeJsonLd(value) {
  return JSON.stringify(value).replace(/<\/script/gi, '<\\/script');
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemPage',
  name: 'India consumer brands: sales, manufacturing and imports',
  description:
    'A unified table comparing India sales, product revenue disclosure, domestic manufacturing and imports for leading consumer brands.',
  url: `${siteUrl}/brands`,
  isPartOf: {
    '@type': 'WebSite',
    name: 'India Trade Monitor',
    url: siteUrl,
  },
  about: [
    { '@type': 'Thing', name: 'Smartphone market share in India' },
    { '@type': 'Thing', name: 'Two-wheeler retail registrations in India' },
    { '@type': 'Thing', name: 'Passenger vehicle retail registrations in India' },
    { '@type': 'Thing', name: 'Domestic manufacturing evidence for consumer brands' },
  ],
  inLanguage: 'en-IN',
};

export default function BrandsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <MobilityBrief />
    </>
  );
}
