'use client';

import dynamic from 'next/dynamic';

const ProductSignals = dynamic(() =>
  import('./ProductDecisionTools.js').then((module) => module.ProductSignals),
);
const ScenarioModeller = dynamic(() =>
  import('./ProductDecisionTools.js').then((module) => module.ScenarioModeller),
);
const ProductComparison = dynamic(() =>
  import('./ProductDecisionTools.js').then((module) => module.ProductComparison),
);
const EvidenceReadiness = dynamic(() =>
  import('./ProductDecisionTools.js').then((module) => module.EvidenceReadiness),
);
const ProductRelationshipMap = dynamic(() => import('./ProductRelationshipMap.js'));
const DomesticValueChainFramework = dynamic(() => import('./DomesticValueChainFramework.js'));

export default function ProductToolSuite({ detailData }) {
  return (
    <>
      <ProductSignals products={detailData.products} />
      <DomesticValueChainFramework />
      <ProductRelationshipMap products={detailData.products} />
      <ScenarioModeller products={detailData.products} />
      <ProductComparison products={detailData.products} />
      <EvidenceReadiness metadata={detailData.metadata} />
    </>
  );
}
