import Navbar from '../../components/Navbar';
import Carousel from '../../components/Carousel';
import { getPopularMovies, getTopRatedMovies, fetchTMDB } from '../../lib/tmdb';

export default async function MoviesPage() {
  const [popular, topRated, action, comedy] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    fetchTMDB('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="Popular Movies" items={popular.results.map(tag)} />
        <Carousel title="Top Rated" items={topRated.results.map(tag)} />
        <Carousel title="Action" items={action.results.map(tag)} />
        <Carousel title="Comedy" items={comedy.results.map(tag)} />
      </div>
      <footer>
        <p>Made with ❤️ using <span>TMDB API</span> • For personal use only</p>
      </footer>
    </>
  );
}