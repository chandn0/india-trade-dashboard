import { getSiteUrl } from '../lib/siteUrl.js';
import PhoneBrandBrief from './PhoneBrandBrief.js';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'India\u2019s phone brands: who sells, builds and still imports | India Trade Monitor',
  description:
    'An evidence-led guide to India\u2019s leading phone brands: Q1\u00a02025 shipment share for Vivo, Samsung, OPPO, Xiaomi and realme, India manufacturing disclosures, and the limits of available component-depth data.',
  alternates: { canonical: '/phones' },
  openGraph: {
    title: 'India\u2019s phone brands: who sells, builds and still imports',
    description:
      'Shipment-share rankings and manufacturing disclosures for India\u2019s top five phone brands \u2014 keeping sales, local production and component depth clearly distinct.',
    type: 'article',
    url: '/phones',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India\u2019s phone brands: who sells, builds and still imports',
    description:
      'Q1\u00a02025 India smartphone shipment share and manufacturing evidence for Vivo, Samsung, OPPO, Xiaomi and realme \u2014 sales and localisation kept distinct.',
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
  name: 'India\u2019s phone brands: who sells, builds and still imports',
  description:
    'Q1\u00a02025 India smartphone shipment-share data from Counterpoint Research, company manufacturing disclosures, and sector statistics from the Press Information Bureau.',
  url: `${siteUrl}/phones`,
  isPartOf: {
    '@type': 'WebSite',
    name: 'India Trade Monitor',
    url: siteUrl,
  },
  about: [
    { '@type': 'Thing', name: 'India smartphone market share' },
    { '@type': 'Thing', name: 'Mobile phone manufacturing in India' },
    { '@type': 'Thing', name: 'Electronics domestic value addition' },
  ],
  inLanguage: 'en-IN',
};

export default function PhonesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <PhoneBrandBrief />
    </>
  );
}
