import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { fetchTMDB } from '@/lib/tmdb';

export default async function IndianTVPage() {
  const [hindi, tamil, telugu, malayalam, kannada, bengali] = await Promise.all([
    fetchTMDB('/discover/tv', { with_original_language: 'hi', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'ta', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'te', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'ml', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'kn', sort_by: 'popularity.desc' }),
    fetchTMDB('/discover/tv', { with_original_language: 'bn', region: 'IN', sort_by: 'popularity.desc' }),
  ]);

  const tag = t => ({ ...t, media_type: 'tv' });
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
        <Carousel title="📺 Hindi TV Shows" items={dedupe(hindi.results.map(tag))} seeAllHref="/indian/tv/hindi" />
        <Carousel title="📺 Tamil TV Shows" items={dedupe(tamil.results.map(tag))} seeAllHref="/indian/tv/tamil" />
        <Carousel title="📺 Telugu TV Shows" items={dedupe(telugu.results.map(tag))} seeAllHref="/indian/tv/telugu" />
        <Carousel title="📺 Malayalam TV Shows" items={dedupe(malayalam.results.map(tag))} seeAllHref="/indian/tv/malayalam" />
        <Carousel title="📺 Kannada TV Shows" items={dedupe(kannada.results.map(tag))} seeAllHref="/indian/tv/kannada" />
        <Carousel title="📺 Bengali TV Shows" items={dedupe(bengali.results.map(tag))} seeAllHref="/indian/tv/bengali" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
