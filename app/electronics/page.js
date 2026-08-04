import TradeSectorBrief from '../components/briefs/TradeSectorBrief.js';

export const metadata = {
  title: 'India’s electronics imports and value chain | India Trade Monitor',
  description:
    'Five-year electronics trade trends, product-level import dependence, supplier concentration and India’s domestic value chain.',
  alternates: { canonical: '/electronics' },
};

export default function ElectronicsPage() {
  return <TradeSectorBrief type="electronics" />;
}
