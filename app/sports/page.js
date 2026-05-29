import Navbar from '@/components/Navbar';
import Link from 'next/link';

const CRICKET_API_KEY = 'e0e92d3b-51ea-4d1f-8c2d-1b5047d129ed';

async function getLiveStatus() {
  try {
    const [cricRes, footRes] = await Promise.all([
      fetch('https://api.cricapi.com/v1/matches?apikey=' + CRICKET_API_KEY + '&offset=0', { next: { revalidate: 60 } }),
      fetch('https://api.embedsportex.site/api/streams', { next: { revalidate: 60 } }),
    ]);
    const cricData = await cricRes.json();
    const footData = await footRes.json();
    const cricMatches = cricData.data || [];
    const footMatches = footData.football || [];
    const now = new Date();
    const cricLive = cricMatches.some(m => m.matchStarted && !m.matchEnded);
    const footLive = footMatches.some(m => {
      try {
        const start = new Date(m.kickoff.replace(' ', 'T') + '+07:00');
        const end = new Date(m.endTime.replace(' ', 'T') + '+07:00');
        return now >= start && now <= end;
      } catch { return false; }
    });
    return { cricLive, footLive };
  } catch {
    return { cricLive: false, footLive: false };
  }
}

export default async function SportsLanding() {
  const { cricLive, footLive } = await getLiveStatus();

  return (
    <>
      <Navbar />
      <div style={{ background: '#070710', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#333', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 40 }}>HindiMovieStream Sports</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>What are you watching today?</h1>
        <p style={{ fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 48 }}>Choose your sport to see live matches, scores and streams</p>

        <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 580, alignItems: 'stretch' }}>

          {/* CRICKET CARD */}
          <Link href="/sports/cricket" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 20, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', height: '100%', position: 'relative', transition: 'all 0.25s' }}>
              {cricLive && (
                <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e50914', display: 'inline-block' }}></span>
                  LIVE
                </div>
              )}
              <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>🏏</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Cricket</div>
              <div style={{ fontSize: 12, color: '#444', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>IPL, Bangladesh, ICC events, Test matches and more</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 24 }}>
                {['IPL 2026', 'ICC World Cup', 'BPL', 'Asia Cup', 'Test Series'].map(t => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 600, color: '#444', border: '1px solid #1a1a2e', padding: '3px 8px', borderRadius: 10 }}>{t}</span>
                ))}
              </div>
              <div style={{ background: '#e50914', color: '#fff', padding: '10px 28px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>WATCH CRICKET →</div>
            </div>
          </Link>

          {/* DIVIDER */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#222', fontSize: 11, fontWeight: 700, letterSpacing: 1, flexShrink: 0, paddingTop: 20 }}>
            <div style={{ width: 1, height: 60, background: '#1a1a2e' }}></div>
            OR
            <div style={{ width: 1, height: 60, background: '#1a1a2e' }}></div>
          </div>

          {/* FOOTBALL CARD */}
          <Link href="/sports/football" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ background: '#0e0e1a', border: '1px solid #1a1a2e', borderRadius: 20, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', height: '100%', position: 'relative' }}>
              {footLive && (
                <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e50914', display: 'inline-block' }}></span>
                  LIVE
                </div>
              )}
              <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>⚽</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Football</div>
              <div style={{ fontSize: 12, color: '#444', textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>EPL, Champions League, La Liga, FIFA World Cup and more</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 24 }}>
                {['Premier League', 'Champions League', 'La Liga', 'FIFA WC 2026', 'Serie A'].map(t => (
                  <span key={t} style={{ fontSize: 9, fontWeight: 600, color: '#444', border: '1px solid #1a1a2e', padding: '3px 8px', borderRadius: 10 }}>{t}</span>
                ))}
              </div>
              <div style={{ background: '#e50914', color: '#fff', padding: '10px 28px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>WATCH FOOTBALL →</div>
            </div>
          </Link>
        </div>
        <div style={{ marginTop: 40, fontSize: 11, color: '#222', textAlign: 'center' }}>Free live streams • Updates every minute</div>
      </div>
    </>
  );
}
