import Navbar from '../../../components/Navbar';
import MovieCard from '../../../components/MovieCard';
import { fetchTMDB } from '../../../lib/tmdb';
import Link from 'next/link';

export default async function BollywoodPage() {
  const [popular, topRated, action, romance] = await Promise.all([
    fetchTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'vote_average.desc', 'vote_count.gte': '100' }),
    fetchTMDB('/discover/movie', { with_original_language: 'hi', with_genres: '28', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'hi', with_genres: '10749', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });
  const allMovies = [
    ...popular.results.map(tag),
    ...topRated.results.map(tag),
    ...action.results.map(tag),
    ...romance.results.map(tag),
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, padding: '80px 40px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
          <Link href="/movies" style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 18 }}>All Movies</Link>
          <Link href="/movies/bollywood" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>🎬 Bollywood</Link>
        </div>
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>🎬 Bollywood Movies</h1>
        <div className="results-grid">
          {allMovies.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
