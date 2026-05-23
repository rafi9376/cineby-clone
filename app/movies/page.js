import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getPopularMovies, getTopRatedMovies, fetchTMDB } from '@/lib/tmdb';
import Link from 'next/link';

export default async function MoviesPage() {
  const [popular, topRated, action, comedy] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    fetchTMDB('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });
  const allMovies = [
    ...popular.results.map(tag),
    ...topRated.results.map(tag),
    ...action.results.map(tag),
    ...comedy.results.map(tag),
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, padding: '80px 40px' }}>
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>All Movies</h1>
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
