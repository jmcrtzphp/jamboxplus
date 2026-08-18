import { AnimeMedia, AnimePageResult, AnimeSearchParams } from '../types/anime';

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

// In-Memory cache map with expiration
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T, ttlSeconds: number = 300): void {
  memoryCache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  });
}

// Media Fields Fragment
const MEDIA_FRAGMENT = `
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  description(asHtml: false)
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  format
  status
  episodes
  duration
  genres
  averageScore
  meanScore
  popularity
  season
  seasonYear
  startDate {
    year
    month
    day
  }
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
  trailer {
    id
    site
    thumbnail
  }
  studios(isMain: true) {
    edges {
      isMain
      node {
        id
        name
        siteUrl
      }
    }
  }
`;

const DETAILED_MEDIA_FRAGMENT = `
  ${MEDIA_FRAGMENT}
  characters(sort: ROLE, perPage: 12) {
    edges {
      role
      node {
        id
        name {
          full
          native
        }
        image {
          large
          medium
        }
      }
    }
  }
  staff(perPage: 8) {
    edges {
      role
      node {
        id
        name {
          full
        }
        image {
          large
        }
      }
    }
  }
  relations {
    edges {
      relationType
      node {
        id
        title {
          romaji
          english
          userPreferred
        }
        coverImage {
          large
        }
        format
        status
        episodes
        type
      }
    }
  }
  recommendations(perPage: 10, sort: RATING_DESC) {
    nodes {
      mediaRecommendation {
        id
        title {
          romaji
          english
          userPreferred
        }
        coverImage {
          large
        }
        averageScore
        format
        episodes
        seasonYear
        status
      }
    }
  }
`;

/**
 * Executes a GraphQL request against the AniList API
 */
async function fetchAniListGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const cacheKey = `anilist_${JSON.stringify({ query: query.slice(0, 100), variables })}`;
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('AniList API rate limited. Returning cached or empty fallback.');
        throw new Error('AniList rate limit exceeded. Please wait a moment.');
      }
      throw new Error(`AniList API responded with HTTP status ${response.status}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'GraphQL Query Error');
    }

    const data = json.data as T;
    // Cache successful response for 10 minutes by default
    setCached(cacheKey, data, 600);
    return data;
  } catch (error: any) {
    console.error('AniList fetch error:', error);
    throw error;
  }
}

/**
 * Fetch Trending Anime
 */
export async function fetchTrendingAnime(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, { page, perPage });
  return data.Page;
}

/**
 * Fetch Popular Anime (All Time)
 */
export async function fetchPopularAnime(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, { page, perPage });
  return data.Page;
}

/**
 * Fetch Recently Released / Currently Airing Anime
 */
export async function fetchRecentlyReleasedAnime(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, status: RELEASING, sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, { page, perPage });
  return data.Page;
}

/**
 * Fetch Top Rated Anime
 */
export async function fetchTopRatedAnime(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, { page, perPage });
  return data.Page;
}

/**
 * Fetch Anime by Genre
 */
export async function fetchAnimeByGenre(genre: string, page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
  const query = `
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, genre: $genre, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, { genre, page, perPage });
  return data.Page;
}

/**
 * Search Anime with multi-faceted filters
 */
export async function searchAnime(params: AnimeSearchParams): Promise<AnimePageResult> {
  const {
    search,
    genre,
    season,
    seasonYear,
    format,
    status,
    sort = 'SEARCH_MATCH',
    page = 1,
    perPage = 24
  } = params;

  const variables: Record<string, any> = {
    page,
    perPage,
  };

  if (search && search.trim()) variables.search = search.trim();
  if (genre) variables.genre = genre;
  if (season) variables.season = season;
  if (seasonYear) variables.seasonYear = seasonYear;
  if (format) variables.format = format;
  if (status) variables.status = status;

  // Determine sort array
  let sortArr = ['POPULARITY_DESC'];
  if (search && search.trim()) {
    sortArr = ['SEARCH_MATCH', 'POPULARITY_DESC'];
  } else if (sort === 'TRENDING') {
    sortArr = ['TRENDING_DESC'];
  } else if (sort === 'POPULARITY') {
    sortArr = ['POPULARITY_DESC'];
  } else if (sort === 'SCORE') {
    sortArr = ['SCORE_DESC'];
  } else if (sort === 'START_DATE') {
    sortArr = ['START_DATE_DESC'];
  }

  variables.sort = sortArr;

  const query = `
    query ($page: Int, $perPage: Int, $search: String, $genre: String, $season: MediaSeason, $seasonYear: Int, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(
          type: ANIME,
          search: $search,
          genre: $genre,
          season: $season,
          seasonYear: $seasonYear,
          format: $format,
          status: $status,
          sort: $sort,
          isAdult: false
        ) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Page: AnimePageResult }>(query, variables);
  return data.Page;
}

/**
 * Fetch Comprehensive Anime Details by AniList ID
 */
export async function fetchAnimeDetails(id: number): Promise<AnimeMedia> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${DETAILED_MEDIA_FRAGMENT}
      }
    }
  `;

  const data = await fetchAniListGraphQL<{ Media: AnimeMedia }>(query, { id });
  return data.Media;
}

/**
 * Helper to extract clean display title
 */
export function getAnimeDisplayTitle(media?: AnimeMedia | null): string {
  if (!media?.title) return 'Unknown Title';
  return (
    media.title.english ||
    media.title.userPreferred ||
    media.title.romaji ||
    media.title.native ||
    'Anime'
  );
}

/**
 * Helper to extract high resolution poster image
 */
export function getAnimePoster(media?: AnimeMedia | null): string {
  return (
    media?.coverImage?.extraLarge ||
    media?.coverImage?.large ||
    media?.coverImage?.medium ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
  );
}

/**
 * Helper to extract high resolution backdrop image
 */
export function getAnimeBackdrop(media?: AnimeMedia | null): string {
  return (
    media?.bannerImage ||
    media?.coverImage?.extraLarge ||
    media?.coverImage?.large ||
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80'
  );
}

/**
 * Popular anime genres for filter pills
 */
export const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller'
];
