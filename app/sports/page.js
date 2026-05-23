import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { fetchTMDB } from '../lib/tmdb';

export default async function SportsPage() {
  const [cricket, football, basketball, tennis, formula1, wrestling, boxing, olympics] = await Promise.all([
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '6073', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '1395', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '3503', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '2245', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '3113', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '11451', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '1299', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_genres: '10767', with_keywords: '1977', sort_by: 'popularity.desc' }),
  ]);

  const tag = t => ({ ...t, media_type: 'tv' });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="🏏 Cricket" items={cricket.results.map(tag)} seeAllHref="/sports/cricket" />
        <Carousel title="⚽ Football" items={football.results.map(tag)} seeAllHref="/sports/football" />
        <Carousel title="🏀 Basketball" items={basketball.results.map(tag)} seeAllHref="/sports/basketball" />
        <Carousel title="🎾 Tennis" items={tennis.results.map(tag)} seeAllHref="/sports/tennis" />
        <Carousel title="🏎️ Formula 1" items={formula1.results.map(tag)} seeAllHref="/sports/formula1" />
        <Carousel title="🤼 Wrestling" items={wrestling.results.map(tag)} seeAllHref="/sports/wrestling" />
        <Carousel title="🥊 Boxing" items={boxing.results.map(tag)} seeAllHref="/sports/boxing" />
        <Carousel title="🏅 Olympics" items={olympics.results.map(tag)} seeAllHref="/sports/olympics" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
