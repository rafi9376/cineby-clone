'use client';
import { useEffect, useState, use } from 'react';
import Navbar from '../../../components/Navbar';
import { IMG_ORIGINAL, IMG_BASE } from '../../../lib/tmdb';
import Reviews from '../../../components/Reviews';

export default function TVPage({ params }) {
  const [show, setShow] = useState(null);
  const [server, setServer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const { id } = use(params);
  const servers = [
  { name: '▶ Vidking', url: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}` },
  { name: '▶ Server 1', url: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` },
  { name: '▶ Server 2', url: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}` },
  { name: '▶ Server 3', url: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}` },
  { name: '▶ Server 4', url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}` },
  { name: '▶ Server 5', url: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}` },
];

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tv/${id}`)
      .then(r => r.json())
      .then(setShow);
  }, [id]);

  if (!show) return <div className="loading">Loading...</div>;

  const bg = show.backdrop_path ? `${IMG_ORIGINAL}${show.backdrop_path}` : '';
  const poster = show.poster_path ? `${IMG_BASE}${show.poster_path}` : null;
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const seasons = show.number_of_seasons || 1;
  const selectedSeason = show.seasons?.find(s => s.season_number === season);
  const episodeCount = selectedSeason?.episode_count || 10;

  return (
    <>
      <Navbar />
      <div className="detail-hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${bg})` }} />
        <div className="hero-overlay" />
        <div className="detail-content">
          {poster && (
            <div className="detail-poster">
              <img src={poster} alt={show.name} />
            </div>
          )}
          <div className="detail-info">
            <h1 className="detail-title">{show.name}</h1>
            <div className="detail-meta">
              <span style={{ color: '#f5c518' }}>⭐ {show.vote_average?.toFixed(1)}</span>
              <span>{show.first_air_date?.slice(0, 4)}</span>
              <span>{show.number_of_seasons} Seasons</span>
              {show.genres?.map(g => <span key={g.id} className="tag">{g.name}</span>)}
            </div>
            <p className="detail-overview">{show.overview}</p>
            <a href="#player" className="btn-watch">▶ Watch Now</a>
          </div>
        </div>
      </div>
      <div id="player" className="player-section">
        <div className="player-wrap">
          <div className="player-title">📺 Now Playing</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <select value={season} onChange={e => { setSeason(Number(e.target.value)); setEpisode(1); }} style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>
              {Array.from({ length: seasons }, (_, i) => i + 1).map(s => (
                <option key={s} value={s}>Season {s}</option>
              ))}
            </select>
            <select value={episode} onChange={e => setEpisode(Number(e.target.value))} style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 6, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>
              {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                <option key={ep} value={ep}>Episode {ep}</option>
              ))}
            </select>
          </div>
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
