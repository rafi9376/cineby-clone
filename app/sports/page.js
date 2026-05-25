'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

export default function SportsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.cricketdata.org/cricket/?apikey=${API_KEY}&offset=0`)
      .then(r => r.json())
      .then(data => {
        setMatches(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load matches');
        setLoading(false);
      });
  }, []);

  const live = matches.filter(m => m.matchStarted && !m.matchEnded);
  const upcoming = matches.filter(m => !m.matchStarted);
  const recent = matches.filter(m => m.matchEnded);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 90, padding: '90px 48px 48px', background: '#070710', minHeight: '100vh' }}>

        {/* LIVE NOW */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#e50914', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e50914', display: 'inline-block', boxShadow: '0 0 8px #e50914' }}></span>
            LIVE MATCHES
          </h2>
          {loading && <p style={{ color: '#888' }}>Loading matches...</p>}
          {error && <p style={{ color: '#e50914' }}>{error}</p>}
          {!loading && live.length === 0 && <p style={{ color: '#555', fontSize: 14 }}>No live matches right now</p>}
          {live.map(m => <MatchCard key={m.id} match={m} type="live" />)}
        </div>

        {/* UPCOMING */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#f5c518', marginBottom: 20 }}>
            📅 UPCOMING MATCHES
          </h2>
          {!loading && upcoming.length === 0 && <p style={{ color: '#555', fontSize: 14 }}>No upcoming matches</p>}
          {upcoming.slice(0, 8).map(m => <MatchCard key={m.id} match={m} type="upcoming" />)}
        </div>

        {/* RECENT RESULTS */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, color: '#fff', marginBottom: 20 }}>
            🏆 RECENT RESULTS
          </h2>
          {!loading && recent.length === 0 && <p style={{ color: '#555', fontSize: 14 }}>No recent results</p>}
          {recent.slice(0, 8).map(m => <MatchCard key={m.id} match={m} type="recent" />)}
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
  const teams = match.name?.split(' vs ') || ['Team 1', 'Team 2'];

  return (
    <div style={{
      background: '#0e0e1a',
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      boxShadow: type === 'live' ? '0 0 24px rgba(229,9,20,0.2)' : 'none'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {type === 'live' && (
            <span style={{ background: '#e50914', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>
              🔴 LIVE
            </span>
          )}
          {type === 'upcoming' && (
            <span style={{ background: '#f5c518', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>
              📅 UPCOMING
            </span>
          )}
          {type === 'recent' && (
            <span style={{ background: '#1e1e30', color: '#aaa', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>
              ✅ COMPLETED
            </span>
          )}
          <span style={{ color: '#555', fontSize: 12 }}>
            {match.matchType?.toUpperCase()} • {match.venue || 'Venue TBC'}
          </span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          {teams[0]} <span style={{ color: '#333', fontSize: 14, margin: '0 10px' }}>vs</span> {teams[1]}
        </div>

        {match.status && (
          <div style={{ fontSize: 13, color: type === 'live' ? '#e50914' : '#777' }}>
            {match.status}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right', minWidth: 140 }}>
        {match.score?.length > 0 ? match.score.map((s, i) => (
          <div key={i} style={{ fontSize: 13, color: '#a0a0b8', marginBottom: 4 }}>
            <span style={{ color: '#777', fontSize: 11 }}>{s.inning}: </span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{s.r}/{s.w}</span>
            <span style={{ color: '#555', fontSize: 11 }}> ({s.o} ov)</span>
          </div>
        )) : (
          <span style={{ color: '#444', fontSize: 12 }}>Score unavailable</span>
        )}
      </div>
    </div>
  );
}
