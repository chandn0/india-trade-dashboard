const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'India Trade Monitor',
  description:
    'India trade dashboard with year-wise totals, top export and import baskets, and market-share trends from official Government of India sources.',
  applicationName: 'India Trade Monitor',
  keywords: [
    'India trade',
    'exports',
    'imports',
    'trade balance',
    'FTSPCC',
    'tradestat',
    'commerce ministry',
    'RBI',
    'INR USD',
  ],
  openGraph: {
    title: 'India Trade Monitor',
    description:
      'Year-wise import and export summary with basket-level share charts and market-share trends.',
    type: 'website',
    url: '/',
    siteName: 'India Trade Monitor',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Trade Monitor',
    description:
      'Year-wise import and export summary with basket-level share charts and market-share trends.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0b1220',
  width: 'device-width',
  initialScale: 1,
};

import './globals.css';
import ThemeRegistry from './ThemeRegistry';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
