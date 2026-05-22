'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IMG_BASE } from '../lib/tmdb';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    const timer = setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=4d1f4d49bd0ae6fc1d622c7f468f73bb&query=${encodeURIComponent(query)}&include_adult=false`)
        .then(r => r.json())
        .then(data => {
          const results = data.results?.filter(r => r.media_type !== 'person' && r.poster_path).slice(0, 6) || [];
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setShowDropdown(false); }
  };

  const handleSuggestionClick = (item) => {
    const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
    router.push(href);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">HINDI and English Movie SITE</Link>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/tv">TV Shows</Link>
      </div>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <form className="search-form" onSubmit={handleSearch}>
          <input className="search-input" type="text" placeholder="Search movies, shows..." value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => suggestions.length > 0 && setShowDropdown(true)} />
          <button className="search-btn" type="submit">🔍</button>
        </form>
        {showDropdown && (
          <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', zIndex: 1000, overflow: 'hidden' }}>
            {suggestions.map(item => (
              <div key={item.id} onClick={() => handleSuggestionClick(item)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #222' }}
                onMouseEnter={e => e.currentTarget.style.background = '#252540'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <img src={`${IMG_BASE}${item.poster_path}`} alt={item.title || item.name} style={{ width: '36px', height: '54px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{item.title || item.name}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>{item.media_type === 'tv' ? 'TV Show' : 'Movie'} • {(item.release_date || item.first_air_date)?.slice(0, 4)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
