import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { fetchTMDB } from '@/lib/tmdb';

const categoryMap = {
  cricket:    'cricket',
  football:   'football soccer',
  basketball: 'basketball NBA',
  tennis:     'tennis',
  formula1:   'formula 1 F1',
  wrestling:  'wrestling WWE',
  boxing:     'boxing',
  olympics:   'olympics',
};

const emojiMap = {
  cricket: '🏏', football: '⚽', basketball: '🏀',
  tennis: '🎾', formula1: '🏎️', wrestling: '🤼',
  boxing: '🥊', olympics: '🏅',
};

export default async function SportsCategoryPage({ params }) {
  const { category } = params;
  const query = categoryMap[category] || category;
  const data = await fetchTMDB('/search/tv', { query });
  const items = data.results.map(t => ({ ...t, media_type: 'tv' }));
  const emoji = emojiMap[category] || '🏆';

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100, padding: '100px 48px 48px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, marginBottom: 32 }}>
          {emoji} All {category.charAt(0).toUpperCase() + category.slice(1)} Shows
        </h1>
        <div className="results-grid">
          {items.map(item => <MovieCard key={item.id} item={item} />)}
        </div>
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
