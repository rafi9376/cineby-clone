import Navbar from '@/components/Navbar';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

async function getMatches() {
  try {
    const res = await fetch(`https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function toBDT(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleString('en-US', options) + ' BDT';
}

function cleanName(name) {
  if (!name) return '';
  const parts = name.split(',');
  if (parts.length >= 2) {
    return parts[0].trim() + ' vs ' + parts[1].trim().split(',')[0].trim();
  }
  return name;
}

export default async function SportsPage() {
  const matches = await getMatches();

  const ipl = matches.filter(m => m.name?.toLowerCase().includes('ipl') || m.series?.toLowerCase().includes('ipl') || m.name?.toLowerCase().includes('indian premier'));
  const live = matches.filter(m => m.matchStarted && !m.matchEnded && !m.name?.toLowerCase().includes('ipl'));
  const upcoming = matches.filter(m => !m.matchStarted);
  const recent = matches.filter(m => m.matchEnded && !m.name?.toLowerCase().includes('ipl'));

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 90, padding: '90px 48px 48px', background: '#070710', minHeight: '100vh' }}>

        {/* IPL */}
        {ipl.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              🏆 IPL 2026
            </h2>
            {ipl.map(m => <MatchCard key={m.id} match={m} type={m.matchStarted && !m.matchEnded ? 'live' : m.matchEnded ? 'recent' : 'upcoming'} />)}
          </div>
        )}

        {/* LIVE */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#e50914', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
            LIVE MATCHES
          </h2>
          {live.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No live matches right now</p>
            : live.map(m => <MatchCard key={m.id} match={m} type="live" />)}
        </div>

        {/* UPCOMING */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>
            📅 UPCOMING MATCHES
          </h2>
          {upcoming.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No upcoming matches</p>
            : upcoming.slice(0, 10).map(m => <MatchCard key={m.id} match={m} type="upcoming" />)}
        </div>

        {/* RECENT */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff', marginBottom: 20 }}>
            🏆 RECENT RESULTS
          </h2>
          {recent.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No recent results</p>
            : recent.slice(0, 10).map(m => <MatchCard key={m.id} match={m} type="recent" />)}
        </div>

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#666', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}

function MatchCard({ match, type }) {
  const borderColor = type === 'live' ? '#e50914' : type === 'upcoming' ? '#f5c518' : '#1e1e30';
  const team1 = match.teamInfo?.[0];
  const team2 = match.teamInfo?.[1];
  const team1Name = team1?.name || match.teams?.[0] || 'TBA';
  const team2Name = team2?.name || match.teams?.[1] || 'TBA';
  const team1Img = team1?.img || null;
  const team2Img = team2?.img || null;

  return (
    <div style={{
      background: '#0e0e1a',
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      padding: '16px 24px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap',
      boxShadow: type === 'live' ? '0 0 24px rgba(229,9,20,0.15)' : 'none'
    }}>

      {/* TEAM IMAGES + VS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          {team1Img
            ? <img src={team1Img} alt={team1Name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff15', background: '#1a1a2e' }} />
            : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ffffff15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏏</div>
          }
          <div style={{ fontSize: 10, color: '#aaa', marginTop: 4, maxWidth: 60, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{team1Name}</div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', padding: '0 4px' }}>VS</div>

        <div style={{ textAlign: 'center' }}>
          {team2Img
            ? <img src={team2Img} alt={team2Name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff15', background: '#1a1a2e' }} />
            : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ffffff15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏏</div>
          }
          <div style={{ fontSize: 10, color: '#aaa', marginTop: 4, maxWidth: 60, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{team2Name}</div>
        </div>
      </div>

      {/* MATCH INFO */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          {type === 'live' && <span style={{ background: '#e50914', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>📅 UPCOMING</span>}
          {type === 'recent' && <span style={{ background: '#1e1e30', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>✅ COMPLETED</span>}
          <span style={{ color: '#555', fontSize: 11 }}>{match.matchType?.toUpperCase()} • {match.venue?.split(',')[0] || 'Venue TBC'}</span>
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {cleanName(match.name)}
        </div>

        {match.status && (
          <div style={{ fontSize: 12, color: type === 'live' ? '#e50914' : '#666' }}>{match.status}</div>
        )}
        {type === 'upcoming' && match.dateTimeGMT && (
          <div style={{ fontSize: 12, color: '#f5c518', marginTop: 2 }}>🕐 {toBDT(match.dateTimeGMT)}</div>
        )}
      </div>

      {/* SCORES */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 130 }}>
        {match.score?.length > 0 ? match.score.map((s, i) => (
          <div key={i} style={{ fontSize: 12, color: '#a0a0b8', marginBottom: 3 }}>
            <span style={{ color: '#666', fontSize: 10 }}>{s.inning?.split(' Inning')[0]}: </span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{s.r}/{s.w}</span>
            <span style={{ color: '#555', fontSize: 10 }}> ({s.o}ov)</span>
          </div>
        )) : <span style={{ color: '#333', fontSize: 11 }}>—</span>}
      </div>
    </div>
  );
}
