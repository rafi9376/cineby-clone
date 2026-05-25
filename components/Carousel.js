'use client';
import { useRef } from 'react';
import MovieCard from './MovieCard';

export default function Carousel({ title, items, seeAllHref }) {
  const carouselRef = useRef(null);

  const scroll = (dir) => {
    carouselRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {seeAllHref && <a href={seeAllHref} className="see-all">See All →</a>}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => scroll(-1)} style={{
          position: 'absolute', left: '2px', top: '50%', transform: 'translateY(-50%)',
          width: '38px', height: '62px', borderRadius: '24px',
          background: '#cc0000', border: '2px solid #ff6666',
          color: '#fff', fontSize: '22px', fontWeight: '900',
          fontFamily: 'Arial, sans-serif', cursor: 'pointer',
          zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(200,0,0,0.9)'
        }}>{'<'}</button>

        <div className="carousel" ref={carouselRef}>
          {items?.map(item => (
            <MovieCard key={`${item.id}-${item.media_type || 'movie'}`} item={item} />
          ))}
        </div>

        <button onClick={() => scroll(1)} style={{
          position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%)',
          width: '38px', height: '62px', borderRadius: '24px',
          background: '#cc0000', border: '2px solid #ff6666',
          color: '#fff', fontSize: '22px', fontWeight: '900',
          fontFamily: 'Arial, sans-serif', cursor: 'pointer',
          zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(200,0,0,0.9)'
        }}>{'>'}</button>
      </div>
    </div>
  );
}
