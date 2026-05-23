import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTV, IMG_ORIGINAL } from '../lib/tmdb';
import Link from 'next/link';

export default async function HomePage() {
  const [trending, popularMovies, topRated, popularTV] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRatedMovies(),
    getPopularTV(),
  ]);

  const hero = trending.results[0];
  const heroTitle = hero.title || hero.name;
  const heroBg = hero.backdrop_path ? `${IMG_ORIGINAL}${hero.backdrop_path}` : '';
  const isTV = hero.media_type === 'tv';
  const heroHref = isTV ? `/tv/${hero.id}` : `/movie/${hero.id}`;

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
              <span>{hero.release_date?.slice(0, 4) || hero.first_air_date?.slice(0,4)}</span>
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
      <Carousel title="Trending This Week" items={trending.results} seeAllHref="/movies" />
      <Carousel title="Popular Movies" items={popularMovies.results} seeAllHref="/movies" />
      <Carousel title="Top Rated Movies" items={topRated.results.map(m => ({ ...m, media_type: 'movie' }))} seeAllHref="/movies" />
      <Carousel title="Popular TV Shows" items={popularTV.results.map(t => ({ ...t, media_type: 'tv' }))} seeAllHref="/tv" />
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
