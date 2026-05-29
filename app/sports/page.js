'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const CRICKET_API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';
const HIGHLIGHT_API_KEY = '139445e2-7f4d-431b-b7a3-5104d50805cd';

const CHANNELS = [
  { label: '⭐ Star Sports 1', hd: 25, desc: 'IPL & Bangladesh' },
  { label: '🎙 Star Hindi', hd: 26, desc: 'IPL Hindi' },
  { label: '🏏 Sky Sports', hd: 2, desc: 'England' },
  { label: '🌍 Willow', hd: 29, desc: 'ICC' },
];

function toBDT(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
}

function getCountdown(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  target.setHours(target.getHours() + 6);
  const diff = target - new Date();
  if (diff <= 0) return null;
  return { h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000), diff };
}

function cleanName(name) {
  if (!name) return '';
  const comma = name.split(',')[0].trim();
  const vs = comma.split(' vs ');
  if (vs.length >= 2) return vs[0].trim() + ' vs ' + vs[1].trim();
  return comma;
}

function isLiveFootball(m) {
  try {
    const now = new Date();
    const start = new Date(m.kickoff.replace(' ', 'T') + '+07:00');
    const end = new Date(m.endTime.replace(' ', 'T') + '+07:00');
    return now >= start && now <= end;
  } catch { return false; }
}

function isUpcomingFootball(m) {
  try { return new Date() < new Date(m.kickoff.replace(' ', 'T') + '+07:00'); }
  catch { return false; }
}

function footballToBDT(kickoff) {
  if (!kickoff) return '';
  try {
    const date = new Date(kickoff.replace(' ', 'T') + '+07:00');
    const bdt = new Date(date.getTime() - 3600000);
    return bdt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
  } catch { return ''; }
}

function Countdown({ dateStr, inline }) {
  const [time, setTime] = useState(getCountdown(dateStr));
  useEffect(() => {
    const t = setInterval(() => setTime(getCountdown(dateStr)), 1000);
    return () => clearInterval(t);
  }, [dateStr]);
  if (!time) return null;
  if (inline) return <span style={{ color: '#f5c518', fontSize: 10, fontWeight: 700 }}>⏱ {String(time.h).padStart(2,'0')}:{String(time.m).padStart(2,'0')}:{String(time.s).padStart(2,'0')}</span>;
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[{v:time.h,l:'HRS'},{v:time.m,l:'MIN'},{v:time.s,l:'SEC'}].map((u,i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ background: '#070710', border: '1px solid #1a1a2e', borderRadius: 6, padding: '5px 8px', fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'monospace', minWidth: 40 }}>{String(u.v).padStart(2,'0')}</div>
          <div style={{ fontSize: 7, color: '#333', letterSpacing: 1, marginTop: 2 }}>{u.l}</div>
        </div>
      ))}
    </div>
  );
}

function PlayerModal({ match, channel, onClose, onChannelChange }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 900, background: '#0e0e1a', borderRadius: 16, overflow: 'hidden', border: '1px solid #e50914' }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a2e' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{cleanName(match.name || match.tag)}</div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{match.matchType?.toUpperCase() || match.league} {match.venue ? '· ' + match.venue.split(',')[0] : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 18, cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>✕</button>
        </div>
        {match.iframes ? (
          <div style={{ padding: '12px 20px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #1a1a2e' }}>
            {match.iframes.slice(0, 5).map((iframe, i) => (
              <button key={i} onClick={() => onChannelChange(i)} style={{ background: channel === i ? '#e50914' : '#0e0e1a', border: '1px solid ' + (channel === i ? '#e50914' : '#333'), borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit', color: '#fff', fontSize: 11, fontWeight: 700 }}>▶ {iframe.server}</button>
            ))}
          </div>
        ) : (
          <div style={{ padding: '12px 20px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #1a1a2e' }}>
            {CHANNELS.map((ch, i) => (
              <button key={i} onClick={() => onChannelChange(i)} style={{ background: channel === i ? '#e50914' : '#0e0e1a', border: '1px solid ' + (channel === i ? '#e50914' : '#333'), borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                <div style={{ fontSize: 9, color: channel === i ? 'rgba(255,255,255,0.6)' : '#444' }}>{ch.desc}</div>
              </button>
            ))}
          </div>
        )}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          <iframe key={channel} src={match.iframes ? match.iframes[channel]?.url : 'https://streamcrichd.com/update/fetch.php?hd=' + CHANNELS[channel].hd + '&embed=1'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
        </div>
        {match.score?.length > 0 && (
          <div style={{ padding: '10px 20px', display: 'flex', gap: 16, borderTop: '1px solid #1a1a2e', flexWrap: 'wrap' }}>
            {match.score.map((s, i) => (
              <div key={i} style={{ fontSize: 13, color: '#aaa' }}>
                <span style={{ color: '#555', fontSize: 11 }}>{s.inning?.split(' Inning')[0]}: </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{s.r}/{s.w}</span>
                <span style={{ color: '#444', fontSize: 11 }}> ({s.o}ov)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CricketCard({ match, onWatch }) {
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const t1Name = t1?.name || match.teams?.[0] || 'TBA';
  const t2Name = t2?.name || match.teams?.[1] || 'TBA';
  const isLive = match.matchStarted && !match.matchEnded;
  const countdown = !isLive && match.dateTimeGMT ? getCountdown(match.dateTimeGMT) : null;
  const isSoon = countdown && countdown.diff < 3600000;
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + (isLive ? '#e50914' : isSoon ? 'rgba(245,197,24,0.4)' : '#1a1a2e'), borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 68, background: isLive ? '#140505' : '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative' }}>
        {t1?.img ? <img src={t1.img} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t1Name} /> : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏏</div>}
        <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
        {t2?.img ? <img src={t2.img} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff10' }} alt={t2Name} /> : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏏</div>}
        <div style={{ position: 'absolute', top: 7, left: 8 }}>
          {isLive && <span style={{ background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {!isLive && isSoon && <span style={{ background: '#f5c518', color: '#000', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>⚡ SOON</span>}
          {!isLive && !isSoon && <span style={{ background: '#1a1a2e', color: '#444', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>📅</span>}
        </div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ fontSize: 8, color: '#2a2a3e', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.matchType?.toUpperCase()} · {match.venue?.split(',')[0]}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 5 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t1Name}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700, flexShrink: 0 }}>vs</div>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{t2Name}</div>
        </div>
        {isLive && match.score?.length > 0 && <div style={{ fontSize: 10, color: '#e50914', fontWeight: 600, marginBottom: 2 }}>{match.score.map((s,i) => <span key={i} style={{ marginRight: 6 }}>{s.r}/{s.w} ({s.o}ov)</span>)}</div>}
        {isLive && match.status && <div style={{ fontSize: 9, color: '#555' }}>{match.status.replace(/GMT/g,'BDT')}</div>}
        {!isLive && isSoon && match.dateTimeGMT && <Countdown dateStr={match.dateTimeGMT} inline />}
        {!isLive && !isSoon && match.dateTimeGMT && <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
      {isLive && <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#e50914', border: 'none', color: '#fff', fontSize: 9, fontWeight: 700, padding: '7px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.8 }}>▶ WATCH LIVE</button>}
    </div>
  );
}

function FootballCard({ match, onWatch }) {
  const live = isLiveFootball(match);
  const upcoming = isUpcomingFootball(match);
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + (live ? '#e50914' : '#1a1a2e'), borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 68, background: live ? '#140505' : '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative', overflow: 'hidden' }}>
        {match.poster && <img src={match.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
        </div>
        <div style={{ position: 'absolute', top: 7, left: 8, zIndex: 2 }}>
          {live && <span style={{ background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {!live && upcoming && <span style={{ background: '#f5c518', color: '#000', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>📅</span>}
        </div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ fontSize: 8, color: '#2a2a3e', marginBottom: 3 }}>{match.league || 'Football'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 5 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{teams[0]}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700, flexShrink: 0 }}>vs</div>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{teams[1] || ''}</div>
        </div>
        {upcoming && <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {footballToBDT(match.kickoff)}</div>}
      </div>
      {live && match.iframes?.length > 0 && <button onClick={() => onWatch(match)} style={{ width: '100%', background: '#e50914', border: 'none', color: '#fff', fontSize: 9, fontWeight: 700, padding: '7px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.8 }}>▶ WATCH LIVE</button>}
    </div>
  );
}

function HighlightCard({ h }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => setOpen(true)}
      >
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          {h.thumbnail ? <img src={h.thumbnail} alt={h.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏏</div>}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>▶</div>
          </div>
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>HIGHLIGHT</div>
        </div>
        <div style={{ padding: '9px 11px' }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{h.title}</div>
          <div style={{ fontSize: 9, color: '#444' }}>{h.league?.name || ''}</div>
        </div>
      </div>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setOpen(false)}>
          <div style={{ width: '100%', maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{h.title}</div>
              <button onClick={() => setOpen(false)} style={{ background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 18, cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', fontFamily: 'inherit' }}>✕</button>
            </div>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
              <iframe src={h.url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeader({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</div>
      {count > 0 && <div style={{ background: color === '#e50914' ? 'rgba(229,9,20,0.15)' : 'rgba(245,197,24,0.12)', color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{count}</div>}
      <div style={{ flex: 1, height: 1, background: '#1a1a2e' }}></div>
    </div>
  );
}

export default function SportsPage() {
  const [sport, setSport] = useState('cricket');
  const [cricketMatches, setCricketMatches] = useState([]);
  const [footballMatches, setFootballMatches] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMatch, setModalMatch] = useState(null);
  const [modalChannel, setModalChannel] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('https://api.cricapi.com/v1/matches?apikey=' + CRICKET_API_KEY + '&offset=0').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('https://api.embedsportex.site/api/streams').then(r => r.json()).catch(() => ({ football: [] })),
      fetch('https://cricket.highlightly.net/highlights?limit=12', { headers: { 'x-rapidapi-key': HIGHLIGHT_API_KEY } }).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([cric, foot, high]) => {
      setCricketMatches(cric.data || []);
      setFootballMatches(foot.football || []);
      setHighlights(high.data || []);
      setLoading(false);
    });
  }, []);

  const liveCricket = cricketMatches.filter(m => {
  if (!m.matchStarted || m.matchEnded) return false;
  if (!m.dateTimeGMT) return true;
  const start = new Date(m.dateTimeGMT);
  const now = new Date();
  const hoursSinceStart = (now - start) / 3600000;
  return hoursSinceStart < 12;
});
  const upcomingCricket = cricketMatches.filter(m => !m.matchStarted);
  const liveFootball = footballMatches.filter(isLiveFootball);
  const upcomingFootball = footballMatches.filter(isUpcomingFootball);
  const nextCricket = upcomingCricket[0] || null;
  const nextFootball = upcomingFootball[0] || null;

  const handleWatch = (match) => { setModalMatch(match); setModalChannel(0); };

  return (
    <>
      <Navbar />
      {modalMatch && <PlayerModal match={modalMatch} channel={modalChannel} onClose={() => setModalMatch(null)} onChannelChange={setModalChannel} />}
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1a1a2e' }}>
          <Link href="/" style={{ color: '#444', fontSize: 12, textDecoration: 'none', flexShrink: 0 }}>← Home</Link>
          <div style={{ width: 1, height: 18, background: '#1a1a2e', flexShrink: 0 }}></div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{key:'cricket',label:'🏏 Cricket'},{key:'football',label:'⚽ Football'},{key:'highlights',label:'🎬 Highlights'}].map(t => (
              <button key={t.key} onClick={() => setSport(t.key)} style={{ padding: '7px 18px', borderRadius: 20, border: sport === t.key ? 'none' : '1px solid #1a1a2e', background: sport === t.key ? '#e50914' : 'transparent', color: sport === t.key ? '#fff' : '#444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>{t.label}</button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 80, color: '#333', fontSize: 14 }}>Loading...</div>}

        {!loading && sport === 'cricket' && (
          <div>
            {liveCricket.length > 0 && (
              <div style={{ background: '#0e0e1a', border: '1px solid #e50914', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e50914', display: 'inline-block' }}></span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>LIVE NOW · {liveCricket.length} MATCH{liveCricket.length > 1 ? 'ES' : ''}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{cleanName(liveCricket[0].name)}</div>
                {liveCricket[0].score?.length > 0 && <div style={{ fontSize: 15, color: '#e50914', fontWeight: 600, marginBottom: 5 }}>{liveCricket[0].score.map((s,i) => <span key={i} style={{ marginRight: 16 }}>{s.inning?.split(' Inning')[0]}: {s.r}/{s.w} ({s.o}ov)</span>)}</div>}
                {liveCricket[0].status && <div style={{ fontSize: 12, color: '#444', marginBottom: 16 }}>{liveCricket[0].status.replace(/GMT/g,'BDT')}</div>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {CHANNELS.map((ch, i) => (
                    <div key={i} style={{ background: i === 0 ? '#e50914' : '#0e0e1a', border: '1px solid ' + (i === 0 ? '#e50914' : '#1a1a2e'), borderRadius: 20, padding: '5px 14px', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                      <div style={{ fontSize: 9, color: i === 0 ? 'rgba(255,255,255,0.5)' : '#333' }}>{ch.desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleWatch(liveCricket[0])} style={{ background: '#e50914', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 32px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>▶ Watch Live Now</button>
              </div>
            )}

            {liveCricket.length === 0 && nextCricket && nextCricket.dateTimeGMT && (
              <div style={{ background: '#0e0e1a', border: '1px solid rgba(245,197,24,0.4)', borderRadius: 16, padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#f5c518', fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>⚡ NEXT MATCH</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{cleanName(nextCricket.name)}</div>
                  <div style={{ fontSize: 12, color: '#444' }}>{nextCricket.matchType?.toUpperCase()} · {toBDT(nextCricket.dateTimeGMT)}</div>
                </div>
                <Countdown dateStr={nextCricket.dateTimeGMT} />
              </div>
            )}

            {liveCricket.length === 0 && !nextCricket && (
              <div style={{ textAlign: 'center', padding: '40px 0', marginBottom: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏏</div>
                <div style={{ fontSize: 15, color: '#444' }}>No matches scheduled right now</div>
              </div>
            )}

            {liveCricket.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color="#e50914" label="🔴 Live Matches" count={liveCricket.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {liveCricket.map(m => <CricketCard key={m.id} match={m} onWatch={handleWatch} />)}
                </div>
              </div>
            )}

            {upcomingCricket.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color="#f5c518" label="📅 Upcoming Matches" count={upcomingCricket.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {upcomingCricket.slice(0, 16).map(m => <CricketCard key={m.id} match={m} onWatch={handleWatch} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && sport === 'football' && (
          <div>
            {liveFootball.length > 0 && (
              <div style={{ background: '#0e0e1a', border: '1px solid #e50914', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e50914', display: 'inline-block' }}></span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e50914', letterSpacing: 2 }}>LIVE NOW · {liveFootball.length} MATCH{liveFootball.length > 1 ? 'ES' : ''}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{liveFootball[0].tag}</div>
                <div style={{ fontSize: 12, color: '#444', marginBottom: 16 }}>{liveFootball[0].league}</div>
                {liveFootball[0].iframes?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {liveFootball[0].iframes.slice(0, 4).map((iframe, i) => (
                      <div key={i} style={{ background: i === 0 ? '#e50914' : '#0e0e1a', border: '1px solid ' + (i === 0 ? '#e50914' : '#1a1a2e'), borderRadius: 20, padding: '5px 14px', cursor: 'pointer' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>▶ {iframe.server}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => handleWatch(liveFootball[0])} style={{ background: '#e50914', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 32px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>▶ Watch Live Now</button>
              </div>
            )}

            {liveFootball.length === 0 && nextFootball && (
              <div style={{ background: '#0e0e1a', border: '1px solid rgba(245,197,24,0.4)', borderRadius: 16, padding: '18px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#f5c518', fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>⚡ NEXT MATCH</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 5 }}>{nextFootball.tag}</div>
                  <div style={{ fontSize: 12, color: '#444' }}>{nextFootball.league} · {footballToBDT(nextFootball.kickoff)}</div>
                </div>
              </div>
            )}

            {liveFootball.length === 0 && !nextFootball && (
              <div style={{ textAlign: 'center', padding: '40px 0', marginBottom: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
                <div style={{ fontSize: 15, color: '#444' }}>No matches scheduled right now</div>
              </div>
            )}

            {liveFootball.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color="#e50914" label="🔴 Live Matches" count={liveFootball.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {liveFootball.map(m => <FootballCard key={m.slug} match={m} onWatch={handleWatch} />)}
                </div>
              </div>
            )}

            {upcomingFootball.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color="#f5c518" label="📅 Upcoming Matches" count={upcomingFootball.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {upcomingFootball.slice(0, 16).map(m => <FootballCard key={m.slug} match={m} onWatch={handleWatch} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && sport === 'highlights' && (
          <div>
            <SectionHeader color="#fff" label="🎬 Latest Highlights" count={highlights.length} />
            {highlights.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>No highlights available</div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                  {highlights.map((h, i) => <HighlightCard key={i} h={h} />)}
                </div>
            }
          </div>
        )}

      </div>
      <footer style={{ padding: '20px 48px', borderTop: '1px solid #0e0e1a', textAlign: 'center', color: '#222', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
