import TradeSectorBrief from '../components/briefs/TradeSectorBrief.js';

export const metadata = {
  title: 'India’s gems, gold and jewellery trade | India Trade Monitor',
  description:
    'A product-level view of India’s gold, diamonds, silver and jewellery imports, exports and domestic value chain.',
  alternates: { canonical: '/gems-jewellery' },
};

export default function GemsJewelleryPage() {
  return <TradeSectorBrief type="gems" />;
}
