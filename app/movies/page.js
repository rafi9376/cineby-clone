import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getPopularMovies, getTopRatedMovies, fetchTMDB } from '@/lib/tmdb';
import Link from 'next/link';

export default async function BollywoodPage() {
  const [hindi, tamil, telugu, malayalam, kannada, bengali, hindiTV] = await Promise.all([
    fetchTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ta', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'te', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ml', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'kn', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
  ]);

  const tag = (type) => (m) => ({ ...m, media_type: type });
  const allContent = [
    ...hindi.results.map(tag('movie')),
    ...tamil.results.map(tag('movie')),
    ...telugu.results.map(tag('movie')),
    ...malayalam.results.map(tag('movie')),
    ...kannada.results.map(tag('movie')),
    ...bengali.results.map(tag('movie')),
    ...hindiTV.results.map(tag('tv')),
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
   .sort((a, b) => b.popularity - a.popularity);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, padding: '80px 40px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
          <Link href="/movies" style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 18 }}>All Movies</Link>
          <Link href="/movies/bollywood" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>🇮🇳 Indian Content</Link>
        </div>
        <h1 style={{ marginBottom: 30, fontSize: 28 }}>🇮🇳 Indian Movies & Shows</h1>
        <div className="results-grid">
          {allContent.map(item => <MovieCard key={`${item.id}-${item.media_type}`} item={item} />)}
        </div>
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
