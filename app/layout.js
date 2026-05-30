import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'HindiMovieStream - Watch Movies, TV Shows & Live Sports',
  description: 'Watch Hindi movies, TV shows and live sports free.',
  openGraph: {
    title: 'HindiMovieStream - Watch Movies & Live Sports Free',
    description: 'Watch Hindi movies, TV shows and live sports including FIFA World Cup 2026 free.',
    url: 'https://www.hindimoviestream.xyz',
    siteName: 'HindiMovieStream',
    images: [{ url: 'https://www.hindimoviestream.xyz/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://www.hindimoviestream.xyz/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://quge5.com/88/tag.min.js" data-zone="240340" async data-cfasync="false" />
        <Script src="https://pl29479097.effectivecpmnetwork.com/52/7c/8b/527c8b5a2e1f5e83eccab34fae29afbf.js" />
        <Script async data-cfasync="false" src="https://pl29479098.effectivecpmnetwork.com/bca10afe5d05f34fa7540d30511bac31/invoke.js" />
      </head>
      <body>
        <div id="container-bca10afe5d05f34fa7540d30511bac31"></div>
        {children}
      </body>
    </html>
  );
}
