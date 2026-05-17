import Navbar from '../../components/Navbar';
import Carousel from '../../components/Carousel';
import { getPopularTV, getTopRatedTV, fetchTMDB } from '../../lib/tmdb';

export default async function TVPage() {
  const [popular, topRated, drama, scifi] = await Promise.all([
    getPopularTV(),
    getTopRatedTV(),
    fetchTMDB('/discover/tv', { with_genres: '18', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10765', sort_by: 'popularity.desc' }),
  ]);

  const tag = t => ({ ...t, media_type: 'tv' });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="Popular TV Shows" items={popular.results.map(tag)} />
        <Carousel title="Top Rated Shows" items={topRated.results.map(tag)} />
        <Carousel title="Drama" items={drama.results.map(tag)} />
        <Carousel title="Sci-Fi & Fantasy" items={scifi.results.map(tag)} />
      </div>
      <footer>
        <p>Made with ❤️ using <span>TMDB API</span> • For personal use only</p>
      </footer>
    </>
  );
}