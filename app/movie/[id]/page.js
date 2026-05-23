'use client';
import { useEffect, useState, use } from 'react';
import Navbar from '../../components/Navbar';
import Reviews from '../../components/Reviews';
import { IMG_ORIGINAL, IMG_BASE } from '../../../lib/tmdb';

export default function MoviePage({ params }) {
  const [movie, setMovie] = useState(null);
  const [server, setServer] = useState(0);
  const { id } = use(params);

const servers = [
    { name: '▶ Server 1', url: `https://vidsrc.to/embed/movie/${id}` },
    { name: '▶ Server 2', url: `https://vidsrc.cc/v2/embed/movie/${id}` },
    { name: '▶ Server 3', url: `https://vidsrc.xyz/embed/movie/${id}` },
    { name: '▶ Server 4', url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { name: '▶ Server 5', url: `https://autoembed.co/movie/tmdb/${id}` },
  ];

  useEffect(() => {
    if (!id) return;
    fetch(`/api/movie/${id}`)
      .then(r => r.json())
      .then(setMovie);
  }, [id]);

  if (!movie) return <div className="loading">Loading...</div>;

  const bg = movie.backdrop_path ? `${IMG_ORIGINAL}${movie.backdrop_path}` : '';
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 12) || [];

  return (
    <>
      <Navbar />
      <div className="detail-hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${bg})` }} />
        <div className="hero-overlay" />
        <div className="detail-content">
          {poster && (
            <div className="detail-poster">
              <img src={poster} alt={movie.title} />
            </div>
          )}
          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-meta">
              <span style={{ color: '#f5c518' }}>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span>{movie.runtime} min</span>
              {movie.genres?.map(g => <span key={g.id} className="tag">{g.name}</span>)}
            </div>
            <p className="detail-overview">{movie.overview}</p>
            <div className="hero-btns">
              <a href="#player" className="btn-watch">▶ Watch Now</a>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="btn-info">🎬 Trailer</a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div id="player" className="player-section">
        <div className="player-wrap">
          <div className="player-title">🎬 Now Playing</div>
          <div className="player-frame">
            <iframe src={servers[server].url} allowFullScreen allow="autoplay; fullscreen" referrerPolicy="no-referrer" />
          </div>
          <div className="server-btns">
            {servers.map((s, i) => (
              <button key={i} className={`server-btn ${server === i ? 'active' : ''}`} onClick={() => setServer(i)}>{s.name}</button>
            ))}
          </div>
        </div>
      </div>
      {cast.length > 0 && (
        <div className="cast-section">
          <h2 className="section-title" style={{ marginBottom: 20 }}>Cast</h2>
          <div className="cast-grid">
            {cast.map(actor => (
              <div key={actor.id} className="cast-card">
                <img className="cast-img" src={actor.profile_path ? `${IMG_BASE}${actor.profile_path}` : 'https://via.placeholder.com/80x80/1a1a26/888?text=?'} alt={actor.name} />
                <div className="cast-name">{actor.name}</div>
                <div className="cast-char">{actor.character}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Reviews movieId={id} />
        <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
