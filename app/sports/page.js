'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const CRICKET_API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';
const HIGHLIGHT_API_KEY = '139445e2-7f4d-431b-b7a3-5104d50805cd';

const CRICKET_CHANNELS = [
  { label: '⭐ Star Sports 1', hd: 25, desc: 'IPL & India' },
  { label: '🎙 Star Hindi', hd: 26, desc: 'IPL Hindi' },
  { label: '🏏 Sky Sports', hd: 2, desc: 'England' },
  { label: '🌍 Willow', hd: 29, desc: 'ICC' },
  { label: '🌐 Willow Extra', hd: 30, desc: 'Extra coverage' },
  { label: '📡 PTV Sports', hd: 22, desc: 'Pakistan' },
  { label: '🏆 A Sports', hd: 24, desc: 'Pakistan & Intl' },
  { label: '🎯 Ten Sports', hd: 23, desc: 'Various' },
  { label: '📺 Sony Ten 1', hd: 27, desc: 'India domestic' },
];

const FOOTBALL_CHANNELS = [
  { label: '⚽ Sky Sports Football', hd: 5, desc: 'EPL' },
  { label: '🏆 TNT Sports 1', hd: 12, desc: 'UCL & EPL' },
  { label: '🎯 TNT Sports 2', hd: 13, desc: 'UCL & EPL' },
  { label: '🌍 BeIn Sports', hd: 40, desc: 'La Liga & Serie A' },
  { label: '⭐ LaLiga TV', hd: 57, desc: 'La Liga' },
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

function isUpcomingFootball(m) {
  try { return new Date() < new Date(m.kickoff.replace(' ', 'T') + '+07:00'); }
  catch { return false; }
}

function footballToBDT(kickoff) {
  if (!kickoff) return '';
  try {
    const bdt = new Date(new Date(kickoff.replace(' ', 'T') + '+07:00').getTime() - 3600000);
    return bdt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT';
  } catch { return ''; }
}

function Countdown({ dateStr }) {
  const [time, setTime] = useState(getCountdown(dateStr));
  useEffect(() => {
    const t = setInterval(() => setTime(getCountdown(dateStr)), 1000);
    return () => clearInterval(t);
  }, [dateStr]);
  if (!time) return null;
  return (
    <span style={{ color: '#f5c518', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>
      ⏱ {String(time.h).padStart(2,'0')}:{String(time.m).padStart(2,'0')}:{String(time.s).padStart(2,'0')}
    </span>
  );
}

function PlayerModal({ sport, channel, onClose, onChannelChange, channels }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 920, background: '#0e0e1a', borderRadius: 16, overflow: 'hidden', border: '1px solid #e50914' }}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a2e' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Live {sport === 'cricket' ? '🏏 Cricket' : '⚽ Football'} Stream</div>
          <button onClick={onClose} style={{ background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 16, cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ padding: '10px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #1a1a2e', background: '#070710' }}>
          {channels.map((ch, i) => (
            <button key={i} onClick={() => onChannelChange(i)} style={{ background: channel === i ? '#e50914' : '#0e0e1a', border: '1px solid ' + (channel === i ? '#e50914' : '#1a1a2e'), borderRadius: 16, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
              <div style={{ fontSize: 8, color: channel === i ? 'rgba(255,255,255,0.55)' : '#333' }}>{ch.desc}</div>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          <iframe key={channel} src={'https://streamcrichd.com/update/fetch.php?hd=' + channels[channel].hd + '&embed=1'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} scrolling="no" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
        </div>
        <div style={{ padding: '8px 16px', background: '#070710', borderTop: '1px solid #1a1a2e' }}>
          <div style={{ fontSize: 10, color: '#333' }}>If stream is not working, switch to another channel above</div>
        </div>
      </div>
    </div>
  );
}

function CricketCard({ match }) {
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const t1Name = t1?.name || match.teams?.[0] || 'TBA';
  const t2Name = t2?.name || match.teams?.[1] || 'TBA';
  const isWithin24h = match.dateTimeGMT && getCountdown(match.dateTimeGMT)?.diff < 86400000;
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + (isWithin24h ? 'rgba(229,9,20,0.4)' : '#1a1a2e'), borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 68, background: isWithin24h ? '#140505' : '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' }}>
        {t1?.img ? <img src={t1.img} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ffffff10' }} alt={t1Name} /> : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏏</div>}
        <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
        {t2?.img ? <img src={t2.img} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ffffff10' }} alt={t2Name} /> : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🏏</div>}
        <div style={{ position: 'absolute', top: 6, left: 7 }}>
          {isWithin24h && <span style={{ background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>SOON</span>}
        </div>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 8, color: '#2a2a3e', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.matchType?.toUpperCase()} · {match.venue?.split(',')[0]}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5 }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t1Name}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e'}}>vs</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{t2Name}</div>
        </div>
        {match.dateTimeGMT && isWithin24h && <Countdown dateStr={match.dateTimeGMT} />}
        {match.dateTimeGMT && !isWithin24h && <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {toBDT(match.dateTimeGMT)}</div>}
      </div>
    </div>
  );
}

function FootballCard({ match }) {
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, overflow: 'hidden', width: 160, transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: 68, background: '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
        {match.poster && <img src={match.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
        </div>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 8, color: '#2a2a3e', marginBottom: 2 }}>{match.league || 'Football'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5 }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{teams[0]}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e'}}>vs</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{teams[1] || ''}</div>
        </div>
        <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {footballToBDT(match.kickoff)}</div>
      </div>
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
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>▶</div>
          </div>
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>HIGHLIGHT</div>
        </div>
        <div style={{ padding: '8px 10px' }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{h.title}</div>
          <div style={{ fontSize: 9, color: '#444' }}>{h.league?.name || ''}</div>
        </div>
      </div>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setOpen(false)}>
          <div style={{ width: '100%', maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{h.title}</div>
              <button onClick={() => setOpen(false)} style={{ background: '#1a1a2e', border: 'none', color: '#aaa', fontSize: 16, cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', fontFamily: 'inherit' }}>✕</button>
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

function SectionHdr({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</div>
      {count > 0 && <div style={{ background: color === '#e50914' ? 'rgba(229,9,20,0.12)' : color === '#f5c518' ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.05)', color, fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{count}</div>}
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChannel, setModalChannel] = useState(0);

  useEffect(() => {
    Promise.all([
      Promise.all([
        fetch('https://api.cricapi.com/v1/matches?apikey=' + CRICKET_API_KEY + '&offset=0').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('https://api.cricapi.com/v1/matches?apikey=' + CRICKET_API_KEY + '&offset=25').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('https://api.cricapi.com/v1/currentMatches?apikey=' + CRICKET_API_KEY + '&offset=0').then(r => r.json()).catch(() => ({ data: [] })),
      ]).then(([p1, p2, p3]) => {
        const seen = new Set();
        const all = [...(p1.data||[]), ...(p2.data||[]), ...(p3.data||[])].filter(m => {
          if (!m.id) return false;
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        return { data: all };
      }),
      fetch('https://api.embedsportex.site/api/streams').then(r => r.json()).catch(() => ({ football: [] })),
      fetch('https://cricket.highlightly.net/highlights?limit=12', { headers: { 'x-rapidapi-key': HIGHLIGHT_API_KEY } }).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([cric, foot, high]) => {
      setCricketMatches(cric.data || []);
      setFootballMatches(foot.football || []);
      setHighlights(high.data || []);
      setLoading(false);
    });
  }, []);

  const junkKeywords = ['andhra', 'kakinada', 'vijayawada', 'simhadri', 'bhimavaram', 'tungabhadra', 'capital am', 'royals of r', 'aca-odisha', 'aca inter', 'civil service', 'bayuemas', 'icc women qualifier'];
  const seenNames = new Set();
  const dedupedMatches = cricketMatches.filter(m => {
    const nameLower = (m.name || '').toLowerCase();
    if (junkKeywords.some(k => nameLower.includes(k))) return false;
    if (!m.name) return true;
    const comma = m.name.split(',')[0].trim();
    const vs = comma.split(' vs ');
    const key = vs.length >= 2 ? vs[0].trim() + ' vs ' + vs[1].trim() : comma;
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });

  const within24h = dedupedMatches.filter(m => {
    if (m.matchStarted) return false;
    if (!m.dateTimeGMT) return false;
    const cd = getCountdown(m.dateTimeGMT);
    return cd && cd.diff < 86400000;
  });

  const now = new Date();
  const upcomingCricket = dedupedMatches.filter(m => {
    if (m.matchStarted) return false;
    if (!m.dateTimeGMT) return false;
    const matchDate = new Date(m.dateTimeGMT);
    if (matchDate < now) return false;
    if (matchDate.getFullYear() < 2026) return false;
    const cd = getCountdown(m.dateTimeGMT);
    return cd && cd.diff >= 86400000;
  });

  const now2 = new Date();
  const upcomingFootball = footballMatches.filter(m => {
    if (!isUpcomingFootball(m)) return false;
    try {
      const matchDate = new Date(m.kickoff.replace(' ', 'T') + '+07:00');
      return matchDate >= now2 && matchDate.getFullYear() >= 2026;
    } catch { return false; }
  });
  const channels = sport === 'cricket' ? CRICKET_CHANNELS : FOOTBALL_CHANNELS;

  return (
    <>
      <Navbar />
      {modalOpen && (
        <PlayerModal sport={sport} channel={modalChannel} channels={channels} onClose={() => setModalOpen(false)} onChannelChange={setModalChannel} />
      )}
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1a1a2e' }}>
          <Link href="/" style={{ color: '#444', fontSize: 12, textDecoration: 'none' }}>← Home</Link>
          <div style={{ width: 1, height: 18, background: '#1a1a2e'}}></div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{key:'cricket',label:'🏏 Cricket'},{key:'football',label:'⚽ Football'},{key:'highlights',label:'🎬 Highlights'}].map(t => (
              <button key={t.key} onClick={() => setSport(t.key)} style={{ padding: '7px 18px', borderRadius: 20, border: sport === t.key ? 'none' : '1px solid #1a1a2e', background: sport === t.key ? '#e50914' : 'transparent', color: sport === t.key ? '#fff' : '#444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>{t.label}</button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 80, color: '#333' }}>Loading...</div>}

        {!loading && sport === 'cricket' && (
          <div>
            {within24h.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <SectionHdr color="#e50914" label="🔴 Starting within 24 hours" count={within24h.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 12 }}>
                  {within24h.map(m => <CricketCard key={m.id} match={m} />)}
                </div>
              </div>
            )}

            {within24h.length === 0 && (
              <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 14, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 32 }}>🏏</div>
                <div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginBottom: 4 }}>No matches starting soon</div>
                  <div style={{ fontSize: 12, color: '#444' }}>Check upcoming matches below or watch live streams anytime</div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 28 }}>
              <SectionHdr color="#fff" label="📺 Watch Live Cricket" count={0} />
              <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 9, color: '#333', fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>SELECT A CHANNEL — STREAM OPENS ON THIS PAGE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CRICKET_CHANNELS.map((ch, i) => (
                    <button key={i} onClick={() => { setModalChannel(i); setModalOpen(true); }}
                      style={{ background: '#070710', border: '1px solid #1a1a2e', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e50914'; e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.background = '#070710'; }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                      <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{ch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {upcomingCricket.length > 0 && (
              <div>
                <SectionHdr color="#f5c518" label="📅 Upcoming Matches" count={upcomingCricket.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 12 }}>
                  {upcomingCricket.slice(0, 20).map(m => <CricketCard key={m.id} match={m} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && sport === 'football' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <SectionHdr color="#fff" label="📺 Watch Live Football" count={0} />
              <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 9, color: '#333', fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>SELECT A CHANNEL — STREAM OPENS ON THIS PAGE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {FOOTBALL_CHANNELS.map((ch, i) => (
                    <button key={i} onClick={() => { setModalChannel(i); setModalOpen(true); }}
                      style={{ background: '#070710', border: '1px solid #1a1a2e', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#e50914'; e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.background = '#070710'; }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                      <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{ch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {upcomingFootball.length > 0 && (
              <div>
                <SectionHdr color="#f5c518" label="📅 Upcoming Matches" count={upcomingFootball.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 12 }}>
                  {upcomingFootball.slice(0, 16).map(m => <FootballCard key={m.slug} match={m} />)}
                </div>
              </div>
            )}

            {upcomingFootball.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#333' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚽</div>
                <div style={{ fontSize: 14 }}>No upcoming matches scheduled</div>
              </div>
            )}
          </div>
        )}

        {!loading && sport === 'highlights' && (
          <div>
            <SectionHdr color="#fff" label="🎬 Latest Highlights" count={highlights.length} />
            {highlights.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                  <div style={{ fontSize: 14 }}>Highlights will appear here after matches end</div>
                  <div style={{ fontSize: 12, color: '#333', marginTop: 8 }}>Check back after today's matches</div>
                </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
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
