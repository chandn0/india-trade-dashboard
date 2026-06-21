import { ImageResponse } from 'next/og';

export const alt =
  'India Trade Monitor — exports, imports and the trade balance from official Government of India data';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0b1220',
        color: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 26,
          color: '#d9cbff',
          letterSpacing: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 36 }}>
          <div style={{ width: 10, height: 14, background: '#2563eb' }} />
          <div style={{ width: 10, height: 22, background: '#ea670e' }} />
          <div style={{ width: 10, height: 30, background: '#0d9488' }} />
          <div style={{ width: 10, height: 36, background: '#7c3aed' }} />
        </div>
        <span>INDIA TRADE MONITOR</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          Exports, imports and the trade balance.
        </div>
        <div style={{ fontSize: 32, color: '#9aa6bd', lineHeight: 1.3, maxWidth: 920 }}>
          Year-wise totals, basket-level composition and partner shares — straight from official
          Government of India data.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 22,
          color: '#7a86a0',
        }}
      >
        <span>tradestat.commerce.gov.in &middot; RBI &middot; FBIL</span>
        <span style={{ color: '#d9cbff', fontWeight: 700, letterSpacing: 1 }}>
          FY10–11 → present
        </span>
      </div>
    </div>,
    { ...size },
  );
}
