import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import { fetchTMDB } from '../lib/tmdb';

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

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <Carousel title="🎬 Bollywood (Hindi Cinema)" items={bollywood.results.map(tag)} seeAllHref="/indian/bollywood" />
        <Carousel title="🎬 Tollywood (Telugu Cinema)" items={tollywood.results.map(tag)} seeAllHref="/indian/tollywood" />
        <Carousel title="🎬 Kollywood (Tamil Cinema)" items={kollywood.results.map(tag)} seeAllHref="/indian/kollywood" />
        <Carousel title="🎬 Malayalam Cinema" items={malayalam.results.map(tag)} seeAllHref="/indian/malayalam" />
        <Carousel title="🎬 Sandalwood (Kannada Cinema)" items={kannada.results.map(tag)} seeAllHref="/indian/kannada" />
        <Carousel title="🎬 Pollywood (Punjabi Cinema)" items={punjabi.results.map(tag)} seeAllHref="/indian/punjabi" />
        <Carousel title="🎬 Marathi Cinema" items={marathi.results.map(tag)} seeAllHref="/indian/marathi" />
        <Carousel title="🎬 Bengali Cinema" items={bengali.results.map(tag)} seeAllHref="/indian/bengali" />
      </div>
      <footer>
        <p>© 2026 | Powered by hindimoviestream.xyz</p>
      </footer>
    </>
  );
}
