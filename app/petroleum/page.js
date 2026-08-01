import PetroleumBrief from './PetroleumBrief.js';

export const metadata = {
  title: 'India’s petroleum imports, explained | India Trade Monitor',
  description:
    'An evidence-led guide to India’s crude oil suppliers, changing country shares, refinery outputs, domestic petroleum use and vehicle demand.',
  alternates: { canonical: '/petroleum' },
  openGraph: {
    title: 'India’s petroleum imports, explained',
    description:
      'Where India buys crude oil, how the supplier mix changed, and what the country ultimately uses petroleum for.',
    url: '/petroleum',
  },
};

export default function PetroleumPage() {
  return <PetroleumBrief />;
}
