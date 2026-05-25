import Navbar from '@/components/Navbar';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

async function getMatches() {
  try {
    const res = await fetch('https://api.cricapi.com/v1/matches?apikey=' + API_KEY + '&offset=0', { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch(e) {
    return [];
  }
}

function toBDT(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
}

function cleanName(name) {
  if (!name) return '';
  const parts = name.split(',');
  const t1 = parts[0] ? parts[0].trim() : '';
  const t2 = parts[1] ? parts[1].trim() : '';
  if (t1 && t2) return t1 + ' vs ' + t2;
  return t1 || name;
}

function MatchCard(props) {
  const match = props.match;
  const type = props.type;
  const borderColor = type === 'live' ? '#e50914' : type === 'upcoming' ? '#f5c518' : '#1e1e30';
  const t1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0] : null;
  const t2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1] : null;
  const t1Name = t1 ? t1.name : (match.teams ? match.teams[0] : 'TBA');
  const t2Name = t2 ? t2.name : (match.teams ? match.teams[1] : 'TBA');
  const t1Img = t1 ? t1.img : null;
  const t2Img = t2 ? t2.img : null;
  const circleStyle = { width: 52, height: 52, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ffffff15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 };
  const imgStyle = { width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff15' };
  const nameStyle = { fontSize: 10, color: '#aaa', marginTop: 4, maxWidth: 60, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, padding: '16px 24px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          {t1Img ? <img src={t1Img} alt={t1Name} style={imgStyle} /> : <div style={circleStyle}>🏏</div>}
          <div style={nameStyle}>{t1Name}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555' }}>VS</div>
        <div style={{ textAlign: 'center' }}>
          {t2Img ? <img src={t2Img} alt={t2Name} style={imgStyle} /> : <div style={circleStyle}>🏏</div>}
          <div style={nameStyle}>{t2Name}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          {type === 'live' && <span style={{ background: '#e50914', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>📅 UPCOMING</span>}
          {type === 'recent' && <span style={{ background: '#1e1e30', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>✅ COMPLETED</span>}
          <span style={{ color: '#555', fontSize: 11 }}>{match.matchType ? match.matchType.toUpperCase() : ''}{match.venue ? ' • ' + match.venue.split(',')[0] : ''}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cleanName(match.name)}</div>
        {match.status && <div style={{ fontSize: 12, color: type === 'live' ? '#e50914' : '#666' }}>{match.status.replace(/GMT/g, 'BDT')}</div>}
        {type === 'upcoming' && match.dateTimeGMT && <div style={{ fontSize: 12, color: '#f5c518', marginTop: 2 }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 120 }}>
        {match.score && match.score.length > 0
          ? match.score.map(function(s, i) { return <div key={i} style={{ fontSize: 12, color: '#a0a0b8', marginBottom: 3 }}><span style={{ color: '#fff', fontWeight: 700 }}>{s.r}/{s.w}</span><span style={{ color: '#555', fontSize: 10 }}> ({s.o}ov)</span></div>; })
          : <span style={{ color: '#333', fontSize: 11 }}>—</span>}
      </div>
    </div>
  );
}

export default async function SportsPage() {
  const matches = await getMatches();
  const isIPL = function(m) { return m.name && (m.name.toLowerCase().includes('ipl') || m.name.toLowerCase().includes('indian premier')); };
  const ipl = matches.filter(isIPL);
  const live = matches.filter(function(m) { return m.matchStarted && !m.matchEnded && !isIPL(m); });
  const upcoming = matches.filter(function(m) { return !m.matchStarted; });
  const recent = matches.filter(function(m) { return m.matchEnded && !isIPL(m); });

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 90, padding: '90px 48px 48px', background: '#070710', minHeight: '100vh' }}>
        {ipl.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>🏆 IPL 2026</h2>
            {ipl.map(function(m) { return <MatchCard key={m.id} match={m} type={m.matchStarted && !m.matchEnded ? 'live' : m.matchEnded ? 'recent' : 'upcoming'} />; })}
          </div>
        )}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#e50914', marginBottom: 20 }}>🔴 LIVE MATCHES</h2>
          {live.length === 0 ? <p style={{ color: '#555', fontSize: 14 }}>No live matches right now</p> : live.map(function(m) { return <MatchCard key={m.id} match={m} type="live" />; })}
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>📅 UPCOMING MATCHES</h2>
          {upcoming.length === 0 ? <p style={{ color: '#555', fontSize: 14 }}>No upcoming matches</p> : upcoming.slice(0, 10).map(function(m) { return <MatchCard key={m.id} match={m} type="upcoming" />; })}
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff', marginBottom: 20 }}>🏆 RECENT RESULTS</h2>
          {recent.length === 0 ? <p style={{ color: '#555', fontSize: 14 }}>No recent results</p> : recent.slice(0, 10).map(function(m) { return <MatchCard key={m.id} match={m} type="recent" />; })}
        </div>
      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#666', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </div>
  );
}
