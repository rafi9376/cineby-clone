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
  const team1 = parts[0] ? parts[0].trim() : '';
  const team2 = parts[1] ? parts[1].trim() : '';
  if (team1 && team2) return team1 + ' vs ' + team2;
  return parts[0] ? parts[0].trim() : name;
}

export default async function SportsPage() {
  const matches = await getMatches();

  const ipl = matches.filter(function(m) {
    return m.name && (m.name.toLowerCase().includes('ipl') || m.name.toLowerCase().includes('indian premier'));
  });
  const live = matches.filter(function(m) {
    return m.matchStarted && !m.matchEnded && !(m.name && m.name.toLowerCase().includes('ipl'));
  });
  const upcoming = matches.filter(function(m) {
    return !m.matchStarted;
  });
  const recent = matches.filter(function(m) {
    return m.matchEnded && !(m.name && m.name.toLowerCase().includes('ipl'));
  });

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 90, padding: '90px 48px 48px', background: '#070710', minHeight: '100vh' }}>

        {ipl.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>
              🏆 IPL 2026
            </h2>
            {ipl.map(function(m) {
              const t = m.matchStarted && !m.matchEnded ? 'live' : m.matchEnded ? 'recent' : 'upcoming';
              return <MatchCard key={m.id} match={m} type={t} />;
            })}
          </div>
        )}

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#e50914', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
            LIVE MATCHES
          </h2>
          {live.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No live matches right now</p>
            : live.map(function(m) { return <MatchCard key={m.id} match={m} type="live" />; })}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>
            📅 UPCOMING MATCHES
          </h2>
          {upcoming.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No upcoming matches</p>
            : upcoming.slice(0, 10).map(function(m) { return <MatchCard key={m.id} match={m} type="upcoming" />; })}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff', marginBottom: 20 }}>
            🏆 RECENT RESULTS
          </h2>
          {recent.length === 0
            ? <p style={{ color: '#555', fontSize: 14 }}>No recent results</p>
            : recent.slice(0, 10).map(function(m) { return <MatchCard key={m.id} match={m} type="recent" />; })}
        </div>

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#666', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </div>
  );
}

function MatchCard(props) {
  const match = props.match;
  const type = props.type;
  const borderColor = type === 'live' ? '#e50914' : type === 'upcoming' ? '#f5c518' : '#1e1e30';
  const team1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0] : null;
  const team2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1] : null;
  const team1Name = team1 ? team1.name : (match.teams && match.teams[0] ? match.teams[0] : 'TBA');
  const team2Name = team2 ? team2.name : (match.teams && match.teams[1] ? match.teams[1] : 'TBA');
  const team1Img = team1 ? team1.img : null;
  const team2Img = team2 ? team2.img : null;

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, padding: '16px 24px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', boxShadow: type === 'live' ? '0 0 24px rgba(229,9,20,0.15)' : 'none' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          {team1Img
            ? <img src={team1Img} alt={team1Name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff15', background: '#1a1a2e' }} />
            : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ffffff15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏏</div>
