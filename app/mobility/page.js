import MobilityBrief from './MobilityBrief.js';

export const metadata = {
  title: 'India’s mobility brands: who Indians ride and drive | India Trade Monitor',
  description: 'India’s leading two-wheeler and passenger-vehicle brands, their retail shares, and the evidence gap behind Made-in-India claims.',
  alternates: { canonical: '/mobility' },
  openGraph: { title: 'India’s mobility brands: who Indians ride and drive', url: '/mobility' }
};

export default function MobilityPage() { return <MobilityBrief />; }
