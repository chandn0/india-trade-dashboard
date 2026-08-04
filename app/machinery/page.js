import TradeSectorBrief from '../components/briefs/TradeSectorBrief.js';

export const metadata = {
  title: 'India’s machinery and equipment trade | India Trade Monitor',
  description:
    'Five-year HS84 machinery trade trends, product-level import dependence, supplier concentration and India’s capital-goods production context.',
  alternates: { canonical: '/machinery' },
};

export default function MachineryPage() {
  return <TradeSectorBrief type="machinery" />;
}
