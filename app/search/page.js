import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';
import { searchMulti } from '../../lib/tmdb';

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';
  const data = q ? await searchMulti(q) : { results: [] };
  const results = data.results?.filter(r => r.media_type !== 'person' && r.poster_path) || [];

  return (
    <>
      <Navbar />
      <div className="search-page">
        <h1>{q ? `Results for "${q}"` : 'Search'}</h1>
        {results.length === 0 && q && (
          <p style={{ color: 'var(--muted)' }}>No results found. Try a different search term.</p>
        )}
        <div className="results-grid">
          {results.map(item => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <footer>
        <p>Made with ❤️ using <span>TMDB API</span> • For personal use only</p>
      </footer>
    </>
  );
}