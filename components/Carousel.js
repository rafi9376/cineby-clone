import MovieCard from './MovieCard';

export default function Carousel({ title, items, seeAllHref }) {
  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {seeAllHref && <a href={seeAllHref} className="see-all">See All →</a>}
      </div>
      <div className="carousel">
        {items?.map(item => (
          <MovieCard key={`${item.id}-${item.media_type || 'movie'}`} item={item} />
        ))}
      </div>
    </div>
  );
}