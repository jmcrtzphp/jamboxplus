/**
 * CineSRC API Video Player Integration
 * Documentation: https://cinesrc.st/docs
 */

export interface CineSrcUrlOptions {
  [key: string]: any;
}

export interface BuildCineSrcUrlParams {
  type: 'movie' | 'tv';
  tmdbId: string | number;
  season?: number;
  episode?: number;
  options?: CineSrcUrlOptions;
}

/**
 * Builds the official CineSRC embed player URL with query parameters
 * Movies: https://cinesrc.st/embed/movie/{TMDB_ID}
 * TV:     https://cinesrc.st/embed/tv/{TMDB_ID}?s={SEASON}&e={EPISODE}
 */
export function buildCineSrcUrl({
  type,
  tmdbId,
  season = 1,
  episode = 1,
  options = {}
}: BuildCineSrcUrlParams): string {
  // Strip any type prefixes if present (e.g. "movie-550" -> "550")
  const cleanTmdbId = String(tmdbId).replace(/^(movie|tv|series)-/, '').trim();
  
  if (!cleanTmdbId) {
    throw new Error('Invalid TMDB ID provided to buildCineSrcUrl');
  }

  const sNum = Math.max(1, Number(season) || 1);
  const epNum = Math.max(1, Number(episode) || 1);

  const baseUrl = type === 'movie'
    ? `https://cinesrc.st/embed/movie/${cleanTmdbId}`
    : `https://cinesrc.st/embed/tv/${cleanTmdbId}?s=${sNum}&e=${epNum}`;

  const url = new URL(baseUrl);
  return url.toString();
}

/**
 * Validates if postMessage event comes from a trusted CineSRC origin
 */
export function isCineSrcOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (
      url.hostname === 'cinesrc.st' ||
      url.hostname === 'www.cinesrc.st' ||
      url.hostname.endsWith('.cinesrc.st')
    );
  } catch {
    return origin.includes('cinesrc.st');
  }
}

export interface WatchProgressItem {
  id: string; // e.g. "movie-550" or "tv-1399"
  tmdbId: string | number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster?: string;
  backdrop?: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  currentTime: number;
  duration: number;
  percentage: number;
  updatedAt: number;
}

const STORAGE_KEY_PREFIX = 'jamtv_cinesrc_progress';

function getStorageKey(profileId?: string): string {
  if (profileId) {
    return `${STORAGE_KEY_PREFIX}_${profileId}`;
  }
  try {
    const active = localStorage.getItem('jamtv_active_profile');
    if (active) {
      const p = JSON.parse(active);
      if (p.id) return `${STORAGE_KEY_PREFIX}_${p.id}`;
    }
  } catch (_) {}
  return `${STORAGE_KEY_PREFIX}_default`;
}

/**
 * Saves or updates playback progress for a movie or TV episode
 */
export function saveWatchProgress(item: WatchProgressItem, profileId?: string): void {
  try {
    const key = getStorageKey(profileId);
    const existingStr = localStorage.getItem(key);
    let list: WatchProgressItem[] = existingStr ? JSON.parse(existingStr) : [];

    // Filter out previous entry for this show/movie
    list = list.filter(i => i.id !== item.id && String(i.tmdbId) !== String(item.tmdbId));

    list.unshift({
      ...item,
      updatedAt: Date.now()
    });

    // Keep up to 30 recent items
    list = list.slice(0, 30);
    localStorage.setItem(key, JSON.stringify(list));

    // Trigger local storage event for reactive UI updates
    window.dispatchEvent(new CustomEvent('jamtv-progress-updated', { detail: item }));
  } catch (err) {
    console.warn('Failed to save watch progress:', err);
  }
}

/**
 * Retrieves watch progress for a specific TMDB item
 */
export function getWatchProgress(idOrTmdbId: string | number, profileId?: string): WatchProgressItem | null {
  try {
    const key = getStorageKey(profileId);
    const existingStr = localStorage.getItem(key);
    if (!existingStr) return null;
    const list: WatchProgressItem[] = JSON.parse(existingStr);
    
    const cleanId = String(idOrTmdbId).replace(/^(movie|tv|series)-/, '');
    return list.find(i => i.id === String(idOrTmdbId) || String(i.tmdbId) === cleanId || String(i.id).includes(cleanId)) || null;
  } catch {
    return null;
  }
}

/**
 * Retrieves all continue watching items sorted by most recent
 */
export function getAllWatchProgress(profileId?: string): WatchProgressItem[] {
  try {
    const key = getStorageKey(profileId);
    const existingStr = localStorage.getItem(key);
    if (!existingStr) return [];
    const list: WatchProgressItem[] = JSON.parse(existingStr);
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

/**
 * Removes progress for a specific item
 */
export function removeWatchProgress(idOrTmdbId: string | number, profileId?: string): void {
  try {
    const key = getStorageKey(profileId);
    const existingStr = localStorage.getItem(key);
    if (!existingStr) return;
    let list: WatchProgressItem[] = JSON.parse(existingStr);
    const cleanId = String(idOrTmdbId).replace(/^(movie|tv|series)-/, '');
    list = list.filter(i => i.id !== String(idOrTmdbId) && String(i.tmdbId) !== cleanId);
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('jamtv-progress-updated', { detail: { id: idOrTmdbId, removed: true } }));
  } catch (_) {}
}
