import Navbar from '@/components/Navbar';
import Link from 'next/link';

async function getMatches() {
  try {
    const res = await fetch('https://api.embedsportex.site/api/streams', { next: { revalidate: 60 } });
    const data = await res.json();
    return data.football || [];
  } catch { return []; }
}

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

const TOP_LEAGUES = ['Premier League', 'Champions League', 'La Liga', 'Serie A', 'Bundesliga', 'FIFA World Cup 2026'];
const TOP_TEAMS = [
  { name: 'Man City', flag: '🔵' }, { name: 'Arsenal', flag: '🔴' },
  { name: 'Real Madrid', flag: '⚪' }, { name: 'Barcelona', flag: '🔵' },
  { name: 'PSG', flag: '🔵' }, { name: 'Bayern', flag: '🔴' },
  { name: 'Liverpool', flag: '🔴' }, { name: 'Juventus', flag: '⚫' },
];

function FootballCard({ match, type }) {
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];
  const borderColor = type === 'live' ? '#e50914' : '#1a1a2e';

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, overflow: 'hidden', boxShadow: type === 'live' ? '0 0 20px rgba(229,9,20,0.1)' : 'none' }}>
      <div style={{ height: 80, background: type === 'live' ? 'linear-gradient(135deg,#1a0a0a,#200808)' : type === 'upcoming' ? 'linear-gradient(135deg,#0a0a1a,#080820)' : 'linear-gradient(135deg,#111,#0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 12 }}>
        {match.poster
          ? <img src={match.poster} alt={match.tag} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.4 }} />
          : null}
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
        <div style={{ padding: '0 12px 10px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {match.iframes.slice(0, 3).map((iframe, i) => (
            <a key={i} href={iframe.url} target="_blank" rel="noopener noreferrer" style={{ background: i === 0 ? '#e50914' : '#1a1a2e', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 4, textDecoration: 'none', border: i === 0 ? 'none' : '1px solid #2a2a3e' }}>
              ▶ {iframe.server}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function FootballPage() {
  const matches = await getMatches();
  const live = matches.filter(isLive);
  const upcoming = matches.filter(isUpcoming);
  const old = matches.filter(m => !isLive(m) && !isUpcoming(m));
  const heroMatch = live[0] || null;

  return (
    <>
      <Navbar />
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        {/* BACK + TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link href="/sports" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>← Sports</Link>
          <span style={{ color: '#222' }}>|</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff' }}>⚽ Football</h1>
          <Link href="/sports/cricket" style={{ marginLeft: 'auto', background: '#0e0e1a', border: '1px solid #1a1a2e', color: '#aaa', fontSize: 12, fontWeight: 600, padding: '8px 18px', borderRadius: 20, textDecoration: 'none' }}>🏏 Switch to Cricket</Link>
        </div>

        {/* TOP LEAGUES + TEAMS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Top Leagues</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TOP_LEAGUES.map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}>
                  <span style={{ fontSize: 14 }}>🏆</span>
                  <span style={{ fontSize: 13, color: '#aaa' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Top Teams</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {TOP_TEAMS.map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}>
                  <span style={{ fontSize: 16 }}>{t.flag}</span>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE HERO */}
        {heroMatch && (
          <div style={{ background: 'linear-gradient(135deg,#1a0808,#200a0a)', border: '1px solid #e50914', borderRadius: 16, padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>LIVE NOW</span>
              <span style={{ fontSize: 11, color: '#444' }}>{heroMatch.league}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{heroMatch.tag}</div>
            {heroMatch.iframes?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {heroMatch.iframes.slice(0, 4).map((iframe, i) => (
                  <a key={i} href={iframe.url} target="_blank" rel="noopener noreferrer" style={{ background: i === 0 ? '#e50914' : '#0e0e1a', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', border: i === 0 ? 'none' : '1px solid #333' }}>
                    ▶ {iframe.server}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LIVE */}
        {live.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#e50914', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔴 Live Matches <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {live.map(m => <FootballCard key={m.slug} match={m} type="live" />)}
            </div>
          </div>
        )}

        {/* UPCOMING */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#f5c518', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              📅 Upcoming Matches <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {upcoming.slice(0, 12).map(m => <FootballCard key={m.slug} match={m} type="upcoming" />)}
            </div>
          </div>
        )}

        {/* OLD */}
        {old.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              ✅ Recent Results <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {old.slice(0, 12).map(m => <FootballCard key={m.slug} match={m} type="old" />)}
            </div>
          </div>
        )}

        {live.length === 0 && upcoming.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#333', fontSize: 14 }}>No football matches available right now</div>
        )}

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#333', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
