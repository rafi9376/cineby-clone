'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const [showLanding, setShowLanding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const chosen = sessionStorage.getItem('category');
    if (chosen) setShowLanding(false);
  }, []);

  const handleChoice = (choice) => {
    sessionStorage.setItem('category', choice);
    setShowLanding(false);
    if (choice === 'english') router.push('/home');
    if (choice === 'indian') router.push('/indian');
    if (choice === 'bangla') router.push('/bangla');
  };

  if (!showLanding) return null;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: "'Bebas Neue', sans-serif",
    }}>
      {/* English Movies */}
      <div onClick={() => handleChoice('english')} style={{
        flex: 1,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'flex 0.4s ease',
        borderRight: '2px solid rgba(255,255,255,0.1)',
      }}
      onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
      onMouseLeave={e => e.currentTarget.style.flex = '1'}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎬</div>
        <h2 style={{ fontSize: 42, color: 'white', letterSpacing: 4, textAlign: 'center' }}>ENGLISH</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, letterSpacing: 2 }}>MOVIES & TV SHOWS</p>
      </div>

      {/* Indian Movies */}
      <div onClick={() => handleChoice('indian')} style={{
        flex: 1,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'flex 0.4s ease',
        borderRight: '2px solid rgba(255,255,255,0.1)',
      }}
      onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
      onMouseLeave={e => e.currentTarget.style.flex = '1'}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>🇮🇳</div>
        <h2 style={{ fontSize: 42, color: 'white', letterSpacing: 4, textAlign: 'center' }}>INDIAN</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, letterSpacing: 2 }}>MOVIES & TV SHOWS</p>
      </div>

      {/* Bangla Movies */}
      <div onClick={() => handleChoice('bangla')} style={{
        flex: 1,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/original/cuETFzxJ4iR2H1IAuTUlEh8QL4Z.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'flex 0.4s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
      onMouseLeave={e => e.currentTarget.style.flex = '1'}
      >
        <div style={{ fontSize: 60, marginBottom: 16 }}>🇧🇩</div>
        <h2 style={{ fontSize: 42, color: 'white', letterSpacing: 4, textAlign: 'center' }}>BANGLA</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, letterSpacing: 2 }}>MOVIES & NATOK</p>
      </div>
    </div>
  );
}
