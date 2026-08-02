import PhoneBrandBrief from './PhoneBrandBrief.js';

export const metadata = {
  title: 'India’s phone brands: who sells, builds and still imports | India Trade Monitor',
  description:
    'An evidence-led guide to India’s leading phone brands: shipment share, India manufacturing disclosures, and the limits of available component-depth data.',
  alternates: { canonical: '/phones' },
  openGraph: {
    title: 'India’s phone brands: who sells, builds and still imports',
    description:
      'The social-friendly phone comparison that keeps sales, local production and component depth distinct.',
    url: '/phones'
  }
};

export default function PhonesPage() {
  return <PhoneBrandBrief />;
}
