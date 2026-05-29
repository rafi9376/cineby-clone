import Navbar from '@/components/Navbar';
import Link from 'next/link';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

async function getMatches() {
  try {
    const res = await fetch('https://api.cricapi.com/v1/matches?apikey=' + API_KEY + '&offset=0', { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

function toBDT(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
}

function cleanName(name) {
  if (!name) return '';
  const comma = name.split(',')[0].trim();
  const vs = comma.split(' vs ');
  if (vs.length >= 2) return vs[0].trim() + ' vs ' + vs[1].trim();
  return comma;
}

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

function MatchCard({ match, type }) {
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const t1Name = t1?.name || match.teams?.[0] || 'TBA';
  const t2Name = t2?.name || match.teams?.[1] || 'TBA';
  const t1Img = t1?.img;
  const t2Img = t2?.img;
  const borderColor = type === 'live' ? '#e50914' : type === 'upcoming' ? '#1a1a2e' : '#1a1a2e';

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, overflow: 'hidden', boxShadow: type === 'live' ? '0 0 20px rgba(229,9,20,0.1)' : 'none' }}>
      <div style={{ height: 80, background: type === 'live' ? 'linear-gradient(135deg,#1a0a0a,#200808)' : type === 'upcoming' ? 'linear-gradient(135deg,#0a0a1a,#080820)' : 'linear-gradient(135deg,#111,#0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 12 }}>
        {t1Img ? <img src={t1Img} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t1Name} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏏</div>}
        <div style={{ fontSize: 10, color: '#333', fontWeight: 700 }}>VS</div>
        {t2Img ? <img src={t2Img} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t2Name} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏏</div>}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          {type === 'live' && <span style={{ background: '#e50914', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>📅 UPCOMING</span>}
          {type === 'current' && <span style={{ background: '#1565c0', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>⚡ CURRENT</span>}
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
        {match.score?.length > 0 && (
          <div style={{ fontSize: 10, color: type === 'live' ? '#e50914' : '#555', marginBottom: 4 }}>
            {match.score.map((s, i) => <span key={i} style={{ marginRight: 8 }}>{s.r}/{s.w} ({s.o}ov)</span>)}
          </div>
        )}
        {match.status && <div style={{ fontSize: 9, color: '#444', marginBottom: 6 }}>{match.status.replace(/GMT/g, 'BDT')}</div>}
        {type === 'upcoming' && match.dateTimeGMT && <div style={{ fontSize: 10, color: '#f5c518', marginBottom: 6 }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
      {type === 'live' && (
        <button style={{ width: '100%', background: '#e50914', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, padding: '8px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 1 }}>▶ WATCH LIVE</button>
      )}
    </div>
  );
}

export default async function CricketPage() {
  const matches = await getMatches();
  const live = matches.filter(m => m.matchStarted && !m.matchEnded);
  const upcoming = matches.filter(m => !m.matchStarted);
  const old = matches.filter(m => m.matchEnded);
  const heroMatch = live[0] || null;

  return (
    <>
      <Navbar />
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        {/* BACK + TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link href="/sports" style={{ color: '#444', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>← Sports</Link>
          <span style={{ color: '#222' }}>|</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff' }}>🏏 Cricket</h1>
          <Link href="/sports/football" style={{ marginLeft: 'auto', background: '#0e0e1a', border: '1px solid #1a1a2e', color: '#aaa', fontSize: 12, fontWeight: 600, padding: '8px 18px', borderRadius: 20, textDecoration: 'none' }}>⚽ Switch to Football</Link>
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
          <div style={{ background: 'linear-gradient(135deg,#1a0808,#200a0a)', border: '1px solid #e50914', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>LIVE NOW</span>
                <span style={{ fontSize: 11, color: '#444', marginLeft: 4 }}>{heroMatch.matchType?.toUpperCase()} • {heroMatch.venue?.split(',')[0]}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{cleanName(heroMatch.name)}</div>
              {heroMatch.score?.length > 0 && (
                <div style={{ fontSize: 14, color: '#e50914', fontWeight: 600, marginBottom: 8 }}>
                  {heroMatch.score.map((s, i) => <span key={i} style={{ marginRight: 16 }}>{s.inning?.split(' Inning')[0]}: {s.r}/{s.w} ({s.o}ov)</span>)}
                </div>
              )}
              {heroMatch.status && <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>{heroMatch.status.replace(/GMT/g, 'BDT')}</div>}
              <div style={{ fontSize: 11, color: '#555', marginBottom: 10 }}>Switch channels if stream is not working</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {CHANNELS.map((ch, i) => (
                  <div key={i} style={{ background: i === 0 ? '#e50914' : '#0e0e1a', border: '1px solid ' + (i === 0 ? '#e50914' : '#333'), borderRadius: 20, padding: '6px 14px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                    <div style={{ fontSize: 9, color: i === 0 ? 'rgba(255,255,255,0.6)' : '#444' }}>{ch.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', paddingTop: '40%', borderRadius: 10, overflow: 'hidden', background: '#000', border: '1px solid #2a0a0a' }}>
                <iframe src={'https://streamcrichd.com/update/fetch.php?hd=25&embed=1'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY TABS + CARDS */}
        {live.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#e50914', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔴 Live Matches
              <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {live.map(m => <MatchCard key={m.id} match={m} type="live" />)}
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#f5c518', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              📅 Upcoming Matches
              <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {upcoming.slice(0, 12).map(m => <MatchCard key={m.id} match={m} type="upcoming" />)}
            </div>
          </div>
        )}

        {old.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              ✅ Recent Results
              <span style={{ flex: 1, height: 1, background: '#1a1a2e', display: 'block' }}></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {old.slice(0, 12).map(m => <MatchCard key={m.id} match={m} type="old" />)}
            </div>
          </div>
        )}

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#333', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
