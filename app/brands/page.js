import { getSiteUrl } from '../lib/siteUrl.js';
import MobilityBrief from '../mobility/MobilityBrief.js';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'India\u2019s top consumer brands: phones, bikes and cars | India Trade Monitor',
  description:
    'India\u2019s leading phone, two-wheeler and passenger-vehicle brands \u2014 market-share data from official FADA and SIAM sources, with careful evidence on what is actually made in India.',
  alternates: { canonical: '/brands' },
  openGraph: {
    title: 'India\u2019s top consumer brands: phones, bikes and cars',
    description:
      'Market-share rankings for phones (Q1\u00a02025 shipments), two-wheelers and passenger vehicles (FY2024\u201325 retail), with honest notes on domestic manufacturing evidence.',
    type: 'article',
    url: '/brands',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India\u2019s top consumer brands: phones, bikes and cars',
    description:
      'Phone shipment share, two-wheeler and car retail rankings for India \u2014 with honest notes on what\u2019s actually manufactured here.',
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
  name: 'India\u2019s top consumer brands: phones, bikes and cars',
  description:
    'Market-share data for India\u2019s leading phone, two-wheeler and passenger-vehicle brands, drawn from Counterpoint Research, FADA and SIAM official sources.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <MobilityBrief />
    </>
  );
}
