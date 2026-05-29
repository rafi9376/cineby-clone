'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const TOP_LEAGUES = ['Premier League', 'Champions League', 'La Liga', 'Serie A', 'Bundesliga', 'FIFA World Cup 2026'];
const TOP_TEAMS = [
  { name: 'Man City', flag: '🔵' }, { name: 'Arsenal', flag: '🔴' },
  { name: 'Real Madrid', flag: '⚪' }, { name: 'Barcelona', flag: '🔵' },
  { name: 'PSG', flag: '🔵' }, { name: 'Bayern', flag: '🔴' },
  { name: 'Liverpool', flag: '🔴' }, { name: 'Juventus', flag: '⚫' },
];

function toBDT(kickoff) {
  if (!kickoff) return '';
  try {
    const date = new Date(kickoff.replace(' ', 'T') + '+07:00');
    const bdt = new Date(date.getTime() - 60 * 60 * 1000);
    return bdt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
  } catch { return kickoff; }
}

function isLive(match) {
  try {
    const now = new Date();
    const start = new Date(match.kickoff.replace(' ', 'T') + '+07:00');
    const end = new Date(match.endTime.replace(' ', 'T') + '+07:00');
    return now >= start && now <= end;
  } catch { return false; }
}

function isUpcoming(match) {
  try {
    const now = new Date();
    const start = new Date(match.kickoff.replace(' ', 'T') + '+07:00');
    return now < start;
  } catch { return false; }
}

function matchContains(match, filter) {
  if (!filter) return true;
  const text = ((match.tag || '') + ' ' + (match.league || '')).toLowerCase();
  return text.includes(filter.toLowerCase());
}

function FootballCard({ match, type, onWatch }) {
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];
  const borderColor = type === 'live' ? '#e50914' : '#1a1a2e';

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, overflow: 'hidden', boxShadow: type === 'live' ? '0 0 20px rgba(229,9,20,0.1)' : 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 80, position: 'relative', overflow: 'hidden', background: type === 'live' ? 'linear-gradient(135deg,#1a0a0a,#200808)' : type === 'upcoming' ? 'linear-gradient(135deg,#0a0a1a,#080820)' : 'linear-gradient(135deg,#111,#0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {match.poster && <img src={match.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚽</div>
          <div style={{ fontSize: 10, color: '#333', fontWeight: 700 }}>VS</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚽</div>
        </div>
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
          {type === 'live' && <span style={{ background: '#e50914', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>📅 UPCOMING</span>}
          {type === 'old' && <span style={{ background: '#1e1e30', color: '#666', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>✅ ENDED</span>}
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 9, color: '#444', marginBottom: 4 }}>{match.league || 'Football'}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{teams[0]}</div>
          <div style={{ fontSize: 9, color: '#333', fontWeight: 700, flexShrink: 0 }}>VS</div>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{teams[1] || ''}</div>
        </div>
        {type === 'upcoming' && <div style={{ fontSize: 10, color: '#f5c518' }}>🕐 {toBDT(match.kickoff)}</div>}
      </div>
      {type === 'live' && match.iframes?.length > 0 && (
        <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#e50914', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, padding: '8px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>▶ WATCH LIVE</button>
      )}
      {type === 'old' && match.iframes?.length > 0 && (
        <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '8px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>📺 WATCH REPLAY</button>
      )}
    </div>
  );
}

export default function FootballPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [watchMatch, setWatchMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('live');
  const [activeStream, setActiveStream] = useState(0);

  useEffect(() => {
    fetch('https://api.embedsportex.site/api/streams')
      .then(r => r.json())
      .then(d => { setMatches(d.football || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filter = activeLeague || activeTeam;
  const allFiltered = matches.filter(m => matchContains(m, filter));
  const live = allFiltered.filter(isLive);
  const upcoming = allFiltered.filter(isUpcoming);
  const old = allFiltered.filter(m => !isLive(m) && !isUpcoming(m));
  const heroMatch = watchMatch || live[0] || null;

  const handleWatch = (match) => {
    setWatchMatch(match);
    setActiveStream(0);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeague = (l) => { setActiveLeague(activeLeague === l ? null : l); setActiveTeam(null); };
  const handleTeam = (t) => { setActiveTeam(activeTeam === t ? null : t); setActiveLeague(null); };

  const tabs = [
    { key: 'live', label: '🔴 Live', count: live.length },
    { key: 'upcoming', label: '📅 Upcoming', count: upcoming.length },
    { key: 'old', label: '📂 Results', count: old.length },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link href="/sports" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>← Sports</Link>
          <span style={{ color: '#222' }}>|</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff' }}>⚽ Football</h1>
          <Link href="/sports/cricket" style={{ marginLeft: 'auto', background: '#0e0e1a', border: '1px solid #1a1a2e', color: '#aaa', fontSize: 12, fontWeight: 600, padding: '8px 18px', borderRadius: 20, textDecoration: 'none' }}>🏏 Switch to Cricket</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Top Leagues</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TOP_LEAGUES.map(l => (
                <div key={l} onClick={() => handleLeague(l)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: activeLeague === l ? 'rgba(229,9,20,0.15)' : 'transparent', border: activeLeague === l ? '1px solid rgba(229,9,20,0.3)' : '1px solid transparent', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 14 }}>🏆</span>
                  <span style={{ fontSize: 13, color: activeLeague === l ? '#e50914' : '#aaa', fontWeight: activeLeague === l ? 700 : 400 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Top Teams</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {TOP_TEAMS.map(t => (
                <div key={t.name} onClick={() => handleTeam(t.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: activeTeam === t.name ? 'rgba(229,9,20,0.15)' : 'transparent', border: activeTeam === t.name ? '1px solid rgba(229,9,20,0.3)' : '1px solid transparent', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 16 }}>{t.flag}</span>
                  <span style={{ fontSize: 12, color: activeTeam === t.name ? '#e50914' : '#aaa', fontWeight: activeTeam === t.name ? 700 : 400 }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>Showing:</span>
            <span style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{filter}</span>
            <button onClick={() => { setActiveLeague(null); setActiveTeam(null); }} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12 }}>✕ Clear</button>
          </div>
        )}

        {/* LIVE HERO PLAYER */}
        {heroMatch && heroMatch.iframes?.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg,#1a0808,#200a0a)', border: '1px solid #e50914', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>LIVE NOW</span>
                <span style={{ fontSize: 11, color: '#444' }}>{heroMatch.league}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 14 }}>{heroMatch.tag}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 0 }}>
                {heroMatch.iframes.slice(0, 5).map((iframe, i) => (
                  <button key={i} onClick={() => setActiveStream(i)} style={{ background: activeStream === i ? '#e50914' : '#0e0e1a', border: '1px solid ' + (activeStream === i ? '#e50914' : '#333'), color: '#fff', fontSize: 11, fontWeight: 700, padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    ▶ {iframe.server}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', paddingTop: '42%', background: '#000' }}>
              <iframe
                key={activeStream}
                src={heroMatch.iframes[activeStream]?.url}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, background: activeTab === t.key ? '#e50914' : '#0e0e1a', color: activeTab === t.key ? '#fff' : '#555', transition: 'all 0.15s' }}>
              {t.label} {t.count > 0 && <span style={{ background: activeTab === t.key ? 'rgba(255,255,255,0.2)' : '#1a1a2e', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#444' }}>Loading matches...</div>}

        {!loading && activeTab === 'live' && (
          live.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No live matches right now</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {live.map(m => <FootballCard key={m.slug} match={m} type="live" onWatch={handleWatch} />)}
              </div>
        )}
        {!loading && activeTab === 'upcoming' && (
          upcoming.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No upcoming matches</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {upcoming.slice(0, 16).map(m => <FootballCard key={m.slug} match={m} type="upcoming" onWatch={handleWatch} />)}
              </div>
        )}
        {!loading && activeTab === 'old' && (
          old.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No results available</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {old.slice(0, 16).map(m => <FootballCard key={m.slug} match={m} type="old" onWatch={handleWatch} />)}
              </div>
        )}

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#333', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
