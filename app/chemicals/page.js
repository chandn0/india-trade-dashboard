import TradeSectorBrief from '../components/briefs/TradeSectorBrief.js';

export const metadata = {
  title: 'India’s chemicals and pharmaceutical trade | India Trade Monitor',
  description:
    'Five-year trade trends for chemicals, fertilisers and pharmaceuticals, with product-level balances, supplier concentration and domestic production context.',
  alternates: { canonical: '/chemicals' },
};

export default function ChemicalsPage() {
  return <TradeSectorBrief type="chemicals" />;
}
