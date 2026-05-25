const API_KEY = '4d1f4d49bd0ae6fc1d622c7f468f73bb';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

export async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const getTrending = async () => {
  const [p1, p2] = await Promise.all([fetchTMDB('/trending/all/week', { page: 1 }), fetchTMDB('/trending/all/week', { page: 2 })]);
  return { results: [...p1.results, ...p2.results] };
};
export const getPopularMovies = async () => {
  const [p1, p2, p3] = await Promise.all([fetchTMDB('/movie/popular', { page: 1 }), fetchTMDB('/movie/popular', { page: 2 }), fetchTMDB('/movie/popular', { page: 3 })]);
  return { results: [...p1.results, ...p2.results, ...p3.results] };
};
export const getTopRatedMovies = async () => {
  const [p1, p2, p3] = await Promise.all([fetchTMDB('/movie/top_rated', { page: 1 }), fetchTMDB('/movie/top_rated', { page: 2 }), fetchTMDB('/movie/top_rated', { page: 3 })]);
  return { results: [...p1.results, ...p2.results, ...p3.results] };
};
export const getNowPlaying = async () => {
  const [p1, p2] = await Promise.all([fetchTMDB('/movie/now_playing', { page: 1 }), fetchTMDB('/movie/now_playing', { page: 2 })]);
  return { results: [...p1.results, ...p2.results] };
};
export const getPopularTV = async () => {
  const [p1, p2, p3] = await Promise.all([fetchTMDB('/tv/popular', { page: 1 }), fetchTMDB('/tv/popular', { page: 2 }), fetchTMDB('/tv/popular', { page: 3 })]);
  return { results: [...p1.results, ...p2.results, ...p3.results] };
};
export const getTopRatedTV = () => fetchTMDB('/tv/top_rated');
export const getMovieDetails = (id) => fetchTMDB(`/movie/${id}`, { append_to_response: 'videos,credits' });
export const getTVDetails = (id) => fetchTMDB(`/tv/${id}`, { append_to_response: 'videos,credits' });
export const searchMulti = (query) => fetchTMDB('/search/multi', { query, include_adult: false });
