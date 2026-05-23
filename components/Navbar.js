'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
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

  return (
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
        <input
          className="search-input"
          type="text"
          placeholder="Search movies, shows..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="search-btn" type="submit">🔍</button>
      </form>
    </nav>
  );
}
