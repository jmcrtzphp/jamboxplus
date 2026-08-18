import {
  AnimeMedia,
  AnimePageResult,
  AnimeSearchParams,
} from '../types/anime';
import * as aniListApi from '../api/anilist';

/**
 * Metadata provider interface allowing pluggable providers
 */
export interface AnimeMetadataProvider {
  getTrending(page?: number, perPage?: number): Promise<AnimePageResult>;
  getPopular(page?: number, perPage?: number): Promise<AnimePageResult>;
  getRecentlyReleased(page?: number, perPage?: number): Promise<AnimePageResult>;
  getTopRated(page?: number, perPage?: number): Promise<AnimePageResult>;
  getByGenre(genre: string, page?: number, perPage?: number): Promise<AnimePageResult>;
  search(params: AnimeSearchParams): Promise<AnimePageResult>;
  getDetails(id: number): Promise<AnimeMedia>;
}

/**
 * Concrete AniList Implementation of AnimeMetadataProvider
 */
export class AniListMetadataProvider implements AnimeMetadataProvider {
  async getTrending(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
    return aniListApi.fetchTrendingAnime(page, perPage);
  }

  async getPopular(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
    return aniListApi.fetchPopularAnime(page, perPage);
  }

  async getRecentlyReleased(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
    return aniListApi.fetchRecentlyReleasedAnime(page, perPage);
  }

  async getTopRated(page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
    return aniListApi.fetchTopRatedAnime(page, perPage);
  }

  async getByGenre(genre: string, page: number = 1, perPage: number = 20): Promise<AnimePageResult> {
    return aniListApi.fetchAnimeByGenre(genre, page, perPage);
  }

  async search(params: AnimeSearchParams): Promise<AnimePageResult> {
    return aniListApi.searchAnime(params);
  }

  async getDetails(id: number): Promise<AnimeMedia> {
    return aniListApi.fetchAnimeDetails(id);
  }
}

// Default global service instance
export const animeMetadataService: AnimeMetadataProvider = new AniListMetadataProvider();
