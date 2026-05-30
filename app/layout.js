'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Head from 'next/head';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HindiMovieStream - Watch Movies, TV Shows & Live Sports</title>
        <meta name="description" content="Watch Hindi movies, English movies, TV shows and live sports including FIFA World Cup 2026, Cricket, IPL for free." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.hindimoviestream.xyz" />
        <meta property="og:site_name" content="HindiMovieStream" />
        <meta property="og:title" content="HindiMovieStream - Watch Movies & Live Sports Free" />
        <meta property="og:description" content="Watch Hindi movies, English movies, TV shows and live sports including FIFA World Cup 2026, Cricket, IPL for free." />
        <meta property="og:image" content="https://www.hindimoviestream.xyz/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="HindiMovieStream - Watch Movies & Live Sports Free" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HindiMovieStream - Watch Movies & Live Sports Free" />
        <meta name="twitter:description" content="Watch Hindi movies, English movies, TV shows and live sports including FIFA World Cup 2026 for free." />
        <meta name="twitter:image" content="https://www.hindimoviestream.xyz/og-image.png" />

        {/* Ad scripts — only on non-landing pages */}
        {!isLanding && (
          <>
            <Script src="https://quge5.com/88/tag.min.js" data-zone="240340" async data-cfasync="false" />
            <Script src="https://pl29479097.effectivecpmnetwork.com/52/7c/8b/527c8b5a2e1f5e83eccab34fae29afbf.js" />
            <Script async data-cfasync="false" src="https://pl29479098.effectivecpmnetwork.com/bca10afe5d05f34fa7540d30511bac31/invoke.js" />
          </>
        )}
      </head>
      <body>
        {!isLanding && <div id="container-bca10afe5d05f34fa7540d30511bac31"></div>}
        {children}
      </body>
    </html>
  );
}
