import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.json());

// Caching middleware for API GET requests
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('/visits') && !req.path.includes('/health')) {
    // Cache for 30 minutes in browser, 1 hour in CDN
    res.setHeader('Cache-Control', 'public, max-age=7200, s-maxage=14400, stale-while-revalidate=86400');
  }
  next();
});

const PORT = 3000;

// Simple Site Visit Counter
const VISITS_FILE = path.join(process.cwd(), "visits.json");
let siteVisits = 14205; // Seeded with a fun baseline
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

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
        const offsetSign = offset[0] || '+';
        const offsetH = offset.slice(1, 3) || '00';
        const offsetM = offset.slice(3, 5) || '00';
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

// --- TMDB API & CATALOG ENGINE ---
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const cache = new Map<string, { data: any, time: number }>();
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

const TMDB_GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics"
};

const GENRE_BACKDROPS: Record<string, string> = {
  movie_28: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
  movie_12: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
  movie_16: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
  movie_35: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop",
  movie_80: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
  movie_99: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  movie_18: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
  movie_10751: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop",
  movie_14: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
  movie_36: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop",
  movie_27: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=1200&auto=format&fit=crop",
  movie_10402: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
  movie_9648: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop",
  movie_10749: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop",
  movie_878: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  movie_53: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1200&auto=format&fit=crop",
  movie_10752: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop",
  movie_37: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  tv_10759: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
  tv_10765: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  tv_10768: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop"
};

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (res.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      return fetchWithRetry(url, options, retries - 1);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

function getCleanTmdbKey(): { key: string; isV3: boolean } {
  let raw = process.env.TMDB_API_KEY?.trim() || process.env.VITE_TMDB_API_KEY?.trim() || "4e44d9029b1270a757cddc766a1bcb63";
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }
  if (raw.toLowerCase().startsWith('bearer ')) {
    raw = raw.slice(7).trim();
  }
  const isV3 = raw.length === 32 || !raw.includes('.');
  return { key: raw, isV3 };
}

function normalizeTmdbShow(item: any, forceType?: 'movie' | 'tv' | 'series'): any {
  if (!item) return null;
  const rawType = item.media_type || forceType || (item.title ? 'movie' : 'tv');
  const type = rawType === 'series' || rawType === 'tv' ? 'series' : 'movie';
  const isMovie = type === 'movie';
  const rawId = String(item.id || item.tmdbId || item._id || '');
  const cleanTmdbId = rawId.replace(/^(movie|series|tv)-/, '');
  const id = `${type === 'series' ? 'series' : 'movie'}-${cleanTmdbId}`;
  
  // Genres parsing
  let genres: { id: string; name: string }[] = [];
  if (Array.isArray(item.genres) && item.genres.length > 0) {
    genres = item.genres.map((g: any) => ({
      id: String(g.id || g.name),
      name: g.name || String(g)
    }));
  } else if (Array.isArray(item.genre_ids) && item.genre_ids.length > 0) {
    genres = item.genre_ids.map((gid: number) => ({
      id: String(gid),
      name: TMDB_GENRE_MAP[gid] || "General"
    }));
  }

  // Watch / Streaming providers parsing
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

  const directors = item.credits?.crew?.filter((c: any) => c.job === 'Director' || c.department === 'Directing').map((c: any) => c.name) || item.directors || [];
  const cast = item.credits?.cast?.filter((c: any) => c.profile_path).slice(0, 12).map((c: any) => ({ id: c.id, name: c.name, character: c.character, profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined })) || item.cast || [];
  const creators = item.created_by?.map((c: any) => c.name) || item.creators || [];

  const rawDate = item.release_date || item.first_air_date || item.releaseYear;
  const releaseYear = rawDate ? String(rawDate).split('-')[0] : undefined;
  
  const posterPath = item.poster_path 
    ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`)
    : (item.imageSet?.poster || undefined);

  const backdropPathOriginal = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/original${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.original || posterPath);
  const backdropPath1080 = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.w1080 || posterPath);

  const backdropPath720 = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w780${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.w720 || posterPath);

  return {
    id,
    imdbId: item.external_ids?.imdb_id || item.imdb_id || item.imdbId,
    tmdbId: cleanTmdbId,
    title: isMovie ? (item.title || item.name || item.original_title) : (item.name || item.title || item.original_name),
    originalTitle: isMovie ? (item.original_title || item.original_name) : (item.original_name || item.original_title),
    showType: isMovie ? 'movie' : 'series',
    releaseYear,
    overview: item.overview,
    rating: item.vote_average !== undefined ? Math.round(item.vote_average * 10) : item.rating,
    runtime: item.runtime || (Array.isArray(item.episode_run_time) ? item.episode_run_time[0] : undefined),
    genres,
    directors, creators,
    cast,
    imageSet: {
      poster: posterPath,
      verticalPoster: {
        w240: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w185${item.poster_path}`) : posterPath,
        w360: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w342${item.poster_path}`) : posterPath,
        w480: posterPath,
        w720: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w780${item.poster_path}`) : posterPath
      },
      horizontalPoster: {
        w360: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w300${item.backdrop_path}`) : backdropPath720,
        w720: backdropPath720,
        w1080: backdropPath1080,
        original: backdropPathOriginal
      }
    },
    streamingOptions,
    seasonCount: item.number_of_seasons || item.seasonCount || (item.seasons ? item.seasons.length : undefined),
    episodeCount: item.number_of_episodes || item.episodeCount,
    seasons: (item.seasons || []).map((s: any) => ({
      id: s.id || `s-${s.season_number}`,
      name: s.name || `Season ${s.season_number}`,
      seasonNumber: s.season_number,
      episodeCount: s.episode_count || 10,
      overview: s.overview,
      posterPath: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : undefined,
      airDate: s.air_date
    })),
    videos: item.videos?.results || [],
    originCountry: Array.isArray(item.origin_country) ? item.origin_country[0] : item.origin_country,
    originalLanguage: item.original_language

  };
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

const TMDB_DEFAULT_KEY = "4e44d9029b1270a757cddc766a1bcb63";

async function fetchTmdb(endpoint: string, queryParams: Record<string, string | number> = {}) {
  const authInfo = getCleanTmdbKey();

  const buildUrl = (key: string, isV3: boolean) => {
    const queryObj = new URLSearchParams();
    for (const [k, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && value !== '') {
        queryObj.append(k, String(value));
      }
    }
    if (isV3) {
      queryObj.append('api_key', key);
    }
    const queryString = queryObj.toString();
    return `${TMDB_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
  };

  const primaryUrl = buildUrl(authInfo.key, authInfo.isV3);

  if (cache.has(primaryUrl)) {
    const cached = cache.get(primaryUrl)!;
    if (Date.now() - cached.time < CACHE_DURATION_MS) {
      return cached.data;
    }
  }

  const primaryHeaders: Record<string, string> = {
    "Accept": "application/json"
  };
  if (!authInfo.isV3) {
    primaryHeaders["Authorization"] = `Bearer ${authInfo.key}`;
  }

  let response: Response;
  try {
    response = await fetchWithRetry(primaryUrl, { headers: primaryHeaders });
  } catch (netErr) {
    // If primary network fetch failed, attempt standard key
    const fallbackUrl = buildUrl(TMDB_DEFAULT_KEY, true);
    response = await fetchWithRetry(fallbackUrl, { headers: { "Accept": "application/json" } });
  }

  // If user-provided key failed with 401 or 403, retry with standard key
  if (!response.ok && (response.status === 401 || response.status === 403) && authInfo.key !== TMDB_DEFAULT_KEY) {
    const fallbackUrl = buildUrl(TMDB_DEFAULT_KEY, true);
    response = await fetchWithRetry(fallbackUrl, { headers: { "Accept": "application/json" } });
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    const err = new Error(`TMDB status ${response.status}: ${errText}`);
    (err as any).status = response.status;
    throw err;
  }

  const data = await response.json();
  cache.set(primaryUrl, { data, time: Date.now() });
  return data;
}

// Translates frontend request query parameters to valid TMDB discover parameters
function buildTmdbDiscoverParams(query: Record<string, any>, type: 'movie' | 'tv'): Record<string, any> {
  const params: Record<string, any> = {
    include_adult: 'false',
    include_video: 'false',
    page: query.cursor || query.page || 1,
    language: 'en-US'
  };

  // Watch Provider (e.g. Netflix 8, Disney 337, Prime 9, Apple 350, Max 1899)
  const provider = query.catalogs || query.with_watch_providers;
  if (provider) {
    params.with_watch_providers = String(provider);
    params.watch_region = (query.country || 'US').toString().toUpperCase();
    if (query.with_watch_monetization_types) params.with_watch_monetization_types = String(query.with_watch_monetization_types);
  }

  // Sorting
  const orderBy = query.order_by || query.sort_by;
  if (orderBy === 'popularity_1week' || orderBy === 'popularity_1month' || orderBy === 'popularity_alltime' || orderBy === 'popularity.desc') {
    params.sort_by = 'popularity.desc';
  } else if (orderBy === 'rating' || orderBy === 'vote_average.desc' || orderBy === 'top_rated') {
    params.sort_by = 'vote_average.desc';
    params['vote_count.gte'] = 300;
  } else if (orderBy === 'year_desc' || orderBy === 'release_date.desc' || orderBy === 'first_air_date.desc') {
    params.sort_by = type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc';
  } else if (orderBy === 'year_asc' || orderBy === 'release_date.asc' || orderBy === 'first_air_date.asc') {
    params.sort_by = type === 'movie' ? 'primary_release_date.asc' : 'first_air_date.asc';
  } else {
    params.sort_by = 'popularity.desc';
  }

  // In Theaters
  if (query.in_theaters === 'true' || query.in_theaters === true) {
    params.with_release_type = '2|3';
    params.region = 'US';
  }

  // Genres
  const genreId = query.movie_genre || query.tv_genre || query.with_genres || query.genre;
  if (genreId) {
    params.with_genres = String(genreId);
  }

  // Year filters
  if (query.year_min) {
    if (type === 'movie') params['primary_release_date.gte'] = `${query.year_min}-01-01`;
    else params['first_air_date.gte'] = `${query.year_min}-01-01`;
  }
  if (query.year_max) {
    if (type === 'movie') params['primary_release_date.lte'] = `${query.year_max}-12-31`;
    else params['first_air_date.lte'] = `${query.year_max}-12-31`;
  }

  return params;
}

// Genre images endpoints
app.get(["/api/genre-images", "/api/genres/images"], async (req, res) => {
  res.json(GENRE_BACKDROPS);
});

// Discover Movies endpoint
app.get("/api/movies", async (req, res) => {
  try {
    const hasProviderOrGenre = req.query.catalogs || req.query.with_watch_providers || req.query.movie_genre || req.query.with_genres;
    const isTrending = (req.query.order_by === 'popularity_1week' || req.query.order_by === 'popularity_1month') && !hasProviderOrGenre;
    
    let data;
    const inTheaters = req.query.in_theaters === 'true' || req.query.in_theaters === true;
    
    if (inTheaters) {
      data = await fetchTmdb("/movie/now_playing", {
        language: "en-US",
        region: "US",
        page: String(req.query.cursor || req.query.page || 1)
      });
    } else if (isTrending && (!req.query.cursor || req.query.cursor === '1')) {
      // Use TMDB trending endpoint for top weekly movies
      data = await fetchTmdb("/trending/movie/week", { page: String(req.query.cursor || req.query.page || 1) });
    } else {
      const tmdbParams = buildTmdbDiscoverParams(req.query, 'movie');
      console.log("Fetching discover with params:", tmdbParams);
      data = await fetchTmdb("/discover/movie", tmdbParams);
    }
    
    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'movie')).filter(Boolean);
    res.json({ 
      shows, 
      hasMore: data.page < (data.total_pages || 1), 
      nextCursor: data.page < (data.total_pages || 1) ? String(data.page + 1) : undefined 
    });
  } catch (error: any) {
    console.error("Movies fetch fallback:", error.message);
    const providerId = String(req.query.catalogs || '');
    let filtered = FALLBACK_MOVIES;
    if (providerId) {
      filtered = filtered.filter(m => m.providerIds?.includes(providerId));
      if (filtered.length === 0) filtered = FALLBACK_MOVIES;
    }
    res.json({ shows: filtered.map(s => normalizeTmdbShow(s, 'movie')), hasMore: false });
  }
});

// Discover TV Shows endpoint
app.get("/api/tv-shows", async (req, res) => {
  try {
    const hasProviderOrGenre = req.query.catalogs || req.query.with_watch_providers || req.query.tv_genre || req.query.with_genres;
    const isTrending = (req.query.order_by === 'popularity_1week' || req.query.order_by === 'popularity_1month') && !hasProviderOrGenre;

    let data;
    if (isTrending && (!req.query.cursor || req.query.cursor === '1')) {
      data = await fetchTmdb("/trending/tv/week", { page: String(req.query.cursor || req.query.page || 1) });
    } else {
      const tmdbParams = buildTmdbDiscoverParams(req.query, 'tv');
      data = await fetchTmdb("/discover/tv", tmdbParams);
    }

    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'series')).filter(Boolean);
    res.json({ 
      shows, 
      hasMore: data.page < (data.total_pages || 1), 
      nextCursor: data.page < (data.total_pages || 1) ? String(data.page + 1) : undefined 
    });
  } catch (error: any) {
    console.error("TV Shows fetch fallback:", error.message);
    const providerId = String(req.query.catalogs || '');
    let filtered = FALLBACK_SHOWS;
    if (providerId) {
      filtered = filtered.filter(s => s.providerIds?.includes(providerId));
      if (filtered.length === 0) filtered = FALLBACK_SHOWS;
    }
    res.json({ shows: filtered.map(s => normalizeTmdbShow(s, 'series')), hasMore: false });
  }
});

// Generalized Discover endpoint for Genre and filters
app.get("/api/discover", async (req, res) => {
  try {
    const showType = (req.query.show_type || '').toString().toLowerCase();
    const isTvOnly = showType === 'series' || (req.query.tv_genre && !req.query.movie_genre);
    const isMovieOnly = showType === 'movie' || (req.query.movie_genre && !req.query.tv_genre);

    if (isTvOnly) {
      const params = buildTmdbDiscoverParams(req.query, 'tv');
      const data = await fetchTmdb("/discover/tv", params);
      const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'series')).filter(Boolean);
      return res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page < data.total_pages ? String(data.page + 1) : undefined });
    }

    if (isMovieOnly) {
      const params = buildTmdbDiscoverParams(req.query, 'movie');
      const data = await fetchTmdb("/discover/movie", params);
      const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, 'movie')).filter(Boolean);
      return res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page < data.total_pages ? String(data.page + 1) : undefined });
    }

    // Default 'all': Query both movies and TV in parallel and interleave results
    const [movieData, tvData] = await Promise.all([
      fetchTmdb("/discover/movie", buildTmdbDiscoverParams(req.query, 'movie')).catch(() => ({ results: [], page: 1, total_pages: 1 })),
      fetchTmdb("/discover/tv", buildTmdbDiscoverParams(req.query, 'tv')).catch(() => ({ results: [], page: 1, total_pages: 1 }))
    ]);

    const movies = (movieData.results || []).map((s: any) => normalizeTmdbShow(s, 'movie')).filter(Boolean);
    const series = (tvData.results || []).map((s: any) => normalizeTmdbShow(s, 'series')).filter(Boolean);
    
    // Interleave
    const interleaved: any[] = [];
    const maxLen = Math.max(movies.length, series.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < movies.length) interleaved.push(movies[i]);
      if (i < series.length) interleaved.push(series[i]);
    }

    const hasMore = (movieData.page < movieData.total_pages) || (tvData.page < tvData.total_pages);
    const currentPage = parseInt(String(req.query.cursor || req.query.page || 1));

    res.json({
      shows: interleaved,
      hasMore,
      nextCursor: hasMore ? String(currentPage + 1) : undefined
    });
  } catch (error: any) {
    console.error("Discover fetch fallback:", error.message);
    res.json({ shows: [...FALLBACK_MOVIES, ...FALLBACK_SHOWS].map(s => normalizeTmdbShow(s)), hasMore: false });
  }
});

// Watch Providers
app.get("/api/watch/providers/movie", async (req, res) => {
  try {
    const data = await fetchTmdb("/watch/providers/movie", req.query);
    res.json(data);
  } catch (error: any) {
    console.error("Watch providers fetch fallback:", error.message);
    res.json({ results: [] });
  }
});

// Search Multi endpoint (search all movies and TV shows) with intelligent ranking & suggestions
app.get("/api/search", async (req, res) => {
  try {
    const rawQuery = (req.query.title || req.query.query || '').toString().trim();
    if (!rawQuery) {
      return res.json({ shows: [], hasMore: false, nextCursor: undefined });
    }

    // Extract year if specified (e.g. "Dune 2024" or "Batman 2022")
    let cleanQuery = rawQuery;
    let extractedYear: number | null = null;
    const yearMatch = rawQuery.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      extractedYear = parseInt(yearMatch[1], 10);
      cleanQuery = rawQuery.replace(/\b(19\d\d|20\d\d)\b/, '').trim();
      if (!cleanQuery) cleanQuery = rawQuery;
    }

    const page = req.query.cursor ? parseInt(String(req.query.cursor)) : (req.query.page ? parseInt(String(req.query.page)) : 1);
    
    // Perform TMDB multi search
    const data = await fetchTmdb("/search/multi", {
      query: cleanQuery,
      page: page || 1,
      include_adult: 'false',
      language: 'en-US'
    });

    let rawResults = data.results || [];

    // If multi search gave very few results on page 1, try direct movie + tv search
    if (rawResults.length < 3 && (page === 1)) {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetchTmdb("/search/movie", { query: cleanQuery, page: 1, include_adult: 'false' }).catch(() => ({ results: [] })),
          fetchTmdb("/search/tv", { query: cleanQuery, page: 1, include_adult: 'false' }).catch(() => ({ results: [] }))
        ]);
        const extraResults = [...(movieRes.results || []).map((m: any) => ({ ...m, media_type: 'movie' })), ...(tvRes.results || []).map((t: any) => ({ ...t, media_type: 'tv' }))];
        // Merge without duplicates
        const seenIds = new Set(rawResults.map((r: any) => `${r.media_type || (r.title ? 'movie' : 'tv')}-${r.id}`));
        for (const item of extraResults) {
          const key = `${item.media_type}-${item.id}`;
          if (!seenIds.has(key)) {
            seenIds.add(key);
            rawResults.push(item);
          }
        }
      } catch (_) {}
    }

    // Extract items (including known_for from people like actors/directors)
    const processedItems: any[] = [];
    const seenShowIds = new Set<string>();

    for (const item of rawResults) {
      if (!item) continue;
      if (item.media_type === 'person' && Array.isArray(item.known_for)) {
        for (const k of item.known_for) {
          const kType = k.media_type === 'tv' || !k.title ? 'series' : 'movie';
          const kKey = `${kType}-${k.id}`;
          if (!seenShowIds.has(kKey)) {
            seenShowIds.add(kKey);
            processedItems.push({ raw: k, type: kType, isPersonCredit: true, personName: item.name });
          }
        }
      } else if (item.title || item.name) {
        const type = item.media_type === 'tv' || !item.title ? 'series' : 'movie';
        const key = `${type}-${item.id}`;
        if (!seenShowIds.has(key)) {
          seenShowIds.add(key);
          processedItems.push({ raw: item, type, isPersonCredit: false });
        }
      }
    }

    // Normalize shows
    let shows = processedItems.map(({ raw, type }) => normalizeTmdbShow(raw, type)).filter(Boolean);

    // Apply genre filter if provided
    const genreFilter = req.query.movie_genre || req.query.tv_genre || req.query.with_genres;
    if (genreFilter) {
      const gStr = String(genreFilter);
      shows = shows.filter((s: any) => s.genres?.some((g: any) => g.id === gStr));
    }

    // Apply show_type filter if provided
    const showType = (req.query.show_type || '').toString().toLowerCase();
    if (showType === 'movie') {
      shows = shows.filter((s: any) => s.showType === 'movie');
    } else if (showType === 'series' || showType === 'tv') {
      shows = shows.filter((s: any) => s.showType === 'series');
    }

    // Smart Relevance Scoring & Ranking
    const lowerQuery = rawQuery.toLowerCase();
    const lowerCleanQuery = cleanQuery.toLowerCase();
    const queryWords = lowerCleanQuery.split(/\s+/).filter(Boolean);

    shows.sort((a: any, b: any) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();

      let scoreA = 0;
      let scoreB = 0;

      // Exact title match
      if (titleA === lowerQuery || titleA === lowerCleanQuery) scoreA += 120;
      if (titleB === lowerQuery || titleB === lowerCleanQuery) scoreB += 120;

      // Starts with query
      if (titleA.startsWith(lowerCleanQuery)) scoreA += 60;
      if (titleB.startsWith(lowerCleanQuery)) scoreB += 60;

      // Contains all query words
      const wordsMatchA = queryWords.every(w => titleA.includes(w));
      const wordsMatchB = queryWords.every(w => titleB.includes(w));
      if (wordsMatchA) scoreA += 35;
      if (wordsMatchB) scoreB += 35;

      // Year match bonus
      if (extractedYear) {
        if (a.releaseYear === extractedYear) scoreA += 50;
        if (b.releaseYear === extractedYear) scoreB += 50;
      }

      // Poster availability (prefer visually complete cards)
      if (a.imageSet?.verticalPoster?.w480 || a.imageSet?.poster) scoreA += 25;
      if (b.imageSet?.verticalPoster?.w480 || b.imageSet?.poster) scoreB += 25;

      // Rating & popularity signal
      scoreA += Math.min(30, (a.rating || 0) * 0.3);
      scoreB += Math.min(30, (b.rating || 0) * 0.3);

      return scoreB - scoreA;
    });

    res.json({
      shows,
      hasMore: data.page < (data.total_pages || 1),
      nextCursor: data.page < (data.total_pages || 1) ? String(data.page + 1) : undefined
    });
  } catch (error: any) {
    console.error("Search fetch fallback:", error.message);
    const q = (req.query.title || req.query.query || '').toString().toLowerCase();
    const filtered = [...FALLBACK_MOVIES, ...FALLBACK_SHOWS]
      .filter(item => (item.title || item.name || '').toLowerCase().includes(q) || (item.overview || '').toLowerCase().includes(q))
      .map(s => normalizeTmdbShow(s));
    res.json({ shows: filtered, hasMore: false });
  }
});

// Fast Instant Suggestions Endpoint for Search Autocomplete
app.get("/api/search/suggestions", async (req, res) => {
  try {
    const query = (req.query.q || req.query.query || req.query.title || '').toString().trim();
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const data = await fetchTmdb("/search/multi", {
      query,
      page: 1,
      include_adult: 'false',
      language: 'en-US'
    });

    const suggestions = (data.results || [])
      .filter((s: any) => s && (s.title || s.name))
      .slice(0, 7)
      .map((s: any) => {
        const isTv = s.media_type === 'tv' || !s.title;
        const releaseYear = s.release_date ? parseInt(s.release_date.split('-')[0]) : (s.first_air_date ? parseInt(s.first_air_date.split('-')[0]) : null);
        const poster = s.poster_path ? `https://image.tmdb.org/t/p/w185${s.poster_path}` : (s.profile_path ? `https://image.tmdb.org/t/p/w185${s.profile_path}` : null);
        return {
          id: `${isTv ? 'series' : 'movie'}-${s.id}`,
          title: s.title || s.name,
          mediaType: s.media_type || (isTv ? 'tv' : 'movie'),
          releaseYear,
          rating: s.vote_average ? Math.round(s.vote_average * 10) : null,
          poster
        };
      });

    res.json({ suggestions });
  } catch (error) {
    res.json({ suggestions: [] });
  }
});

// Trending Search Keywords
app.get("/api/search/trending", async (req, res) => {
  try {
    const data = await fetchTmdb("/trending/all/day", { page: 1 });
    const trending = (data.results || [])
      .slice(0, 8)
      .map((s: any) => ({
        id: `${s.media_type === 'tv' || !s.title ? 'series' : 'movie'}-${s.id}`,
        title: s.title || s.name,
        type: s.media_type === 'tv' || !s.title ? 'series' : 'movie'
      }));
    res.json({ trending });
  } catch (_) {
    res.json({
      trending: [
        { id: "movie-693134", title: "Dune: Part Two", type: "movie" },
        { id: "series-94605", title: "Arcane", type: "series" },
        { id: "movie-533535", title: "Deadpool & Wolverine", type: "movie" },
        { id: "series-66732", title: "Stranger Things", type: "series" },
        { id: "movie-299534", title: "Avengers: Endgame", type: "movie" },
        { id: "series-1396", title: "Breaking Bad", type: "series" }
      ]
    });
  }
});

// Show details endpoint
app.get("/api/shows/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [type, ...rest] = id.split('-');
    const realId = rest.join('-');
    const isSeries = type === 'series' || type === 'tv';
    const data = await fetchTmdb(`/${isSeries ? 'tv' : 'movie'}/${realId}`, { 
      append_to_response: 'credits,videos,watch/providers,external_ids,recommendations,similar' 
    });
    res.json(normalizeTmdbShow(data, isSeries ? 'series' : 'movie'));
  } catch (error: any) {
    console.error("Show details fallback for ID:", req.params.id, error.message);
    const cleanId = req.params.id.replace(/^(movie|series|tv)-/, '');
    const fallback = [...FALLBACK_MOVIES, ...FALLBACK_SHOWS].find(item => String(item.id) === cleanId);
    if (fallback) {
      return res.json(normalizeTmdbShow(fallback));
    }
    // Return a safe normalized template so the UI modal opens smoothly
    res.json({
      id: req.params.id,
      tmdbId: cleanId,
      title: "Streaming Title",
      showType: req.params.id.startsWith('series') || req.params.id.startsWith('tv') ? 'series' : 'movie',
      releaseYear: "2024",
      overview: "Ready to stream in high definition.",
      rating: 80,
      genres: [{ id: "28", name: "Action" }],
      directors: [],
      cast: [],
      imageSet: {}
    });
  }
});

// Related shows endpoint
app.get("/api/shows/:id/related", async (req, res) => {
  try {
    const { id } = req.params;
    const [type, ...rest] = id.split('-');
    const realId = rest.join('-');
    const isSeries = type === 'series' || type === 'tv';
    
    // Attempt recommendations first, fall back to similar
    let data;
    try {
      data = await fetchTmdb(`/${isSeries ? 'tv' : 'movie'}/${realId}/recommendations`, { page: 1 });
      if (!data.results || data.results.length === 0) {
        data = await fetchTmdb(`/${isSeries ? 'tv' : 'movie'}/${realId}/similar`, { page: 1 });
      }
    } catch {
      data = await fetchTmdb(`/${isSeries ? 'tv' : 'movie'}/${realId}/similar`, { page: 1 });
    }
    
    const shows = (data.results || []).map((s: any) => normalizeTmdbShow(s, isSeries ? 'series' : 'movie')).filter(Boolean);
    res.json(shows);
  } catch (error: any) {
    console.error("Related shows fallback:", error.message);
    const isSeries = req.params.id.startsWith('series') || req.params.id.startsWith('tv');
    res.json((isSeries ? FALLBACK_SHOWS : FALLBACK_MOVIES).map(s => normalizeTmdbShow(s, isSeries ? 'series' : 'movie')));
  }
});

// TV Season details endpoint
app.get("/api/tv/:id/season/:seasonNumber", async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const cleanId = id.replace(/^(tv|series)-/, '');
    const data = await fetchTmdb(`/tv/${cleanId}/season/${seasonNumber}`);
    
    // Normalize season details with episode objects
    const episodes = (data.episodes || []).map((ep: any) => ({
      id: ep.id || `${cleanId}-s${seasonNumber}e${ep.episode_number}`,
      episodeNumber: ep.episode_number,
      seasonNumber: ep.season_number || parseInt(seasonNumber),
      name: ep.name || `Episode ${ep.episode_number}`,
      overview: ep.overview,
      stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : undefined,
      airDate: ep.air_date,
      runtime: ep.runtime,
      voteAverage: ep.vote_average
    }));

    res.json({
      id: data.id || `season-${seasonNumber}`,
      seasonNumber: data.season_number || parseInt(seasonNumber),
      name: data.name || `Season ${seasonNumber}`,
      overview: data.overview,
      posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined,
      episodes
    });
  } catch (error: any) {
    console.error("TV season details fallback:", error.message);
    const sNum = parseInt(req.params.seasonNumber) || 1;
    res.json({
      id: `season-${sNum}`,
      seasonNumber: sNum,
      name: `Season ${sNum}`,
      episodes: Array.from({ length: 10 }, (_, i) => ({
        id: `${req.params.id}-s${sNum}e${i + 1}`,
        episodeNumber: i + 1,
        seasonNumber: sNum,
        name: `Episode ${i + 1}`,
        overview: `Season ${sNum}, Episode ${i + 1}`,
        runtime: 45
      }))
    });
  }
});

async function startServer() {
  const PORT = 3000;
  
  let viteServer;
  if (process.env.NODE_ENV !== "production") {
    const vite = await import("vite");
    viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Social Media Pre-rendering Interceptor
  app.get('*', async (req, res, next) => {
    // Only intercept paths that could be shared, ignore static assets
    if (!req.path.startsWith('/movie/') && !req.path.startsWith('/tv/') && req.path !== '/') {
      return next();
    }

    try {
      const isMovie = req.path.startsWith('/movie/');
      const isTv = req.path.startsWith('/tv/');
      
      let html = '';
      
      if (process.env.NODE_ENV !== "production") {
        const fsPath = path.resolve(process.cwd(), 'index.html');
        html = fs.readFileSync(fsPath, 'utf-8');
        html = await viteServer.transformIndexHtml(req.originalUrl, html);
      } else {
        const fsPath = path.resolve(process.cwd(), 'dist', 'index.html');
        html = fs.readFileSync(fsPath, 'utf-8');
      }

      const baseUrl = (req.headers['x-forwarded-proto'] || req.protocol) + '://' + req.get('host');
      let title = "JamBox+ | Watch Movies & TV Shows Streaming";
      let description = "Watch movies and TV shows on JamBox+. Discover your next favorite movie or series.";
      let image = baseUrl + "/preview.jpg";
      let url = baseUrl + (req.path === '/' ? '' : req.path);

      if (isMovie || isTv) {
        const parts = req.path.split('/');
        const idStr = parts[parts.length - 1];
        if (idStr) {
           try {
             const type = isMovie ? 'movie' : 'tv';
             const cleanId = idStr.replace(/^(movie|series|tv)-/, '');
             const data = await fetchTmdb(`/${type}/${cleanId}`);
             if (data && (data.title || data.name)) {
               title = `${data.title || data.name} | JamBox+`;
               description = (data.overview || description).substring(0, 200);
               const backdrop = data.backdrop_path || data.poster_path;
               if (backdrop) {
                 image = `https://image.tmdb.org/t/p/w1280${backdrop}`;
               }
             }
           } catch(e) {
             console.error('Failed to fetch social metadata for', req.path, e.message);
           }
        }
      }

      const escapeAttr = (str) => String(str).replace(/"/g, '&quot;');
      
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      
      html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/gi, `<meta property="og:title" content="${escapeAttr(title)}" />`);
      html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/gi, `<meta property="og:description" content="${escapeAttr(description)}" />`);
      html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/gi, `<meta property="og:image" content="${escapeAttr(image)}" />`);
      html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/gi, `<meta property="og:url" content="${escapeAttr(url)}" />`);
      
      html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/gi, `<meta name="twitter:title" content="${escapeAttr(title)}" />`);
      html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/gi, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
      html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/gi, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);
      
      html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/gi, `<link rel="canonical" href="${escapeAttr(url)}" />`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      next(e);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(viteServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
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

startServer();

export default app;
