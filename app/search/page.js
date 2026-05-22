'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=4d1f4d49bd0ae6fc1d622c7f468f73bb&query=${encodeURIComponent(q)}&include_adult=false`)
      .then(r => r.json())
      .then(data => setResults(data.results?.filter(r => r.media_type !== 'person' && r.poster_path) || []));
  }, [q]);

  return (
    <>
      <Navbar />
      <div className="search-page">
        <h1>{q ? `Results for "${q}"` : 'Search'}</h1>
        {results.length === 0 && q && <p style={{ color: 'var(--muted)' }}>No results found.</p>}
        <div className="results-grid">
          {results.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
