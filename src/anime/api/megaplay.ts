import { AnimePlaybackSource, AnimeWatchProgress } from '../types/anime';
import { saveWatchProgress } from '../../lib/cinesrc';

export interface BuildAnimePlaybackOptions {
  anilistId: number;
  idMal?: number;
  episode: number;
  title?: string;
  poster?: string;
  backdrop?: string;
  autoPlay?: boolean;
  startAt?: number;
  isDub?: boolean;
}

/**
 * Builds a list of resilient MegaPlay playback servers/sources for an anime episode
 */
export function getAnimePlaybackSources(options: BuildAnimePlaybackOptions): AnimePlaybackSource[] {
  const { anilistId, idMal, episode } = options;
  const ep = Math.max(1, episode || 1);

  const sources: AnimePlaybackSource[] = [
    {
      id: 'megaplay-ani-sub',
      name: 'MegaPlay (AniList - Subbed)',
      type: 'embed',
      url: `https://megaplay.buzz/stream/ani/${anilistId}/${ep}/sub`,
      isDub: false,
    },
    {
      id: 'megaplay-ani-dub',
      name: 'MegaPlay (AniList - Dubbed)',
      type: 'embed',
      url: `https://megaplay.buzz/stream/ani/${anilistId}/${ep}/dub`,
      isDub: true,
    },
  ];

  if (idMal && idMal !== anilistId) {
    sources.push({
      id: 'megaplay-mal-sub',
      name: 'MegaPlay (MAL - Subbed)',
      type: 'embed',
      url: `https://megaplay.buzz/stream/mal/${idMal}/${ep}/sub`,
      isDub: false,
    });
    sources.push({
      id: 'megaplay-mal-dub',
      name: 'MegaPlay (MAL - Dubbed)',
      type: 'embed',
      url: `https://megaplay.buzz/stream/mal/${idMal}/${ep}/dub`,
      isDub: true,
    });
  }

  return sources;
}

const ANIME_PROGRESS_STORAGE_KEY = 'jamtv_anime_progress';

/**
 * Saves Anime Watch Progress
 */
export function saveAnimeWatchProgress(progress: AnimeWatchProgress): void {
  try {
    const existingStr = localStorage.getItem(ANIME_PROGRESS_STORAGE_KEY);
    let list: AnimeWatchProgress[] = existingStr ? JSON.parse(existingStr) : [];

    // Filter out previous entry for this anime
    list = list.filter(item => item.anilistId !== progress.anilistId);

    // Add updated progress at start
    list.unshift({
      ...progress,
      updatedAt: Date.now(),
    });

    list = list.slice(0, 30);
    localStorage.setItem(ANIME_PROGRESS_STORAGE_KEY, JSON.stringify(list));

    // Also sync to global watch progress so Continue Watching row displays it
    saveWatchProgress({
      id: `anime-${progress.anilistId}`,
      tmdbId: progress.anilistId,
      mediaType: 'tv',
      title: progress.title,
      poster: progress.poster,
      backdrop: progress.backdrop,
      season: 1,
      episode: progress.episode,
      episodeTitle: progress.episodeTitle || `Episode ${progress.episode}`,
      currentTime: progress.currentTime,
      duration: progress.duration,
      percentage: progress.percentage,
      updatedAt: Date.now(),
    });

    window.dispatchEvent(new CustomEvent('jamtv-anime-progress-updated', { detail: progress }));
  } catch (err) {
    console.warn('Failed to save anime watch progress:', err);
  }
}

/**
 * Retrieves watch progress for an anime by AniList ID
 */
export function getAnimeWatchProgress(anilistId: number): AnimeWatchProgress | null {
  try {
    const existingStr = localStorage.getItem(ANIME_PROGRESS_STORAGE_KEY);
    if (!existingStr) return null;
    const list: AnimeWatchProgress[] = JSON.parse(existingStr);
    return list.find(item => item.anilistId === anilistId) || null;
  } catch {
    return null;
  }
}

/**
 * Retrieves all saved anime progress items
 */
export function getAllAnimeWatchProgress(): AnimeWatchProgress[] {
  try {
    const existingStr = localStorage.getItem(ANIME_PROGRESS_STORAGE_KEY);
    if (!existingStr) return [];
    const list: AnimeWatchProgress[] = JSON.parse(existingStr);
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}
