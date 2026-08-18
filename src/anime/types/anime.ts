export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface AnimeCoverImage {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface AnimeStudioNode {
  id: number;
  name: string;
  siteUrl?: string;
}

export interface AnimeCharacterNode {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image?: {
    large?: string;
    medium?: string;
  };
}

export interface AnimeStaffNode {
  id: number;
  name: {
    full: string;
  };
  image?: {
    large?: string;
  };
}

export interface AnimeRelationNode {
  id: number;
  title: AnimeTitle;
  coverImage?: AnimeCoverImage;
  format?: string;
  status?: string;
  episodes?: number;
  type?: string;
}

export interface AnimeRecommendationNode {
  id: number;
  title: AnimeTitle;
  coverImage?: AnimeCoverImage;
  averageScore?: number;
  format?: string;
  episodes?: number;
  seasonYear?: number;
  status?: string;
}

export interface AnimeMedia {
  id: number;
  idMal?: number;
  title: AnimeTitle;
  description?: string;
  coverImage: AnimeCoverImage;
  bannerImage?: string;
  format?: 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC';
  status?: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
  episodes?: number;
  duration?: number;
  genres: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  seasonYear?: number;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  trailer?: {
    id?: string;
    site?: string;
    thumbnail?: string;
  };
  studios?: {
    edges: Array<{
      isMain: boolean;
      node: AnimeStudioNode;
    }>;
  };
  characters?: {
    edges: Array<{
      role: string;
      node: AnimeCharacterNode;
    }>;
  };
  staff?: {
    edges: Array<{
      role: string;
      node: AnimeStaffNode;
    }>;
  };
  relations?: {
    edges: Array<{
      relationType: string;
      node: AnimeRelationNode;
    }>;
  };
  recommendations?: {
    nodes: Array<{
      mediaRecommendation?: AnimeRecommendationNode;
    }>;
  };
}

export interface AnimePageResult {
  pageInfo: {
    total?: number;
    perPage: number;
    currentPage: number;
    lastPage?: number;
    hasNextPage: boolean;
  };
  media: AnimeMedia[];
}

export interface AnimeSearchParams {
  search?: string;
  genre?: string;
  season?: string;
  seasonYear?: number;
  format?: string;
  status?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface AnimeWatchProgress {
  anilistId: number;
  idMal?: number;
  title: string;
  poster?: string;
  backdrop?: string;
  episode: number;
  totalEpisodes?: number;
  episodeTitle?: string;
  currentTime: number;
  duration: number;
  percentage: number;
  updatedAt: number;
}

export interface AnimePlaybackSource {
  id: string;
  name: string;
  type: 'embed' | 'stream';
  url: string;
  isDub?: boolean;
}
