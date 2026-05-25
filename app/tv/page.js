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
  const seenIds = new Set();
  const dedupe = (items) => items.filter(item => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  const popularItems = dedupe(popular.results.map(tag));
  const topRatedItems = dedupe(topRated.results.map(tag));
  const dramaItems = dedupe(drama.results.map(tag));
  const scifiItems = dedupe(scifi.results.map(tag));

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="Popular TV Shows" items={popularItems} />
        <Carousel title="Top Rated Shows" items={topRatedItems} />
        <Carousel title="Drama" items={dramaItems} />
        <Carousel title="Sci-Fi & Fantasy" items={scifiItems} />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
