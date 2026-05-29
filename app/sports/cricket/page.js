'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

const CHANNELS = [
  { label: '⭐ Star Sports 1', hd: 25, desc: 'IPL & Bangladesh' },
  { label: '🎙 Star Hindi', hd: 26, desc: 'IPL Hindi' },
  { label: '🏏 Sky Sports', hd: 2, desc: 'England' },
  { label: '🌍 Willow', hd: 29, desc: 'ICC' },
];

const TOP_LEAGUES = ['IPL 2026', 'ICC World Cup', 'BPL', 'Asia Cup', 'Champions Trophy', 'T20 Internationals'];
const TOP_TEAMS = [
  { name: 'Bangladesh', flag: '🇧🇩' }, { name: 'India', flag: '🇮🇳' },
  { name: 'Australia', flag: '🇦🇺' }, { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Pakistan', flag: '🇵🇰' }, { name: 'South Africa', flag: '🇿🇦' },
  { name: 'New Zealand', flag: '🇳🇿' }, { name: 'Sri Lanka', flag: '🇱🇰' },
];

function cleanName(name) {
  if (!name) return '';
  const comma = name.split(',')[0].trim();
  const vs = comma.split(' vs ');
  if (vs.length >= 2) return vs[0].trim() + ' vs ' + vs[1].trim();
  return comma;
}

function toBDT(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
}

function matchContains(match, filter) {
  if (!filter) return true;
  const text = (match.name + ' ' + (match.series || '') + ' ' + (match.teams || []).join(' ')).toLowerCase();
  return text.includes(filter.toLowerCase());
}

function MatchCard({ match, type, onWatch }) {
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const t1Name = t1?.name || match.teams?.[0] || 'TBA';
  const t2Name = t2?.name || match.teams?.[1] || 'TBA';
  const t1Img = t1?.img;
  const t2Img = t2?.img;
  const borderColor = type === 'live' ? '#e50914' : '#1a1a2e';

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, overflow: 'hidden', boxShadow: type === 'live' ? '0 0 20px rgba(229,9,20,0.1)' : 'none', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 80, background: type === 'live' ? 'linear-gradient(135deg,#1a0a0a,#200808)' : type === 'upcoming' ? 'linear-gradient(135deg,#0a0a1a,#080820)' : 'linear-gradient(135deg,#111,#0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 12 }}>
        {t1Img ? <img src={t1Img} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t1Name} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏏</div>}
        <div style={{ fontSize: 10, color: '#333', fontWeight: 700 }}>VS</div>
        {t2Img ? <img src={t2Img} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t2Name} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏏</div>}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          {type === 'live' && <span style={{ background: '#e50914', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>📅 UPCOMING</span>}
          {type === 'old' && <span style={{ background: '#1e1e30', color: '#666', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>✅ ENDED</span>}
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 9, color: '#444', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.matchType?.toUpperCase()} • {match.venue?.split(',')[0] || ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t1Name}</div>
          <div style={{ fontSize: 9, color: '#333', fontWeight: 700, flexShrink: 0 }}>VS</div>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{t2Name}</div>
        </div>
        {match.score?.length > 0 && <div style={{ fontSize: 10, color: type === 'live' ? '#e50914' : '#555', marginBottom: 4 }}>{match.score.map((s, i) => <span key={i} style={{ marginRight: 8 }}>{s.r}/{s.w} ({s.o}ov)</span>)}</div>}
        {match.status && <div style={{ fontSize: 9, color: '#444', marginBottom: 4 }}>{match.status.replace(/GMT/g, 'BDT')}</div>}
        {type === 'upcoming' && match.dateTimeGMT && <div style={{ fontSize: 10, color: '#f5c518' }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
      {type === 'live' && (
        <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#e50914', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, padding: '8px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>▶ WATCH LIVE</button>
      )}
      {type === 'old' && (
        <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '8px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>📺 WATCH REPLAY</button>
      )}
    </div>
  );
}

export default function CricketPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState(0);
  const [activeLeague, setActiveLeague] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [watchMatch, setWatchMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    fetch('https://api.cricapi.com/v1/matches?apikey=' + API_KEY + '&offset=0')
      .then(r => r.json())
      .then(d => { setMatches(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filter = activeLeague || activeTeam;
  const allFiltered = matches.filter(m => matchContains(m, filter));
  const live = allFiltered.filter(m => m.matchStarted && !m.matchEnded);
  const upcoming = allFiltered.filter(m => !m.matchStarted);
  const old = allFiltered.filter(m => m.matchEnded);
  const heroMatch = watchMatch || live[0] || null;

  const handleWatch = (match) => {
    setWatchMatch(match);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeague = (l) => {
    setActiveLeague(activeLeague === l ? null : l);
    setActiveTeam(null);
  };

  const handleTeam = (t) => {
    setActiveTeam(activeTeam === t ? null : t);
    setActiveLeague(null);
  };

  const tabs = [
    { key: 'live', label: '🔴 Live', count: live.length },
    { key: 'upcoming', label: '📅 Upcoming', count: upcoming.length },
    { key: 'old', label: '📂 Results', count: old.length },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link href="/sports" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>← Sports</Link>
          <span style={{ color: '#222' }}>|</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff' }}>🏏 Cricket</h1>
          <Link href="/sports/football" style={{ marginLeft: 'auto', background: '#0e0e1a', border: '1px solid #1a1a2e', color: '#aaa', fontSize: 12, fontWeight: 600, padding: '8px 18px', borderRadius: 20, textDecoration: 'none' }}>⚽ Switch to Football</Link>
        </div>

        {/* TOP LEAGUES + TEAMS */}
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

        {/* ACTIVE FILTER BADGE */}
        {filter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>Showing:</span>
            <span style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{filter}</span>
            <button onClick={() => { setActiveLeague(null); setActiveTeam(null); }} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12 }}>✕ Clear</button>
          </div>
        )}

        {/* LIVE PLAYER */}
        {heroMatch && (
          <div style={{ background: 'linear-gradient(135deg,#1a0808,#200a0a)', border: '1px solid #e50914', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>{heroMatch.matchStarted && !heroMatch.matchEnded ? 'LIVE NOW' : 'REPLAY'}</span>
                <span style={{ fontSize: 11, color: '#444' }}>{heroMatch.matchType?.toUpperCase()} • {heroMatch.venue?.split(',')[0]}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{cleanName(heroMatch.name)}</div>
              {heroMatch.score?.length > 0 && (
                <div style={{ fontSize: 13, color: '#e50914', fontWeight: 600, marginBottom: 8 }}>
                  {heroMatch.score.map((s, i) => <span key={i} style={{ marginRight: 16 }}>{s.inning?.split(' Inning')[0]}: {s.r}/{s.w} ({s.o}ov)</span>)}
                </div>
              )}
              {heroMatch.status && <div style={{ fontSize: 11, color: '#555', marginBottom: 14 }}>{heroMatch.status.replace(/GMT/g, 'BDT')}</div>}
              <div style={{ fontSize: 11, color: '#444', marginBottom: 8 }}>Switch channels if stream is not working</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {CHANNELS.map((ch, i) => (
                  <div key={i} onClick={() => setActiveChannel(i)} style={{ background: activeChannel === i ? '#e50914' : '#0e0e1a', border: '1px solid ' + (activeChannel === i ? '#e50914' : '#333'), borderRadius: 20, padding: '6px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                    <div style={{ fontSize: 9, color: activeChannel === i ? 'rgba(255,255,255,0.6)' : '#444' }}>{ch.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', paddingTop: '42%', background: '#000' }}>
              <iframe
                key={activeChannel}
                src={'https://streamcrichd.com/update/fetch.php?hd=' + CHANNELS[activeChannel].hd + '&embed=1'}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                scrolling="no"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, background: activeTab === t.key ? '#e50914' : '#0e0e1a', color: activeTab === t.key ? '#fff' : '#555', transition: 'all 0.15s' }}>
              {t.label} {t.count > 0 && <span style={{ background: activeTab === t.key ? 'rgba(255,255,255,0.2)' : '#1a1a2e', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* MATCH CARDS */}
        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#444' }}>Loading matches...</div>}

        {!loading && activeTab === 'live' && (
          live.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No live matches right now</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {live.map(m => <MatchCard key={m.id} match={m} type="live" onWatch={handleWatch} />)}
              </div>
        )}

        {!loading && activeTab === 'upcoming' && (
          upcoming.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No upcoming matches</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {upcoming.slice(0, 16).map(m => <MatchCard key={m.id} match={m} type="upcoming" onWatch={handleWatch} />)}
              </div>
        )}

        {!loading && activeTab === 'old' && (
          old.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontSize: 14 }}>No recent results</div>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {old.slice(0, 16).map(m => <MatchCard key={m.id} match={m} type="old" onWatch={handleWatch} />)}
              </div>
        )}

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#333', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
