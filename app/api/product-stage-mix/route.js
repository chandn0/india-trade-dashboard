import stageData from '../../../data/product_stage_mix.json';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(stageData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
