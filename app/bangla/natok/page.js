import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { fetchTMDB } from '@/lib/tmdb';

export default async function BanglaNatokPage() {
  const [latest, popular, topRated, drama, comedy] = await Promise.all([
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'BD', sort_by: 'release_date.desc', 'first_air_date.gte': '2020-01-01' }),
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'BD', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'BD', sort_by: 'vote_average.desc', 'vote_count.gte': '20' }),
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'BD', with_genres: '18', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'BD', with_genres: '35', sort_by: 'popularity.desc' }),
  ]);

  const tag = t => ({ ...t, media_type: 'tv' });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="🆕 Latest Bangla Natok" items={latest.results.map(tag)} seeAllHref="/bangla/natok/latest" />
        <Carousel title="🔥 Popular Bangla Natok" items={popular.results.map(tag)} seeAllHref="/bangla/natok/popular" />
        <Carousel title="⭐ Top Rated Bangla Natok" items={topRated.results.map(tag)} seeAllHref="/bangla/natok/toprated" />
        <Carousel title="🎭 Drama Natok" items={drama.results.map(tag)} seeAllHref="/bangla/natok/drama" />
        <Carousel title="😂 Comedy Natok" items={comedy.results.map(tag)} seeAllHref="/bangla/natok/comedy" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
