import Navbar from '@/components/Navbar';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

async function getCricketMatches() {
  try {
    const res = await fetch('https://api.cricapi.com/v1/matches?apikey=' + API_KEY + '&offset=0', { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch(e) {
    return [];
  }
}

async function getFootballMatches() {
  try {
    const res = await fetch('https://api.embedsportex.site/api/streams?cache=' + Date.now(), { next: { revalidate: 60 } });
    const data = await res.json();
    return data.football || [];
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

function footballToBDT(kickoff) {
  if (!kickoff) return '';
  const date = new Date(kickoff.replace(' ', 'T') + '+07:00');
  const bdtDate = new Date(date.getTime() - 60 * 60 * 1000);
  return bdtDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
}

function cleanName(name) {
  if (!name) return '';
  const comma = name.split(',')[0].trim();
  const vsParts = comma.split(' vs ');
  if (vsParts.length >= 2) return vsParts[0].trim() + ' vs ' + vsParts[1].trim();
  return comma;
}

function isLiveFootball(match) {
  const now = new Date();
  const start = new Date(match.kickoff.replace(' ', 'T') + '+07:00');
  const end = new Date(match.endTime.replace(' ', 'T') + '+07:00');
  return now >= start && now <= end;
}

function isUpcomingFootball(match) {
  const now = new Date();
  const start = new Date(match.kickoff.replace(' ', 'T') + '+07:00');
  return now < start;
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
  const circleStyle = { width: 48, height: 48, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ffffff15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 };
  const imgStyle = { width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff15' };
  const nameStyle = { fontSize: 10, color: '#aaa', marginTop: 4, maxWidth: 56, textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, padding: '14px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: type === 'live' ? '0 0 20px rgba(229,9,20,0.12)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          {t1Img ? <img src={t1Img} alt={t1Name} style={imgStyle} /> : <div style={circleStyle}>🏏</div>}
          <div style={nameStyle}>{t1Name}</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>VS</div>
        <div style={{ textAlign: 'center' }}>
          {t2Img ? <img src={t2Img} alt={t2Name} style={imgStyle} /> : <div style={circleStyle}>🏏</div>}
          <div style={nameStyle}>{t2Name}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          {type === 'live' && <span style={{ background: '#e50914', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>🔴 LIVE</span>}
          {type === 'upcoming' && <span style={{ background: '#f5c518', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>📅 UPCOMING</span>}
          {type === 'recent' && <span style={{ background: '#1e1e30', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>✅ COMPLETED</span>}
          <span style={{ color: '#444', fontSize: 11 }}>{match.matchType ? match.matchType.toUpperCase() : ''}{match.venue ? ' • ' + match.venue.split(',')[0] : ''}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cleanName(match.name)}</div>
        {match.status && <div style={{ fontSize: 12, color: type === 'live' ? '#e50914' : '#555' }}>{match.status.replace(/GMT/g, 'BDT')}</div>}
        {type === 'upcoming' && match.dateTimeGMT && <div style={{ fontSize: 12, color: '#f5c518', marginTop: 2 }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 110 }}>
        {match.score && match.score.length > 0
          ? match.score.map(function(s, i) { return <div key={i} style={{ fontSize: 12, color: '#a0a0b8', marginBottom: 2 }}><span style={{ color: '#fff', fontWeight: 700 }}>{s.r}/{s.w}</span><span style={{ color: '#444', fontSize: 10 }}> ({s.o}ov)</span></div>; })
          : <span style={{ color: '#333', fontSize: 11 }}>—</span>}
      </div>
    </div>
  );
}

function FootballCard(props) {
  const match = props.match;
  const live = isLiveFootball(match);
  const upcoming = isUpcomingFootball(match);
  const borderColor = live ? '#e50914' : upcoming ? '#f5c518' : '#1e1e30';
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];

  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + borderColor, borderRadius: 12, padding: '14px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: live ? '0 0 20px rgba(229,9,20,0.12)' : 'none' }}>
      {match.poster && (
        <img src={match.poster} alt={match.tag} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          {live && <span style={{ background: '#e50914', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>🔴 LIVE</span>}
          {upcoming && <span style={{ background: '#f5c518', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>📅 UPCOMING</span>}
          {!live && !upcoming && <span style={{ background: '#1e1e30', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>✅ COMPLETED</span>}
          <span style={{ color: '#444', fontSize: 11 }}>{match.league || ''}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
          {teams[0]} <span style={{ color: '#333', fontSize: 12 }}>vs</span> {teams[1] || ''}
        </div>
        {upcoming && <div style={{ fontSize: 12, color: '#f5c518' }}>🕐 {footballToBDT(match.kickoff)}</div>}
        {live && match.iframes && match.iframes.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {match.iframes.slice(0, 4).map(function(iframe, i) {
              return (
                <a key={i} href={iframe.url} target="_blank" rel="noopener noreferrer" style={{ background: i === 0 ? '#e50914' : '#1e1e30', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, textDecoration: 'none', border: i === 0 ? 'none' : '1px solid #333' }}>
                  ▶ {iframe.server}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function SportsPage() {
  const [cricketMatches, footballData] = await Promise.all([getCricketMatches(), getFootballMatches()]);

  const isIPL = function(m) { return m.name && (m.name.toLowerCase().includes('ipl') || m.name.toLowerCase().includes('indian premier')); };
  const ipl = cricketMatches.filter(isIPL);
  const liveC = cricketMatches.filter(function(m) { return m.matchStarted && !m.matchEnded && !isIPL(m); });
  const upcomingC = cricketMatches.filter(function(m) { return !m.matchStarted; });
  const recentC = cricketMatches.filter(function(m) { return m.matchEnded && !isIPL(m); });

  const liveF = footballData.filter(isLiveFootball);
  const upcomingF = footballData.filter(isUpcomingFootball);

  const hasLiveCricket = liveC.length > 0 || ipl.some(function(m) { return m.matchStarted && !m.matchEnded; });

  const CRICKET_CHANNELS = [
    { label: '⭐ Star Sports 1', hd: 25, desc: 'IPL & Bangladesh' },
    { label: '🎙️ Star Hindi', hd: 26, desc: 'IPL Hindi' },
    { label: '🏏 Sky Sports', hd: 2, desc: 'England matches' },
    { label: '🌍 Willow', hd: 29, desc: 'ICC matches' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 90, padding: '90px 48px 48px', background: '#070710', minHeight: '100vh' }}>

        {/* CRICKET LIVE PLAYER */}
        {hasLiveCricket && (
          <div style={{ marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#e50914', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
              LIVE CRICKET — WATCH NOW
            </h2>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>Switch channels below if stream is not working</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {CRICKET_CHANNELS.map(function(ch, i) {
                return (
                  <div key={i} style={{ background: i === 0 ? '#e50914' : '#0e0e1a', border: '1px solid ' + (i === 0 ? '#e50914' : '#333'), borderRadius: 8, padding: '8px 16px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                    <div style={{ fontSize: 10, color: i === 0 ? 'rgba(255,255,255,0.7)' : '#555' }}>{ch.desc}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000', border: '1px solid #1e1e30' }}>
              <iframe
                id="cricket-player"
                src="https://streamcrichd.com/update/fetch.php?hd=25&embed=1"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                scrolling="no"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* IPL */}
        {ipl.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#f5c518', marginBottom: 16 }}>🏆 IPL 2026</h2>
            {ipl.map(function(m) { return <MatchCard key={m.id} match={m} type={m.matchStarted && !m.matchEnded ? 'live' : m.matchEnded ? 'recent' : 'upcoming'} />; })}
          </div>
        )}

        {/* LIVE CRICKET */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#e50914', marginBottom: 16 }}>🔴 LIVE CRICKET</h2>
          {liveC.length === 0 ? <p style={{ color: '#444', fontSize: 14 }}>No live cricket matches right now</p> : liveC.map(function(m) { return <MatchCard key={m.id} match={m} type="live" />; })}
        </div>

        {/* LIVE FOOTBALL */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#e50914', marginBottom: 16 }}>⚽ LIVE FOOTBALL</h2>
          {liveF.length === 0 ? <p style={{ color: '#444', fontSize: 14 }}>No live football matches right now</p> : liveF.map(function(m) { return <FootballCard key={m.slug} match={m} />; })}
        </div>

        {/* UPCOMING CRICKET */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#f5c518', marginBottom: 16 }}>📅 UPCOMING CRICKET</h2>
          {upcomingC.length === 0 ? <p style={{ color: '#444', fontSize: 14 }}>No upcoming matches</p> : upcomingC.slice(0, 8).map(function(m) { return <MatchCard key={m.id} match={m} type="upcoming" />; })}
        </div>

        {/* UPCOMING FOOTBALL */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#f5c518', marginBottom: 16 }}>📅 UPCOMING FOOTBALL</h2>
          {upcomingF.length === 0 ? <p style={{ color: '#444', fontSize: 14 }}>No upcoming matches</p> : upcomingF.slice(0, 8).map(function(m) { return <FootballCard key={m.slug} match={m} />; })}
        </div>

        {/* RECENT CRICKET */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: '#fff', marginBottom: 16 }}>🏆 RECENT CRICKET RESULTS</h2>
          {recentC.length === 0 ? <p style={{ color: '#444', fontSize: 14 }}>No recent results</p> : recentC.slice(0, 8).map(function(m) { return <MatchCard key={m.id} match={m} type="recent" />; })}
        </div>

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #ffffff0f', textAlign: 'center', color: '#555', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </div>
  );
}
