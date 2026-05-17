import './globals.css';

export const metadata = {
  title: 'CineStream - Watch Free Movies & TV Shows',
  description: 'Watch the latest movies and TV shows online for free.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}