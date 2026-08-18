import {
  AnimePlaybackSource,
  AnimeWatchProgress,
} from '../types/anime';
import * as cineSrcApi from '../api/megaplay';

/**
 * Playback Provider Interface allowing future alternate providers
 */
export interface AnimePlaybackProvider {
  getSources(options: cineSrcApi.BuildAnimePlaybackOptions): AnimePlaybackSource[];
  saveProgress(progress: AnimeWatchProgress): void;
  getProgress(anilistId: number): AnimeWatchProgress | null;
  getAllProgress(): AnimeWatchProgress[];
}

/**
 * CineSrc implementation of AnimePlaybackProvider
 */
export class CineSrcAnimePlaybackProvider implements AnimePlaybackProvider {
  getSources(options: cineSrcApi.BuildAnimePlaybackOptions): AnimePlaybackSource[] {
    return cineSrcApi.getAnimePlaybackSources(options);
  }

  saveProgress(progress: AnimeWatchProgress): void {
    cineSrcApi.saveAnimeWatchProgress(progress);
  }

  getProgress(anilistId: number): AnimeWatchProgress | null {
    return cineSrcApi.getAnimeWatchProgress(anilistId);
  }

  getAllProgress(): AnimeWatchProgress[] {
    return cineSrcApi.getAllAnimeWatchProgress();
  }
}

// Default global playback service instance
export const animePlaybackService: AnimePlaybackProvider = new CineSrcAnimePlaybackProvider();
