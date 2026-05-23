'use client';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Reviews({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, `reviews_${movieId}`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [movieId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await addDoc(collection(db, `reviews_${movieId}`), {
      name: name.trim() || 'Anonymous',
      text: text.trim(),
      rating,
      createdAt: serverTimestamp(),
    });
    setName(''); setText(''); setRating(5);
    setSubmitting(false);
  };

  return (
    <div style={{ padding: '40px 64px', borderTop: '1px solid var(--border)' }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'block', width: 3, height: 22, background: 'linear-gradient(to bottom, var(--accent), transparent)', borderRadius: 2 }}></span>
        REVIEWS & RATINGS
      </h2>

      {/* Submit Form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <input
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ flex: 1, minWidth: 160, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          />
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}
          >
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} {n}/5</option>)}
          </select>
        </div>
        <textarea
          placeholder="Write your review..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 14, outline: 'none', resize: 'vertical', marginBottom: 12 }}
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? 'Submitting...' : '✍️ Submit Review'}
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p style={{ color: 'var(--muted2)', fontSize: 14 }}>No reviews yet. Be the first!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                <span style={{ color: 'var(--accent2)', fontSize: 13 }}>{'⭐'.repeat(r.rating)}</span>
              </div>
              <p style={{ fontSize: 14, color: '#b0b0c8', lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
