import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { fetchTMDB } from '@/lib/tmdb';

export default async function IndianPage() {
  const [bollywood, tollywood, kollywood, malayalam, kannada, punjabi, marathi, bengali] = await Promise.all([
    fetchTMDB('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'te', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ta', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'ml', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'kn', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'pa', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'mr', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/movie', { with_original_language: 'bn', region: 'IN', sort_by: 'popularity.desc' }),
  ]);

  const tag = m => ({ ...m, media_type: 'movie' });
  const seenIds = new Set();
  const dedupe = (items) => items.filter(item => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="🎬 Bollywood (Hindi Cinema)" items={dedupe(bollywood.results.map(tag))} seeAllHref="/indian/bollywood" />
        <Carousel title="🎬 Tollywood (Telugu Cinema)" items={dedupe(tollywood.results.map(tag))} seeAllHref="/indian/tollywood" />
        <Carousel title="🎬 Kollywood (Tamil Cinema)" items={dedupe(kollywood.results.map(tag))} seeAllHref="/indian/kollywood" />
        <Carousel title="🎬 Malayalam Cinema" items={dedupe(malayalam.results.map(tag))} seeAllHref="/indian/malayalam" />
        <Carousel title="🎬 Sandalwood (Kannada Cinema)" items={dedupe(kannada.results.map(tag))} seeAllHref="/indian/kannada" />
        <Carousel title="🎬 Pollywood (Punjabi Cinema)" items={dedupe(punjabi.results.map(tag))} seeAllHref="/indian/punjabi" />
        <Carousel title="🎬 Marathi Cinema" items={dedupe(marathi.results.map(tag))} seeAllHref="/indian/marathi" />
        <Carousel title="🎬 Bengali Cinema" items={dedupe(bengali.results.map(tag))} seeAllHref="/indian/bengali" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
