import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";

const app = express();
app.use(compression());
const PORT = 3000;

// Simple Site Visit Counter
const VISITS_FILE = path.join(process.cwd(), "visits.json");
let siteVisits = 14205; // Seeded with a fun number
try {
  if (fs.existsSync(VISITS_FILE)) {
    siteVisits = JSON.parse(fs.readFileSync(VISITS_FILE, "utf-8")).visits || 14205;
  }
} catch (e) {
  // ignore
}

function saveVisits() {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify({ visits: siteVisits }));
  } catch (e) {
    // ignore
  }
}

const visitClients = new Set<express.Response>();

app.get("/api/visits", (req, res) => {
  if (req.headers.accept && req.headers.accept.includes("text/event-stream")) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    visitClients.add(res);
    res.write(`data: ${JSON.stringify({ visits: siteVisits })}\n\n`);

    req.on("close", () => {
      visitClients.delete(res);
    });
    return;
  }
  res.json({ visits: siteVisits });
});

app.post("/api/visits", (req, res) => {
  siteVisits++;
  saveVisits();
  
  const data = `data: ${JSON.stringify({ visits: siteVisits })}\n\n`;
  for (const client of visitClients) {
    client.write(data);
  }
  
  res.json({ visits: siteVisits });
});

const EPG_URL = "https://raw.githubusercontent.com/djdoolky76/Mediaquest-EPG/main/cignal_epg.xml";
let epgCache: any = {};
let lastFetchTime = 0;

async function fetchAndParseEPG() {
  try {
    const res = await fetch(EPG_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    
    // Parse channels
    const channels: Record<string, string> = {};
    const channelRegex = /<channel id="([^"]+)">[\s\S]*?<display-name[^>]*>([^<]+)<\/display-name>/g;
    let match;
    while ((match = channelRegex.exec(xml)) !== null) {
      channels[match[1]] = match[2];
    }

    // Parse programs
    const progRegex = /<programme start="([^"]+)" stop="([^"]+)" channel="([^"]+)">\s*<title[^>]*>([^<]+)<\/title>/g;
    const parsedEpg: any = {};
    
    while ((match = progRegex.exec(xml)) !== null) {
      const startStr = match[1];
      const stopStr = match[2];
      const channelId = match[3];
      const title = match[4];
      
      const parseDate = (dStr: string) => {
        const y = dStr.slice(0, 4);
        const m = dStr.slice(4, 6);
        const d = dStr.slice(6, 8);
        const h = dStr.slice(8, 10);
        const min = dStr.slice(10, 12);
        const sec = dStr.slice(12, 14);
        const offset = dStr.slice(15);
        const offsetSign = offset[0];
        const offsetH = offset.slice(1, 3);
        const offsetM = offset.slice(3, 5);
        return new Date(`${y}-${m}-${d}T${h}:${min}:${sec}${offsetSign}${offsetH}:${offsetM}`);
      };
      
      if (!parsedEpg[channelId]) {
        parsedEpg[channelId] = [];
      }
      parsedEpg[channelId].push({
        start: parseDate(startStr).getTime(),
        stop: parseDate(stopStr).getTime(),
        title,
        channelName: channels[channelId]
      });
    }
    
    epgCache = parsedEpg;
    lastFetchTime = Date.now();
    console.log(`EPG Fetched: ${Object.keys(epgCache).length} channels parsed.`);
  } catch (err) {
    console.error("Failed to fetch EPG:", err);
  }
}

app.get("/api/epg", async (req, res) => {
  if (Date.now() - lastFetchTime > 1000 * 60 * 60) {
    fetchAndParseEPG();
  }
  
  if (!epgCache || Object.keys(epgCache).length === 0) {
    if (lastFetchTime === 0) {
      await fetchAndParseEPG();
    }
  }
  
  const now = Date.now();
  const currentEpg: any = {};
  
  for (const channelId in epgCache) {
    const programs = epgCache[channelId];
    const upcomingProgs = programs
      .filter((p: any) => p.stop > now)
      .sort((a: any, b: any) => a.start - b.start)
      .slice(0, 4);

    if (upcomingProgs.length > 0) {
      currentEpg[channelId] = upcomingProgs.map((p: any) => ({
        title: p.title,
        start: p.start,
        stop: p.stop,
        channelName: p.channelName
      }));
    }
  }
  
  res.json(currentEpg);
});

// --- TMDB API ---
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const cache = new Map<string, { data: any, time: number }>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const requestQueue: (() => void)[] = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      task();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  isProcessingQueue = false;
}

function enqueueRequest<T>(taskFn: () => Promise<T>, maxRetries = 3): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = async (retriesLeft: number) => {
      try {
        const res = await taskFn();
        // @ts-ignore
        if (res.status === 429 && retriesLeft > 0) {
          console.warn("429 Too Many Requests, retrying...");
          setTimeout(() => {
            requestQueue.push(() => attempt(retriesLeft - 1));
            processQueue();
          }, 1500 + Math.random() * 1000);
          return;
        }
        resolve(res);
      } catch (err) {
        if (retriesLeft > 0) {
          setTimeout(() => {
            requestQueue.push(() => attempt(retriesLeft - 1));
            processQueue();
          }, 1500 + Math.random() * 1000);
        } else {
          reject(err);
        }
      }
    };
    
    requestQueue.push(() => attempt(maxRetries));
    processQueue();
  });
}

function normalizeTmdbShow(item: any, forceType?: 'movie' | 'tv'): any {
  if (!item) return null;
  const type = forceType || item.media_type || (item.title ? 'movie' : 'tv');
  const isMovie = type === 'movie';
  const id = item.id ? `${type}-${item.id}` : (item._id || 'unknown');
  
  const genres = item.genres ? item.genres.map((g: any) => ({ id: String(g.id || g.name), name: g.name || g })) : [];
  
  let streamingOptions: any = {};
  if (item['watch/providers'] && item['watch/providers'].results) {
    for (const [countryCode, data] of Object.entries<any>(item['watch/providers'].results)) {
      const opts: any[] = [];
      const providers = [...(data.flatrate || []), ...(data.buy || []), ...(data.rent || [])];
      const uniqueProviders = new Map();
      for (const p of providers) {
        if (!uniqueProviders.has(p.provider_id)) {
          uniqueProviders.set(p.provider_id, true);
          opts.push({
            service: {
              id: String(p.provider_id),
              name: p.provider_name,
              imageSet: {
                lightThemeImage: `https://image.tmdb.org/t/p/w200${p.logo_path}`,
                darkThemeImage: `https://image.tmdb.org/t/p/w200${p.logo_path}`,
                whiteImage: `https://image.tmdb.org/t/p/w200${p.logo_path}`,
              }
            },
            type: "stream",
            link: data.link
          });
        }
      }
      streamingOptions[countryCode.toLowerCase()] = opts;
    }
  } else if (item.streamingOptions) {
    streamingOptions = item.streamingOptions;
  }

  const directors = item.credits?.crew?.filter((c: any) => c.job === 'Director').map((c: any) => c.name) || item.directors || [];
  const cast = item.credits?.cast?.slice(0, 5).map((c: any) => c.name) || item.cast || [];

  return {
    id,
    tmdbId: String(item.id || item.tmdbId || ''),
    title: isMovie ? (item.title || item.name) : (item.name || item.title),
    originalTitle: isMovie ? (item.original_title || item.original_name) : (item.original_name || item.original_title),
    showType: isMovie ? 'movie' : 'series',
    releaseYear: (isMovie ? item.release_date : item.first_air_date)?.split('-')[0] || item.releaseYear || undefined,
    overview: item.overview,
    rating: item.vote_average ? Math.round(item.vote_average * 10) : item.rating,
    runtime: item.runtime || (item.episode_run_time?.[0]),
    genres,
    directors,
    cast,
    imageSet: {
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.imageSet?.poster,
      horizontalPoster: {
        w1080: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : item.imageSet?.horizontalPoster?.w1080,
        w720: item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : item.imageSet?.horizontalPoster?.w720
      }
    },
    streamingOptions,
    seasonCount: item.number_of_seasons || item.seasonCount || (item.seasons ? item.seasons.length : undefined),
    episodeCount: item.number_of_episodes || item.episodeCount,
    seasons: (item.seasons || []).map((s: any) => ({
      id: s.id,
      name: s.name || `Season ${s.season_number}`,
      seasonNumber: s.season_number,
      episodeCount: s.episode_count || 10,
      overview: s.overview,
      posterPath: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined,
      airDate: s.air_date
    })),
  };
}

function getCleanTmdbKey(): { key: string; isV3: boolean } | null {
  let raw = process.env.TMDB_API_KEY?.trim() || process.env.VITE_TMDB_API_KEY?.trim();
  if (!raw) return null;
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }
  if (raw.toLowerCase().startsWith('bearer ')) {
    raw = raw.slice(7).trim();
  }
  if (!raw) return null;
  const isV3 = raw.length === 32 || !raw.includes('.');
  return { key: raw, isV3 };
}

// Fallback curated catalog data for seamless offline / unauthenticated usage
const FALLBACK_MOVIES: any[] = [
  {
    id: 693134,
    title: "Dune: Part Two",
    release_date: "2024-03-01",
    vote_average: 8.3,
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    backdrop_path: "/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    genres: [{ id: 878, name: "Science Fiction" }, { id: 12, name: "Adventure" }],
    providerIds: ['1899', '8', '9'],
    in_theaters: true
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    release_date: "2024-07-24",
    vote_average: 7.7,
    overview: "A listless Wade Wilson toils in civilian life with his days as the mercenary Deadpool behind him. But when an existential threat emerges, Wade suits up again alongside Wolverine.",
    backdrop_path: "/yDHYTfaA95btioP94roeyKpZ53.jpg",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }],
    providerIds: ['337', '9'],
    in_theaters: true
  },
  {
    id: 872585,
    title: "Oppenheimer",
    release_date: "2023-07-21",
    vote_average: 8.1,
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    backdrop_path: "/rLb2cw0iwACaLTq9N3PRXiUFqJJ.jpg",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 36, name: "History" }],
    providerIds: ['8', '9', '350']
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    release_date: "2024-06-12",
    vote_average: 7.6,
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for unexpected new Emotions: Anxiety, Envy, Ennui, and Embarrassment.",
    backdrop_path: "/p5ozvmdgsmbWe0H8Xk74O7GVIYm.jpg",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    genres: [{ id: 16, name: "Animation" }, { id: 10751, name: "Family" }],
    providerIds: ['337'],
    in_theaters: true
  },
  {
    id: 573435,
    title: "Bad Boys: Ride or Die",
    release_date: "2024-06-05",
    vote_average: 7.5,
    overview: "Miami's favorite bad boys are back on the run when their late captain is falsely accused of corruption.",
    backdrop_path: "/ga4OLm4qLxO1YMioZw3YdpR5qqb.jpg",
    poster_path: "/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }],
    providerIds: ['8', '9']
  },
  {
    id: 912649,
    title: "Venom: The Last Dance",
    release_date: "2024-10-23",
    vote_average: 6.8,
    overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.",
    backdrop_path: "/3V4kLQg0kSqPLctI5ziYWuqAZYF.jpg",
    poster_path: "/aosm8Vh9ypRBvt6vKcHGx9Q9pqU.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }],
    providerIds: ['8', '9', '1899'],
    in_theaters: true
  },
  {
    id: 402431,
    title: "Wicked",
    release_date: "2024-11-20",
    vote_average: 7.4,
    overview: "Elphaba, an ostracized green-skinned girl, and Glinda, a bubbly aristocrat, form an unlikely bond in the Land of Oz.",
    backdrop_path: "/uKb22E2nlzr914qA9KyA5BQJ8sw.jpg",
    poster_path: "/xDGbDeRNXbEzG9s5pnwE5wGj5Ww.jpg",
    genres: [{ id: 14, name: "Fantasy" }, { id: 10749, name: "Romance" }],
    providerIds: ['9', '350'],
    in_theaters: true
  },
  {
    id: 933260,
    title: "The Substance",
    release_date: "2024-09-18",
    vote_average: 7.3,
    overview: "A fading celebrity decides to use a black-market drug, a cell-replicating substance that temporarily creates a younger, better version of herself.",
    backdrop_path: "/7h6TqPB3ES5RiCwhRQeOkOBAC4q.jpg",
    poster_path: "/lqoMzCcZYEFK729Fc6r0pfZ24CW.jpg",
    genres: [{ id: 27, name: "Horror" }, { id: 878, name: "Science Fiction" }],
    providerIds: ['8', '1899']
  }
];

const FALLBACK_SHOWS: any[] = [
  {
    id: 94605,
    name: "Arcane",
    first_air_date: "2021-11-06",
    vote_average: 8.7,
    overview: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    poster_path: "/fqldf2t8ztc9aiwn396mlX3Yq1m.jpg",
    genres: [{ id: 16, name: "Animation" }, { id: 10765, name: "Sci-Fi & Fantasy" }],
    providerIds: ['8']
  },
  {
    id: 106379,
    name: "Fallout",
    first_air_date: "2024-04-10",
    vote_average: 8.3,
    overview: "The story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, vault dwellers journey into the wasteland.",
    backdrop_path: "/2rmK7mnchsl935x740Qe2bMyd2P.jpg",
    poster_path: "/AnsZu4i767F3T8jSg0bX9QG7m0Y.jpg",
    genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }, { id: 18, name: "Drama" }],
    providerIds: ['9']
  },
  {
    id: 93405,
    name: "Squid Game",
    first_air_date: "2021-09-17",
    vote_average: 7.8,
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a massive prize with deadly high stakes.",
    backdrop_path: "/ik8684v57g0bT1gVv2a8k7E1P8k.jpg",
    poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 9648, name: "Mystery" }],
    providerIds: ['8']
  },
  {
    id: 94997,
    name: "House of the Dragon",
    first_air_date: "2022-08-21",
    vote_average: 8.4,
    overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. But an internal conflict threatens everything.",
    backdrop_path: "/etj5CuMuamBspGQ3VO007kth8ob.jpg",
    poster_path: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg",
    genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }, { id: 18, name: "Drama" }],
    providerIds: ['1899']
  },
  {
    id: 126308,
    name: "Shōgun",
    first_air_date: "2024-02-27",
    vote_average: 8.5,
    overview: "In feudal Japan, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.",
    backdrop_path: "/4t0HfCqX53yT0s4qO4w368EepUj.jpg",
    poster_path: "/7O4iVfOMQmdCSPxOg1xnzNGAcTl.jpg",
    genres: [{ id: 18, name: "Drama" }, { id: 10768, name: "War & Politics" }],
    providerIds: ['337']
  },
  {
    id: 97546,
    name: "Ted Lasso",
    first_air_date: "2020-08-14",
    vote_average: 8.5,
    overview: "An American football coach is hired to manage a British soccer team. What he lacks in knowledge, he makes up for with optimism.",
    backdrop_path: "/qtfMr08K5qJRfu7AZiOcaPL0pBx.jpg",
    poster_path: "/5fhZdwP1DVJ0FySXBKQOOeXCqA.jpg",
    genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
    providerIds: ['350']
  },
  {
    id: 119051,
    name: "Wednesday",
    first_air_date: "2022-11-23",
    vote_average: 8.5,
    overview: "A sleuthing, supernaturally infused mystery charting Wednesday Addams' years as a student at Nevermore Academy.",
    backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    poster_path: "/9PFonQ921jhuTMqq29dnWJdaRm2.jpg",
    genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }, { id: 9648, name: "Mystery" }],
    providerIds: ['8']
  }
];

async function fetchTmdb(endpoint: string, queryParams: Record<string, string | number> = {}) {
  const authInfo = getCleanTmdbKey();

  if (!authInfo) {
    throw new Error("TMDB_API_KEY_UNAVAILABLE");
  }

  const queryObj = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null && value !== '') {
      queryObj.append(key, String(value));
    }
  }
  
  if (authInfo.isV3) {
    queryObj.append('api_key', authInfo.key);
  }

  const queryString = queryObj.toString();
  const url = `${TMDB_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

  if (cache.has(url)) {
    const cached = cache.get(url)!;
    if (Date.now() - cached.time < CACHE_DURATION_MS) {
      return cached.data;
    }
  }

  const headers: Record<string, string> = {
    "Accept": "application/json"
  };
  if (!authInfo.isV3) {
    headers["Authorization"] = `Bearer ${authInfo.key}`;
  }

  const response = await enqueueRequest(() => fetch(url, { headers }));

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    const err = new Error(`TMDB status ${response.status}: ${errText}`);
    (err as any).status = response.status;
    throw err;
  }

  const data = await response.json();
  cache.set(url, { data, time: Date.now() });
  return data;
}


let cachedGenreImages: Record<string, string> | null = null;
let fetchingGenreImagesPromise: Promise<Record<string, string>> | null = null;

function fetchGenreImagesInternal() {
  if (cachedGenreImages) return Promise.resolve(cachedGenreImages);
  if (!fetchingGenreImagesPromise) {
    fetchingGenreImagesPromise = (async () => {
      const movieGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];
      const tvGenres = [10762, 10763, 10764, 10766, 10767];
      const results: Record<string, string> = {};
      const promises = [];

      for (const mg of movieGenres) {
        promises.push(
          fetchTmdb("/discover/movie", { with_genres: mg, page: 1, sort_by: "popularity.desc" })
            .then(data => {
              if (data.results && data.results.length > 0) {
                const item = data.results.find((r: any) => r.backdrop_path) || data.results[0];
                if (item && item.backdrop_path) {
                  results[`movie_${mg}`] = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
                }
              }
            }).catch(console.error)
        );
      }
      for (const tg of tvGenres) {
        promises.push(
          fetchTmdb("/discover/tv", { with_genres: tg, page: 1, sort_by: "popularity.desc" })
            .then(data => {
              if (data.results && data.results.length > 0) {
                const item = data.results.find((r: any) => r.backdrop_path) || data.results[0];
                if (item && item.backdrop_path) {
                  results[`tv_${tg}`] = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
                }
              }
            }).catch(console.error)
        );
      }
      await Promise.all(promises);
      cachedGenreImages = results;
      return results;
    })();
  }
  return fetchingGenreImagesPromise;
}

app.get("/api/genres/images", async (req, res) => {
  try {
    const results = await fetchGenreImagesInternal();
    res.json(results);
  } catch (error) {
    console.error("Genre Images Error:", error);
    fetchingGenreImagesPromise = null;
    res.status(500).json({ error: "Failed to fetch genre images" });
  }
});


app.get("/api/movies", async (req, res) => {
  try {
    const data = await fetchTmdb("/discover/movie", req.query as any);
    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'movie'));
    res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page + 1 });
  } catch (error: any) {
    if (error.message === 'TMDB_API_KEY_UNAVAILABLE' || (error as any).status === 401 || (error as any).status === 403) {
       return res.json({ shows: FALLBACK_MOVIES.map(s => normalizeTmdbShow(s, 'movie')), hasMore: false });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/tv-shows", async (req, res) => {
  try {
    const data = await fetchTmdb("/discover/tv", req.query as any);
    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'tv'));
    res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page + 1 });
  } catch (error: any) {
    if (error.message === 'TMDB_API_KEY_UNAVAILABLE' || (error as any).status === 401 || (error as any).status === 403) {
       return res.json({ shows: FALLBACK_SHOWS.map(s => normalizeTmdbShow(s, 'tv')), hasMore: false });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/discover", async (req, res) => {
  try {
    const isTv = req.query.with_networks || req.query.first_air_date_year || req.query.with_type || req.query.show_type === 'series';
    const endpoint = isTv ? "/discover/tv" : "/discover/movie";
    const data = await fetchTmdb(endpoint, req.query as any);
    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, isTv ? 'tv' : 'movie'));
    res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page + 1 });
  } catch (error: any) {
    if (error.message === 'TMDB_API_KEY_UNAVAILABLE' || (error as any).status === 401 || (error as any).status === 403) {
       return res.json({ shows: [...FALLBACK_MOVIES, ...FALLBACK_SHOWS].map(s => normalizeTmdbShow(s)), hasMore: false });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const data = await fetchTmdb("/search/multi", req.query as any);
    const shows = (data.results || []).filter((s:any) => s.media_type !== 'person').map((s: any) => normalizeTmdbShow(s));
    res.json(shows);
  } catch (error: any) {
    if (error.message === 'TMDB_API_KEY_UNAVAILABLE' || (error as any).status === 401 || (error as any).status === 403) {
       return res.json([...FALLBACK_MOVIES, ...FALLBACK_SHOWS].map(s => normalizeTmdbShow(s)));
    }
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shows/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [type, ...rest] = id.split('-');
    const realId = rest.join('-');
    const data = await fetchTmdb(`/${type === 'series' || type === 'tv' ? 'tv' : 'movie'}/${realId}`, { append_to_response: 'credits,videos,watch/providers' });
    res.json(normalizeTmdbShow(data, type === 'series' || type === 'tv' ? 'tv' : 'movie'));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shows/:id/related", async (req, res) => {
  try {
    const { id } = req.params;
    const [type, ...rest] = id.split('-');
    const realId = rest.join('-');
    const data = await fetchTmdb(`/${type === 'series' || type === 'tv' ? 'tv' : 'movie'}/${realId}/similar`, req.query as any);
    res.json((data.results || []).map((s: any) => normalizeTmdbShow(s, type === 'series' || type === 'tv' ? 'tv' : 'movie')));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/tv/:id/season/:seasonNumber", async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const data = await fetchTmdb(`/tv/${id}/season/${seasonNumber}`);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

fetchGenreImagesInternal().catch(console.error);
startServer();

export default app;
