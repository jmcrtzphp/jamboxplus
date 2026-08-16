const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf8');

code = code.replace(
  /export interface FilterParams \{[\s\S]*?\}/,
  `export interface FilterParams {
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
}`
);

fs.writeFileSync('src/lib/tmdb.ts', code);
