import { getSiteUrl } from '../lib/siteUrl.js';
import PetroleumBrief from './PetroleumBrief.js';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'India\u2019s petroleum imports, explained | India Trade Monitor',
  description:
    'An evidence-led guide to India\u2019s crude oil suppliers, how country shares shifted from FY2021\u201322 to FY2025\u201326, refinery outputs, domestic petroleum consumption and the link to vehicle demand.',
  alternates: { canonical: '/petroleum' },
  openGraph: {
    title: 'India\u2019s petroleum imports, explained',
    description:
      'Where India buys crude oil, how the supplier mix changed across five fiscal years, and what the country ultimately uses petroleum for \u2014 sourced from TradeStat, Ministry of Commerce and Industry.',
    type: 'article',
    url: '/petroleum',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India\u2019s petroleum imports, explained',
    description:
      'Five-year breakdown of India\u2019s crude oil supplier mix \u2014 Iraq, Saudi Arabia, Russia, UAE and others \u2014 with domestic consumption context.',
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
  name: 'India\u2019s petroleum imports, explained',
  description:
    'Five-year dataset of India crude petroleum imports by source country (FY2021\u201322 to FY2025\u201326), sourced from TradeStat, Ministry of Commerce and Industry (FTSPCC commodity S5).',
  url: `${siteUrl}/petroleum`,
  isPartOf: {
    '@type': 'WebSite',
    name: 'India Trade Monitor',
    url: siteUrl,
  },
  about: [
    { '@type': 'Thing', name: 'India crude oil imports' },
    { '@type': 'Thing', name: 'Petroleum supplier country mix' },
    { '@type': 'Thing', name: 'India energy trade data' },
    { '@type': 'Thing', name: 'India domestic petroleum consumption' },
  ],
  inLanguage: 'en-IN',
};

export default function PetroleumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <PetroleumBrief />
    </>
  );
}
