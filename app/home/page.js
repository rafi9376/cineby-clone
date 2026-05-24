import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTV, getNowPlaying, IMG_ORIGINAL } from '@/lib/tmdb';
import Link from 'next/link';

export default async function HomePage() {
  const [trending, popularMovies, topRated, popularTV, nowPlaying] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRatedMovies(),
    getPopularTV(),
    getNowPlaying(),
  ]);

  const hero = trending.results[0];
  const heroTitle = hero.title || hero.name;
  const heroBg = hero.backdrop_path ? `${IMG_ORIGINAL}${hero.backdrop_path}` : '';
  const isTV = hero.media_type === 'tv';
  const heroHref = isTV ? `/tv/${hero.id}` : `/movie/${hero.id}`;

  // Deduplicate — track all seen IDs
  const seenIds = new Set();

  const dedupe = (items) => {
    return items.filter(item => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });
  };

  const trendingItems = dedupe(trending.results);
  const nowPlayingItems = dedupe(nowPlaying.results);
  const popularMoviesItems = dedupe(popularMovies.results);
  const topRatedItems = dedupe(topRated.results.map(m => ({ ...m, media_type: 'movie' })));
  const popularTVItems = dedupe(popularTV.results.map(t => ({ ...t, media_type: 'tv' })));

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero-overlay" />
        <div className="detail-content">
          <div className="detail-info">
            <div className="hero-badge">🔥 Trending Now</div>
            <h1 className="hero-title">{heroTitle}</h1>
            <div className="hero-meta">
              <span style={{ color: '#f5c518' }}>⭐ {hero.vote_average?.toFixed(1)}</span>
              <span>{hero.release_date?.slice(0, 4) || hero.first_air_date?.slice(0, 4)}</span>
              <span>{isTV ? 'TV Show' : 'Movie'}</span>
            </div>
            <p className="hero-desc">{hero.overview}</p>
            <div className="hero-btns">
              <Link href={heroHref} className="btn-watch">▶ Watch Now</Link>
              <Link href={heroHref} className="btn-info">ℹ More Info</Link>
            </div>
          </div>
        </div>
      </section>
      <Carousel title="Trending This Week" items={trendingItems} seeAllHref="/movies" />
      <Carousel title="Latest Releases" items={nowPlayingItems} seeAllHref="/movies" />
      <Carousel title="Popular Movies" items={popularMoviesItems} seeAllHref="/movies" />
      <Carousel title="Top Rated Movies" items={topRatedItems} seeAllHref="/movies" />
      <Carousel title="Popular TV Shows" items={popularTVItems} seeAllHref="/tv" />
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
