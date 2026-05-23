import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { fetchTMDB } from '../lib/tmdb';

export default async function BanglaPage() {
  const [latest, popular, topRated, action, romance] = await Promise.all([
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'BD', sort_by: 'release_date.desc', 'primary_release_date.gte': '2020-01-01' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'BD', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'BD', sort_by: 'vote_average.desc', 'vote_count.gte': '50' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'BD', with_genres: '28', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'BD', with_genres: '10749', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="🆕 Latest Bangla Movies" items={latest.results.map(tag)} seeAllHref="/bangla/latest" />
        <Carousel title="🔥 Popular Bangla Movies" items={popular.results.map(tag)} seeAllHref="/bangla/popular" />
        <Carousel title="⭐ Top Rated Bangla Movies" items={topRated.results.map(tag)} seeAllHref="/bangla/toprated" />
        <Carousel title="💥 Bangla Action Movies" items={action.results.map(tag)} seeAllHref="/bangla/action" />
        <Carousel title="❤️ Bangla Romance Movies" items={romance.results.map(tag)} seeAllHref="/bangla/romance" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
