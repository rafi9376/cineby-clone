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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">CineStream</Link>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/tv">TV Shows</Link>
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