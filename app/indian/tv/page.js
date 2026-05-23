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

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="📺 Hindi TV Shows" items={hindi.results.map(tag)} seeAllHref="/indian/tv/hindi" />
        <Carousel title="📺 Tamil TV Shows" items={tamil.results.map(tag)} seeAllHref="/indian/tv/tamil" />
        <Carousel title="📺 Telugu TV Shows" items={telugu.results.map(tag)} seeAllHref="/indian/tv/telugu" />
        <Carousel title="📺 Malayalam TV Shows" items={malayalam.results.map(tag)} seeAllHref="/indian/tv/malayalam" />
        <Carousel title="📺 Kannada TV Shows" items={kannada.results.map(tag)} seeAllHref="/indian/tv/kannada" />
        <Carousel title="📺 Bengali TV Shows" items={bengali.results.map(tag)} seeAllHref="/indian/tv/bengali" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
