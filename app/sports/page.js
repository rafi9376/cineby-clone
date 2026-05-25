import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { fetchTMDB } from '@/lib/tmdb';

export default async function SportsPage() {
  const [cricket, football, basketball, tennis, formula1, wrestling, boxing, olympics] = await Promise.all([
    fetchTMDB('/search/tv', { query: 'cricket' }),
    fetchTMDB('/search/tv', { query: 'football soccer' }),
    fetchTMDB('/search/tv', { query: 'basketball NBA' }),
    fetchTMDB('/search/tv', { query: 'tennis' }),
    fetchTMDB('/search/tv', { query: 'formula 1 F1' }),
    fetchTMDB('/search/tv', { query: 'wrestling WWE' }),
    fetchTMDB('/search/tv', { query: 'boxing' }),
    fetchTMDB('/search/tv', { query: 'olympics' }),
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
