import { getSiteUrl } from '../lib/siteUrl.js';
import PetroleumBrief from './PetroleumBrief.js';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'India\u2019s crude oil and energy trade | India Trade Monitor',
  description:
    'An evidence-led guide to India\u2019s crude oil and energy imports, energy-product exports, supplier shifts, refinery outputs and domestic energy use.',
  alternates: { canonical: '/petroleum' },
  openGraph: {
    title: 'India\u2019s crude oil and energy trade, explained',
    description:
      'Five-year import and export trends for crude oil and other energy products, plus crude supplier shifts and refinery context.',
    type: 'article',
    url: '/petroleum',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India\u2019s crude oil and energy trade, explained',
    description:
      'Five-year energy import and export trends with a direct view of India\u2019s crude supplier mix.',
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
  name: 'India\u2019s crude oil and energy trade, explained',
  description:
    'Five-year customs view of India crude oil and related energy-product imports and exports, with crude imports by source country.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <PetroleumBrief />
    </>
  );
}
