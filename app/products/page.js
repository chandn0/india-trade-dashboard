import ProductCompositionDashboard from '../components/products/ProductCompositionDashboard.js';

export const metadata = {
  title: 'Product Composition | India Trade Monitor',
  description:
    "Explore India's largest imports and exports by production stage, with explicit HS-4 attribution.",
};

export default function ProductsPage() {
  return <ProductCompositionDashboard />;
}
