'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const pills = [
    { label: 'Eng Movies', href: '/movies' },
    { label: 'Eng TV Shows', href: '/tv' },
    { label: 'Indian Movies', href: '/indian' },
    { label: 'Indian TV Shows', href: '/indian/tv' },
    { label: 'Bangla Movies', href: '/bangla' },
    { label: 'Bangla Natok', href: '/bangla/natok' },
    { label: 'Sports', href: '/sports' },
  ];

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ height: 70 }}>
        <Link href="/" className="logo" style={{ fontSize: 26 }}>HindiMovieStream</Link>
        <div className="nav-links" style={{ gap: 24 }}>
          <Link href="/home" style={{ fontSize: 15 }}>Home</Link>
          <Link href="/movies" style={{ fontSize: 15 }}>English Movies</Link>
          <Link href="/tv" style={{ fontSize: 15 }}>English TV Shows</Link>
          <Link href="/indian" style={{ fontSize: 15 }}>Indian Movies</Link>
          <Link href="/indian/tv" style={{ fontSize: 15 }}>Indian TV Shows</Link>
          <Link href="/bangla" style={{ fontSize: 15 }}>Bangla Movies</Link>
          <Link href="/bangla/natok" style={{ fontSize: 15 }}>Bangla Natok</Link>
          <Link href="/sports" style={{ fontSize: 15 }}>Sports</Link>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input className="search-input" type="text" placeholder="Search movies, shows..." value={query} onChange={e => setQuery(e.target.value)} />
          <button className="search-btn" type="submit">🔍</button>
        </form>
      </nav>

      {/* ── MOBILE TOP BAR: Logo only ── */}
      <div className="mobile-top-bar">
        <Link href="/" className="logo" style={{ fontSize: 18, letterSpacing: 1 }}>HindiMovieStream</Link>
      </div>

      {/* ── MOBILE FILTER PILLS ── */}
      <div className="mobile-pills">
        <div className="pills-row">
          {pills.slice(0, 4).map(p => (
            <Link key={p.href} href={p.href} className="pill">{p.label}</Link>
          ))}
        </div>
        <div className="pills-row">
          {pills.slice(4).map(p => (
            <Link key={p.href} href={p.href} className="pill">{p.label}</Link>
          ))}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mobile-bottom-nav">
        <Link href="/home" className="mobile-bottom-item">
          <span style={{ fontSize: 22 }}>🏠</span>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Home</span>
        </Link>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search movies, shows..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, background: '#1a1a26',
              border: '1px solid #e50914', borderRadius: 8,
              padding: '8px 12px', color: 'white',
              fontSize: 13, fontFamily: 'inherit', outline: 'none',
            }}
          />
        </form>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {showPhone && (
            <div style={{
              position: 'absolute', bottom: 52, right: 0,
              background: '#e50914', color: 'white',
              padding: '6px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}>
              📞 01742472169
            </div>
          )}
          <button
            onClick={() => setShowPhone(!showPhone)}
            style={{
              background: 'none', border: '1px solid #e50914',
              borderRadius: 6, color: '#e50914',
              fontSize: 9, fontWeight: 700, cursor: 'pointer',
              padding: '4px 6px', textAlign: 'center',
              lineHeight: 1.3, fontFamily: 'inherit',
              maxWidth: 64,
            }}
          >
            Click to place ad
          </button>
        </div>
      </div>

      {/* ── FLOATING DOWNLOAD BUTTON ── */}
      
        href="https://raw.githubusercontent.com/rafi9376/cineby-clone/main/app-debug.apk"
    </>
  );
}
