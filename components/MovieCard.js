import Link from 'next/link';
import { IMG_BASE } from '../lib/tmdb';

export default function MovieCard({ item }) {
  const isTV = item.media_type === 'tv' || item.first_air_date;
  const title = item.title || item.name;
  const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : null;
  const rating = item.vote_average?.toFixed(1);
  const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <Link href={href} className="card">
      {isTV && <span className="card-type">TV</span>}
      {poster
        ? <img src={poster} alt={title} loading="lazy" />
        : <div className="card-no-img">🎬</div>
      }
      <div className="card-overlay">
        <div className="card-title">{title}</div>
        {rating && <div className="card-rating">⭐ {rating}</div>}
      </div>
    </Link>
  );
}