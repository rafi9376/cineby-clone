'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <html lang="en">
      <head>
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
