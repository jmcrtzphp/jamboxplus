export interface StreamingOption {
  service: {
    id: string;
    name: string;
    imageSet?: {
      lightThemeImage?: string;
      darkThemeImage?: string;
      whiteImage?: string;
    }
  };
  type: string;
  link: string;
  videoLink?: string;
  quality?: string;
  audios?: { language: string }[];
  subtitles?: { language: string }[];
}

export interface SeasonInfo {
  id: number | string;
  name: string;
  seasonNumber: number;
  episodeCount?: number;
  overview?: string;
  posterPath?: string;
  airDate?: string;
}

export interface Episode {
  id: number | string;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview?: string;
  stillPath?: string;
  airDate?: string;
  runtime?: number;
  voteAverage?: number;
}

export interface SeasonDetails {
  id: number | string;
  seasonNumber: number;
  name: string;
  overview?: string;
  posterPath?: string;
  episodes: Episode[];
}

export interface Show {
  id: string;
  imdbId?: string;
  tmdbId?: string;
  title: string;
  originalTitle?: string;
  showType: 'movie' | 'series';
  releaseYear: number;
  overview?: string;
  rating?: number;
  runtime?: number; // minutes
  genres?: { id: string; name: string }[];
  directors?: string[];
  cast?: string[];
  imageSet?: {
    poster?: string;
    verticalPoster?: { w240?: string; w360?: string; w480?: string; w600?: string; w720?: string; };
    horizontalPoster?: { w360?: string; w480?: string; w720?: string; w1080?: string; };
  };
  streamingOptions?: Record<string, StreamingOption[]>;
  seasonCount?: number;
  episodeCount?: number;
  seasons?: SeasonInfo[];
}

export interface FilterParams {
  country: string;
  movie_genre?: number | null;
  tv_genre?: number | null;
  show_type?: 'movie' | 'series';
  catalogs?: string;
  in_theaters?: boolean;
  genres?: string;
  keyword?: string;
  year_min?: number;
  year_max?: number;
  order_by?: string;
  cursor?: string;
  series_granularity?: string;
  title?: string;
}

export interface PaginatedResult<T> {
  hasMore: boolean;
  nextCursor?: string;
  shows: T[];
}

// Convert TMDB response to our normalized Model
function normalizeShow(data: any): Show {
  return {
    id: data.id,
    imdbId: data.imdbId,
    tmdbId: data.tmdbId,
    title: data.title,
    originalTitle: data.originalTitle,
    showType: data.showType,
    releaseYear: data.releaseYear,
    overview: data.overview,
    rating: data.rating,
    runtime: data.runtime,
    genres: data.genres,
    directors: data.directors,
    cast: data.cast,
    imageSet: data.imageSet,
    streamingOptions: data.streamingOptions,
    seasonCount: data.seasonCount,
    episodeCount: data.episodeCount,
    seasons: data.seasons
  };
}

// Simple memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
// In-flight requests deduplicator
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export interface SearchSuggestion {
  id: string;
  title: string;
  mediaType: 'movie' | 'tv' | 'person';
  releaseYear: number | null;
  rating: number | null;
  poster: string | null;
}

export interface TrendingSearchItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
}

// The generic fetcher proxy
async function tmdbRequest<T>(endpoint: string, params: Record<string, any> = {}, retries = 3, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, String(v));
    }
  }
  
  const cacheKey = `${endpoint}?${query.toString()}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    apiCache.delete(cacheKey);
  }

  // Check if an identical request is already in-flight (only if no signal is attached)
  if (!signal && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }
  
  const url = `/api${endpoint}${query.toString() ? '?' + query.toString() : ''}`;
  
  const requestPromise = (async () => {
    try {
      const res = await fetch(url, { signal });
      if (res.status === 429 && retries > 0) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
        return tmdbRequest<T>(endpoint, params, retries - 1, signal);
      }
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        let errorMessage = "Unable to connect. Check your connection and try again.";
        if (res.status === 401 || res.status === 403) errorMessage = "Invalid TMDB_API_KEY. Please check your API key in the environment variables.";
        if (res.status === 429) errorMessage = "Too many requests. Please try again shortly.";
        if (res.status >= 500) errorMessage = "The streaming catalog is temporarily unavailable.";
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      if (err.message === "Too many requests. Please try again shortly." && retries > 0) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
        return tmdbRequest<T>(endpoint, params, retries - 1, signal);
      }
      throw err;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  if (!signal) {
    inFlightRequests.set(cacheKey, requestPromise);
  }
  return requestPromise;
}

export async function fetchFilters(params: FilterParams): Promise<PaginatedResult<Show>> {
  const endpoint = params.show_type === 'series' ? '/tv-shows' : '/movies';
  const data = await tmdbRequest<any>(endpoint, params);
  
  return {
    hasMore: data.hasMore || false,
    nextCursor: data.nextCursor,
    shows: (data.shows || data.result || []).map(normalizeShow)
  };
}

export async function searchTitle(params: FilterParams, signal?: AbortSignal): Promise<PaginatedResult<Show>> {
  const data = await tmdbRequest<any>('/search', params, 3, signal);
  
  if (Array.isArray(data)) {
    return {
      hasMore: false,
      nextCursor: undefined,
      shows: data.map(normalizeShow)
    };
  }

  return {
    hasMore: data.hasMore || false,
    nextCursor: data.nextCursor,
    shows: (data.shows || data.result || []).map(normalizeShow)
  };
}

export async function fetchSearchSuggestions(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
  try {
    const data = await tmdbRequest<{ suggestions: SearchSuggestion[] }>('/search/suggestions', { q: query }, 1, signal);
    return data.suggestions || [];
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    return [];
  }
}

export async function fetchTrendingSearches(): Promise<TrendingSearchItem[]> {
  try {
    const data = await tmdbRequest<{ trending: TrendingSearchItem[] }>('/search/trending');
    return data.trending || [];
  } catch (_) {
    return [];
  }
}


export async function fetchByGenre(movieId: number | null, tvId: number | null, showType: 'movie' | 'series' | 'all' = 'all', country = 'US', cursor?: string): Promise<PaginatedResult<Show>> {
  const params: any = {
    show_type: showType,
    country,
    cursor
  };
  if (movieId) params.movie_genre = movieId;
  if (tvId) params.tv_genre = tvId;

  const data = await tmdbRequest<any>('/discover', params);

  return {
    hasMore: data.hasMore || false,
    nextCursor: data.nextCursor,
    shows: (data.shows || data.result || []).map(normalizeShow)
  };
}

export async function fetchShowDetails(id: string, country: string): Promise<Show> {
  const data = await tmdbRequest<any>(`/shows/${id}`, { country });
  return normalizeShow(data);
}

export async function fetchSeasonDetails(tvId: string, seasonNumber: number): Promise<SeasonDetails> {
  const cleanId = tvId.replace(/^(tv|series)-/, '');
  const data = await tmdbRequest<SeasonDetails>(`/tv/${cleanId}/season/${seasonNumber}`);
  return data;
}
export async function fetchRelatedShows(id: string): Promise<Show[]> {
  const data = await tmdbRequest<any[]>(`/shows/${id}/related`);
  return data.map(normalizeShow);
}
