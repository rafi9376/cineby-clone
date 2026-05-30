'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const HIGHLIGHT_API_KEY = '139445e2-7f4d-431b-b7a3-5104d50805cd';
const HIGHLIGHTLY_BASE = 'https://cricket.highlightly.net';
const EMBEDSPORTEX_URL = 'https://api.embedsportex.site/api/streams';

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
  { label: '🌍 Telemundo', hd: 39, desc: 'World Cup 2026' },
  { label: '🦊 Fox Sports 1', hd: 31, desc: 'World Cup 2026' },
  { label: '🦊 Fox Sports 2', hd: 32, desc: 'World Cup / Bundesliga' },
  { label: '⚽ Sky Sports Football', hd: 5, desc: 'EPL & FA Cup' },
  { label: '🏆 TNT Sports 1', hd: 12, desc: 'UCL & EPL' },
  { label: '🏆 TNT Sports 2', hd: 13, desc: 'UCL' },
  { label: '🏆 TNT Sports 3', hd: 14, desc: 'UCL & Copa America' },
  { label: '🌍 BeIn Sports', hd: 40, desc: 'La Liga · Serie A · Ligue 1' },
  { label: '⭐ LaLiga TV', hd: 57, desc: 'La Liga & La Liga 2' },
  { label: '🇪🇸 DAZN 1 Spain', hd: 44, desc: 'La Liga · Copa del Rey' },
  { label: '🇪🇸 Movistar Deportes', hd: 43, desc: 'La Liga · Copa del Rey' },
];

// ─── FOOTBALL LEAGUE CONFIG ───────────────────────────────────────────────────
const FOOTBALL_LEAGUES = [
  { id: 'wc',     label: '🌍 FIFA World Cup 2026',        keywords: ['world cup', 'fifa world cup', 'copa mundial'] },
  { id: 'cwc',    label: '🏆 FIFA Club World Cup',        keywords: ['club world cup', 'fifa cwc'] },
  { id: 'ucl',    label: '🏆 UEFA Champions League',      keywords: ['champions league', 'uefa champions'] },
  { id: 'epl',    label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 English Premier League',    keywords: ['premier league', 'english premier'] },
  { id: 'laliga', label: '🇪🇸 La Liga',                   keywords: ['la liga', 'laliga primera', 'primera division'] },
  { id: 'laliga2',label: '🇪🇸 La Liga 2',                 keywords: ['la liga 2', 'laliga 2', 'segunda division', 'laliga smartbank'] },
  { id: 'copa',   label: '🇪🇸 Copa del Rey',              keywords: ['copa del rey'] },
  { id: 'ssc',    label: '🇪🇸 Spanish Super Cup',         keywords: ['spanish super cup', 'supercopa'] },
  { id: 'facup',  label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 FA Cup',                  keywords: ['fa cup'] },
  { id: 'copaam', label: '🌎 Copa America',               keywords: ['copa america', 'copa américa'] },
  { id: 'euro',   label: '🌍 UEFA Euro',                  keywords: ['euro 20', 'uefa euro', 'european championship'] },
  { id: 'bund',   label: '🇩🇪 Bundesliga',                keywords: ['bundesliga'] },
  { id: 'l1',     label: '🇫🇷 Ligue 1',                   keywords: ['ligue 1', 'ligue1'] },
  { id: 'seriea', label: '🇮🇹 Serie A',                   keywords: ['serie a', 'serie-a'] },
  { id: 'afc',    label: '🌏 AFC Championship',           keywords: ['afc championship', 'afc champions', 'afc cup'] },
  { id: 'spl',    label: '🇸🇦 Saudi Pro League',           keywords: ['saudi pro league', 'saudi professional league', 'roshn saudi league'] },
];

function getFootballLeague(match) {
  const league = (match.league || match.competition || match.tag || '').toLowerCase();
  for (const l of FOOTBALL_LEAGUES) {
    if (l.keywords.some(k => league.includes(k))) return l.id;
  }
  return null;
}

// ─── CRICKET FILTER ───────────────────────────────────────────────────────────
const ALLOWED_NATIONS = [
  'australia', 'south africa', 'bangladesh', 'new zealand', 'india',
  'afghanistan', 'west indies', 'zimbabwe', 'england', 'sri lanka', 'pakistan',
];
const ALLOWED_FORMATS = ['test', 'odi', 't20i'];
const IPL_KEYWORDS = ['ipl', 'indian premier league'];
const DISQUALIFY_WORDS = [
  'women', 'woman', 'female',
  'u19', 'u-19', 'under-19', 'under 19', 'under19', 'u17', 'u16',
  'emerging', 'lions', 'eagles', 'hawks',
];

function isAllowedNation(teamName) {
  if (!teamName) return false;
  const name = teamName.toLowerCase().trim();
  if (DISQUALIFY_WORDS.some(w => name.includes(w))) return false;
  return ALLOWED_NATIONS.some(n => name === n || name.startsWith(n + ' '));
}
function isAllowedFormat(format) {
  return ALLOWED_FORMATS.includes((format || '').toLowerCase().trim());
}
function isIPL(leagueName) {
  const l = (leagueName || '').toLowerCase();
  return IPL_KEYWORDS.some(k => l.includes(k));
}
function isAllowedMatch(leagueName, format, homeTeamName, awayTeamName) {
  if (isIPL(leagueName)) return true;
  if (!isAllowedFormat(format)) return false;
  if (!isAllowedNation(homeTeamName)) return false;
  if (!isAllowedNation(awayTeamName)) return false;
  return true;
}

// ─── HIGHLIGHT FILTER ─────────────────────────────────────────────────────────
const HIGHLIGHT_JUNK = [
  'women', 'woman', 'female', 'u19', 'under-19', 'under 19',
  'vitality blast', 'county', 'sheffield shield', 'ranji', 'vijay hazare',
  'syed mushtaq', 'duleep', 'irani', 'super smash', 'ford trophy',
  'plunket', 'csa t20', 'tier 2', 'tier2', 'ncl', 'bcl',
  'lancashire', 'yorkshire', 'surrey', 'sussex', 'kent', 'middlesex',
  'warwickshire', 'somerset', 'nottinghamshire', 'glamorgan', 'derbyshire',
  'leicestershire', 'durham', 'hampshire', 'essex', 'worcestershire',
  'the blaze', 'thunder', 'lightning', 'vipers', 'sunrisers women',
  'oval invincibles', 'welsh fire', 'manchester originals', 'trent rockets',
  'london spirit', 'northern superchargers',
];
const HIGHLIGHT_ALLOWED = [
  'ipl', 'indian premier',
  'australia', 'south africa', 'bangladesh', 'new zealand', 'india',
  'afghanistan', 'west indies', 'zimbabwe', 'england', 'sri lanka', 'pakistan',
];
function isAllowedHighlight(h) {
  const title = (h.title || '').toLowerCase();
  const league = (h.league?.name || h.league || '').toLowerCase();
  const combined = title + ' ' + league;
  if (HIGHLIGHT_JUNK.some(k => combined.includes(k))) return false;
  return HIGHLIGHT_ALLOWED.some(k => combined.includes(k));
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toBDT(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }) + ' BDT';
}
function getCountdown(isoStr) {
  if (!isoStr) return null;
  const diff = new Date(isoStr) - new Date();
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

// ─── FETCH WORLD CUP ──────────────────────────────────────────────────────────
async function fetchWorldCup() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
    if (!res.ok) return [];
    const data = await res.json();
    const matches = data.matches || [];
    const now = Date.now();
    return matches
      .filter(m => {
        if (!m.date || !m.time || !m.team1 || m.team1.length <= 3) return false;
        try {
          const utcOffset = m.time.includes('UTC-7') ? 7 : m.time.includes('UTC-6') ? 6 : m.time.includes('UTC-5') ? 5 : 4;
          const [h, min] = m.time.split(' ')[0].split(':').map(Number);
          const d = new Date(m.date); d.setUTCHours(h + utcOffset, min, 0, 0);
          return d.getTime() >= now - 3600000;
        } catch { return false; }
      })
      .map(m => {
        const utcOffset = m.time.includes('UTC-7') ? 7 : m.time.includes('UTC-6') ? 6 : m.time.includes('UTC-5') ? 5 : 4;
        const [h, min] = m.time.split(' ')[0].split(':').map(Number);
        const d = new Date(m.date); d.setUTCHours(h + utcOffset, min, 0, 0);
        return {
          id: `wc-${m.date}-${m.team1}-${m.team2}`,
          team1: m.team1, team2: m.team2,
          round: m.round || '', ground: m.ground || '', group: m.group || '',
          kickoffMs: d.getTime(),
          kickoffBDT: d.toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BDT',
        };
      })
      .sort((a, b) => a.kickoffMs - b.kickoffMs);
  } catch { return []; }
}

// ─── FETCH CRICKET ────────────────────────────────────────────────────────────
async function fetchHighlightlyCricket() {
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  const results = await Promise.allSettled(
    dates.map(date =>
      fetch(`${HIGHLIGHTLY_BASE}/matches?date=${date}`, {
        headers: { 'x-rapidapi-key': HIGHLIGHT_API_KEY },
      }).then(r => r.ok ? r.json() : [])
    )
  );
  const seen = new Set(); const matches = [];
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    const arr = Array.isArray(r.value) ? r.value : (r.value?.data || []);
    for (const m of arr) {
      if (!m.id || seen.has(m.id)) continue; seen.add(m.id);
      const state = (m.state?.description || '').toLowerCase();
      if (state === 'finished') continue;
      if (!isAllowedMatch(m.league?.name, m.format, m.homeTeam?.name, m.awayTeam?.name)) continue;
      const startMs = new Date(m.startTime).getTime();
      if (!m.startTime || startMs < Date.now() - 3 * 3600000) continue;
      const isLive = state !== '' && state !== 'not started' && state !== 'scheduled';
      matches.push({ id: m.id, homeTeam: m.homeTeam, awayTeam: m.awayTeam, league: m.league?.name || '', format: m.format || '', startTime: m.startTime, isLive });
    }
  }
  matches.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return matches;
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function Countdown({ isoStr }) {
  const [time, setTime] = useState(getCountdown(isoStr));
  useEffect(() => { const t = setInterval(() => setTime(getCountdown(isoStr)), 1000); return () => clearInterval(t); }, [isoStr]);
  if (!time) return null;
  return <span style={{ color: '#f5c518', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>⏱ {String(time.h).padStart(2,'0')}:{String(time.m).padStart(2,'0')}:{String(time.s).padStart(2,'0')}</span>;
}

// ─── PLAYER MODAL ─────────────────────────────────────────────────────────────
function PlayerModal({ sport, channel, onClose, onChannelChange, channels }) {
  useEffect(() => { const h = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);
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
          <iframe key={channel} src={'https://streamcrichd.com/update/fetch.php?hd=' + channels[channel].hd + '&embed=1'}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            scrolling="no" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
        </div>
        <div style={{ padding: '8px 16px', background: '#070710', borderTop: '1px solid #1a1a2e' }}>
          <div style={{ fontSize: 10, color: '#333' }}>If stream is not working, switch to another channel above · Press Esc to close</div>
        </div>
      </div>
    </div>
  );
}

// ─── CRICKET CARD ─────────────────────────────────────────────────────────────
function CricketCard({ match }) {
  const cd = getCountdown(match.startTime);
  const isWithin24h = cd && cd.diff < 86400000;
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid ' + (match.isLive ? '#e50914' : isWithin24h ? 'rgba(229,9,20,0.35)' : '#1a1a2e'), borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 72, background: match.isLive ? '#140505' : isWithin24h ? '#0f0505' : '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative' }}>
        {match.homeTeam?.logo ? <img src={match.homeTeam.logo} style={{ width: 32, height: 32, objectFit: 'contain' }} alt="" /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏏</div>}
        <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
        {match.awayTeam?.logo ? <img src={match.awayTeam.logo} style={{ width: 32, height: 32, objectFit: 'contain' }} alt="" /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏏</div>}
        <div style={{ position: 'absolute', top: 6, left: 7 }}>
          {match.isLive && <span style={{ background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: 1 }}>🔴 LIVE</span>}
          {!match.isLive && isWithin24h && <span style={{ background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>SOON</span>}
        </div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ fontSize: 8, color: '#444', marginBottom: 2 }}>{match.format} · {match.league}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5 }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{match.homeTeam?.name || 'TBA'}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', flexShrink: 0 }}>vs</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{match.awayTeam?.name || 'TBA'}</div>
        </div>
        {isWithin24h && <Countdown isoStr={match.startTime} />}
        {!isWithin24h && match.startTime && <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {toBDT(match.startTime)}</div>}
      </div>
    </div>
  );
}

// ─── FOOTBALL CARD ────────────────────────────────────────────────────────────
function FootballCard({ match }) {
  const teams = match.tag ? match.tag.split(' vs ') : ['Team 1', 'Team 2'];
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 64, background: '#05050f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
        {match.poster && <img src={match.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }} />}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', fontWeight: 700 }}>VS</div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚽</div>
        </div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5 }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{teams[0]}</div>
          <div style={{ fontSize: 8, color: '#2a2a3e', flexShrink: 0 }}>vs</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{teams[1] || ''}</div>
        </div>
        <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {footballToBDT(match.kickoff)}</div>
      </div>
    </div>
  );
}

// ─── WORLD CUP CARD ───────────────────────────────────────────────────────────
function WorldCupCard({ match }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0a1a0a, #0d1a0d)', border: '1px solid #1a3a1a', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 64, background: '#050f05', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0d220d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🌍</div>
        <div style={{ fontSize: 8, color: '#1a3a1a', fontWeight: 700 }}>VS</div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0d220d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🌍</div>
      </div>
      <div style={{ padding: '9px 11px' }}>
        <div style={{ fontSize: 8, color: '#4a8a4a', marginBottom: 4 }}>{match.round}{match.group ? ' · ' + match.group : ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 5 }}>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{match.team1}</div>
          <div style={{ fontSize: 8, color: '#1a3a1a', flexShrink: 0 }}>vs</div>
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'right' }}>{match.team2}</div>
        </div>
        <div style={{ fontSize: 9, color: '#f5c518' }}>🕐 {match.kickoffBDT}</div>
        {match.ground && <div style={{ fontSize: 8, color: '#4a8a4a', marginTop: 2 }}>📍 {match.ground}</div>}
      </div>
    </div>
  );
}

// ─── HIGHLIGHT CARD ───────────────────────────────────────────────────────────
function HighlightCard({ h }) {
  const thumb = h.thumbnail || h.thumbnailUrl || h.image || h.cover || h.poster || h.imgUrl || h.imageUrl || h.video?.thumbnail || h.videos?.[0]?.thumbnail || null;
  const url = h.url || h.videoUrl || h.embedUrl || h.link || h.highlightUrl || h.youtubeUrl || h.video?.url || h.videos?.[0]?.url || null;
  const title = h.title || h.match || 'Highlight';
  return (
    <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 12, overflow: 'hidden', cursor: url ? 'pointer' : 'default', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}>
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        {thumb ? <img src={thumb} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏏</div>}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(229,9,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>▶</div>
        </div>
        <div style={{ position: 'absolute', top: 8, left: 8, background: '#e50914', color: '#fff', fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>HIGHLIGHT</div>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</div>
        <div style={{ fontSize: 9, color: '#444' }}>{h.league?.name || h.league || ''}</div>
      </div>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHdr({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</div>
      {count > 0 && <div style={{ background: color === '#e50914' ? 'rgba(229,9,20,0.12)' : color === '#f5c518' ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.05)', color, fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{count}</div>}
      <div style={{ flex: 1, height: 1, background: '#1a1a2e' }}></div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SportsPage() {
  const [sport, setSport] = useState('cricket');
  const [cricketMatches, setCricketMatches] = useState([]);
  const [footballMatches, setFootballMatches] = useState([]);
  const [worldCupMatches, setWorldCupMatches] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [cricketLoading, setCricketLoading] = useState(true);
  const [footLoading, setFootLoading] = useState(false);
  const [highLoading, setHighLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalChannel, setModalChannel] = useState(0);

  useEffect(() => {
    setCricketLoading(true);
    fetchHighlightlyCricket().then(setCricketMatches).finally(() => setCricketLoading(false));
  }, []);

  useEffect(() => {
    if (sport !== 'football' || footballMatches.length > 0) return;
    setFootLoading(true);
    Promise.allSettled([
      setFootLoading(true);
    Promise.allSettled([
      fetch(EMBEDSPORTEX_URL).then(r => r.json()).then(d => {
        const now = new Date();
        return (d.football || []).filter(m => {
          if (!isUpcomingFootball(m)) return false;
          try {
            const md = new Date(m.kickoff.replace(' ', 'T') + '+07:00');
            if (md < now || md.getFullYear() < 2026) return false;
          } catch { return false; }
          const league = getFootballLeague(m);
          return league !== null && league !== 'wc' && league !== 'cwc';
        });
      }),
      fetchWorldCup(),
    ]).then(([sportexResult, wcResult]) => {
      setFootballMatches(sportexResult.status === 'fulfilled' ? sportexResult.value : []);
      setWorldCupMatches(wcResult.status === 'fulfilled' ? wcResult.value : []);
    }).finally(() => setFootLoading(false));
  }, [sport]);

  useEffect(() => {
    if (sport !== 'highlights' || highlights.length > 0) return;
    setHighLoading(true);
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    });
    Promise.allSettled(
      dates.map(date =>
        fetch(`${HIGHLIGHTLY_BASE}/highlights?date=${date}&limit=8`, { headers: { 'x-rapidapi-key': HIGHLIGHT_API_KEY } })
          .then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) ? d : (d.data || []))
      )
    ).then(results => {
      const seen = new Set(); const all = [];
      for (const r of results) {
        if (r.status !== 'fulfilled') continue;
        for (const h of r.value) {
          if (!h.id || seen.has(h.id)) continue; seen.add(h.id);
          if (!isAllowedHighlight(h)) continue;
          all.push(h);
        }
      }
      setHighlights(all);
    }).catch(() => {}).finally(() => setHighLoading(false));
  }, [sport]);

  const liveMatches = cricketMatches.filter(m => m.isLive);
  const within24h = cricketMatches.filter(m => { if (m.isLive) return false; const cd = getCountdown(m.startTime); return cd && cd.diff < 86400000; });
  const upcomingCricket = cricketMatches.filter(m => { if (m.isLive) return false; const cd = getCountdown(m.startTime); return cd && cd.diff >= 86400000; });
  const footballByLeague = FOOTBALL_LEAGUES.map(league => ({ ...league, matches: footballMatches.filter(m => getFootballLeague(m) === league.id) })).filter(l => l.matches.length > 0);
  const channels = sport === 'cricket' ? CRICKET_CHANNELS : FOOTBALL_CHANNELS;

  return (
    <>
      <Navbar />
      {modalOpen && <PlayerModal sport={sport} channel={modalChannel} channels={channels} onClose={() => setModalOpen(false)} onChannelChange={setModalChannel} />}
      <div style={{ background: '#070710', minHeight: '100vh', padding: '90px 48px 48px', fontFamily: 'Outfit, sans-serif' }}>

        {/* TABS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1a1a2e' }}>
          <Link href="/" style={{ color: '#444', fontSize: 12, textDecoration: 'none', flexShrink: 0 }}>← Home</Link>
          <div style={{ width: 1, height: 18, background: '#1a1a2e', flexShrink: 0 }}></div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ key: 'cricket', label: '🏏 Cricket' }, { key: 'football', label: '⚽ Football' }, { key: 'highlights', label: '🎬 Highlights' }].map(t => (
              <button key={t.key} onClick={() => setSport(t.key)}
                style={{ padding: '7px 18px', borderRadius: 20, border: sport === t.key ? 'none' : '1px solid #1a1a2e', background: sport === t.key ? '#e50914' : 'transparent', color: sport === t.key ? '#fff' : '#444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CRICKET TAB ── */}
        {sport === 'cricket' && (
          <div>
            {cricketLoading && <div style={{ textAlign: 'center', padding: 80, color: '#333' }}>🏏 Loading matches...</div>}
            {!cricketLoading && (
              <>
                {liveMatches.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <SectionHdr color="#e50914" label="🔴 Live Now" count={liveMatches.length} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                      {liveMatches.map(m => <CricketCard key={m.id} match={m} />)}
                    </div>
                  </div>
                )}
                {within24h.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <SectionHdr color="#e50914" label="🔴 Starting within 24 hours" count={within24h.length} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                      {within24h.map(m => <CricketCard key={m.id} match={m} />)}
                    </div>
                  </div>
                )}
                {liveMatches.length === 0 && within24h.length === 0 && (
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
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.background = '#070710'; }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                      {upcomingCricket.map(m => <CricketCard key={m.id} match={m} />)}
                    </div>
                  </div>
                )}
                {cricketMatches.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#333' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🏏</div>
                    <div style={{ fontSize: 14 }}>No matches in the next 10 days</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── FOOTBALL TAB ── */}
        {sport === 'football' && (
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
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a2e'; e.currentTarget.style.background = '#070710'; }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{ch.label}</div>
                      <div style={{ fontSize: 9, color: '#444', marginTop: 2 }}>{ch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {footLoading && <div style={{ textAlign: 'center', padding: 60, color: '#333' }}>⚽ Loading matches...</div>}

            {/* FIFA World Cup 2026 */}
            {!footLoading && worldCupMatches.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <SectionHdr color="#4caf50" label="🌍 FIFA World Cup 2026" count={worldCupMatches.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {worldCupMatches.slice(0, 24).map(m => <WorldCupCard key={m.id} match={m} />)}
                </div>
                {worldCupMatches.length > 24 && (
                  <div style={{ textAlign: 'center', marginTop: 12, color: '#444', fontSize: 12 }}>
                    +{worldCupMatches.length - 24} more matches scheduled
                  </div>
                )}
              </div>
            )}

            {/* Other leagues */}
            {!footLoading && footballByLeague.map(league => (
              <div key={league.id} style={{ marginBottom: 32 }}>
                <SectionHdr color="#f5c518" label={league.label} count={league.matches.length} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {league.matches.map((m, i) => <FootballCard key={m.slug || i} match={m} />)}
                </div>
              </div>
            ))}

            {!footLoading && worldCupMatches.length === 0 && footballByLeague.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#333' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚽</div>
                <div style={{ fontSize: 14 }}>No upcoming matches in selected leagues</div>
              </div>
            )}
          </div>
        )}

        {/* ── HIGHLIGHTS TAB ── */}
        {sport === 'highlights' && (
          <div>
            <SectionHdr color="#fff" label="🎬 Latest Highlights" count={highlights.length} />
            {highLoading && <div style={{ textAlign: 'center', padding: 60, color: '#333' }}>🎬 Loading highlights...</div>}
            {!highLoading && highlights.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                <div style={{ fontSize: 14 }}>Highlights will appear here after matches end</div>
                <div style={{ fontSize: 12, color: '#333', marginTop: 8 }}>Check back after today's matches</div>
              </div>
            )}
            {!highLoading && highlights.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {highlights.map((h, i) => <HighlightCard key={h.id || i} h={h} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <footer style={{ padding: '20px 48px', borderTop: '1px solid #0e0e1a', textAlign: 'center', color: '#222', fontSize: 13 }}>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
