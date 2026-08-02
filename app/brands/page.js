import MobilityBrief from '../mobility/MobilityBrief.js';

export const metadata = {
  title: 'India’s top consumer brands: phones, bikes and cars | India Trade Monitor',
  description:
    'India’s leading phone, two-wheeler and passenger-vehicle brands, with market-share data and careful evidence on what is made in India.',
  alternates: { canonical: '/brands' },
  openGraph: { title: 'India’s top consumer brands: phones, bikes and cars', url: '/brands' }
};

export default function BrandsPage() { return <MobilityBrief />; }
