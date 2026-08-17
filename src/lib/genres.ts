export interface UnifiedGenre {
  id: string; // The slug
  name: string;
  description: string;
  movieId: number | null;
  tvId: number | null;
  iconName: string;
  image: string;
}

export const DEFAULT_GENRE_IMAGES: Record<string, string> = {
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

export const GENRES: Record<string, UnifiedGenre> = {
  action: { name: "Action", description: "Explore Action titles", movieId: 28, tvId: 10759, iconName: "Flame", id: "action", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop" },
  adventure: { name: "Adventure", description: "Explore Adventure titles", movieId: 12, tvId: 10759, iconName: "Compass", id: "adventure", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop" },
  animation: { name: "Animation", description: "Explore Animation titles", movieId: 16, tvId: 16, iconName: "Clapperboard", id: "animation", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop" },
  comedy: { name: "Comedy", description: "Explore Comedy titles", movieId: 35, tvId: 35, iconName: "Laugh", id: "comedy", image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop" },
  crime: { name: "Crime", description: "Explore Crime titles", movieId: 80, tvId: 80, iconName: "Fingerprint", id: "crime", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop" },
  documentary: { name: "Documentary", description: "Explore Documentary titles", movieId: 99, tvId: 99, iconName: "Camera", id: "documentary", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" },
  drama: { name: "Drama", description: "Explore Drama titles", movieId: 18, tvId: 18, iconName: "Star", id: "drama", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop" },
  family: { name: "Family", description: "Explore Family titles", movieId: 10751, tvId: 10751, iconName: "Users", id: "family", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop" },
  fantasy: { name: "Fantasy", description: "Explore Fantasy titles", movieId: 14, tvId: 10765, iconName: "Wand2", id: "fantasy", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop" },
  history: { name: "History", description: "Explore History titles", movieId: 36, tvId: null, iconName: "Landmark", id: "history", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop" },
  horror: { name: "Horror", description: "Explore Horror titles", movieId: 27, tvId: null, iconName: "Skull", id: "horror", image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=1200&auto=format&fit=crop" },
  music: { name: "Music", description: "Explore Music titles", movieId: 10402, tvId: null, iconName: "Music", id: "music", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop" },
  mystery: { name: "Mystery", description: "Explore Mystery titles", movieId: 9648, tvId: 9648, iconName: "Search", id: "mystery", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop" },
  romance: { name: "Romance", description: "Explore Romance titles", movieId: 10749, tvId: null, iconName: "Heart", id: "romance", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop" },
  "science-fiction": { name: "Science Fiction", description: "Explore Science Fiction titles", movieId: 878, tvId: 10765, iconName: "Rocket", id: "science-fiction", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" },
  thriller: { name: "Thriller", description: "Explore Thriller titles", movieId: 53, tvId: null, iconName: "Zap", id: "thriller", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1200&auto=format&fit=crop" },
  war: { name: "War", description: "Explore War titles", movieId: 10752, tvId: 10768, iconName: "Shield", id: "war", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop" },
  western: { name: "Western", description: "Explore Western titles", movieId: 37, tvId: 37, iconName: "Star", id: "western", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop" },
  kids: { name: "Kids", description: "Explore Kids titles", movieId: null, tvId: 10762, iconName: "Baby", id: "kids", image: "https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?q=80&w=1200&auto=format&fit=crop" },
  news: { name: "News", description: "Explore News titles", movieId: null, tvId: 10763, iconName: "Newspaper", id: "news", image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop" },
  reality: { name: "Reality", description: "Explore Reality titles", movieId: null, tvId: 10764, iconName: "Tv", id: "reality", image: "https://images.unsplash.com/photo-1520690214124-2405c5211466?q=80&w=1200&auto=format&fit=crop" },
  soap: { name: "Soap", description: "Explore Soap titles", movieId: null, tvId: 10766, iconName: "Sparkles", id: "soap", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1200&auto=format&fit=crop" },
  talk: { name: "Talk", description: "Explore Talk titles", movieId: null, tvId: 10767, iconName: "Mic", id: "talk", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop" }
};

export const GENRE_LIST = Object.values(GENRES);
