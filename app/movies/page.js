import Navbar from '../../../components/Navbar';
import MovieCard from '../../../components/MovieCard';
import { fetchTMDB } from '../../../lib/tmdb';
import Link from 'next/link';

export default async function BollywoodPage() {
  const [hindi, tamil, telugu, malayalam, kannada, bengali] = await Promise.all([
    fetchTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ta', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'te', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ml', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'kn', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });
  const allMovies = [
    ...hindi.results.map(tag),
    ...tamil.results.map(tag),
    ...telugu.results.map(tag),
    ...malayalam.results.map(tag),
    ...kannada.results.map(tag),
    ...bengali.results.map(tag),
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
   .sort((a, b) => b.popularity - a.popularity);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, padding: '80px 40px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
          <Link href="/movies" style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 18 }}>All Movies</Link>
          <Link href="/movies/bollywood" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>🎬 Indian Movies</Link>
        </div>
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>🎬 Indian Movies</h1>
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
