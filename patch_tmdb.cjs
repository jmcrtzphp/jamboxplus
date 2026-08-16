const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf8');

code = code.replace(
  /export async function fetchByGenre\(genreId: string, showType: 'movie' \| 'series' \| 'all' = 'all', country = 'US', cursor\?: string\): Promise<PaginatedResult<Show>> {[\s\S]*?return {[\s\S]*?hasMore: data\.hasMore \|\| false,[\s\S]*?nextCursor: data\.nextCursor,[\s\S]*?shows: \(data\.shows \|\| data\.result \|\| \[\]\)\.map\(normalizeShow\)[\s\S]*?};[\s\S]*?}/,
  `export async function fetchByGenre(movieId: number | null, tvId: number | null, showType: 'movie' | 'series' | 'all' = 'all', country = 'US', cursor?: string): Promise<PaginatedResult<Show>> {
  const params: any = {
    show_type: showType,
    country,
    cursor
  };
  if (movieId) params.movie_genre = movieId;
  if (tvId) params.tv_genre = tvId;

  const data = await tmdbRequest<any>('/discover', params);

  return {
    hasMore: data.hasMore || false,
    nextCursor: data.nextCursor,
    shows: (data.shows || data.result || []).map(normalizeShow)
  };
}`
);

fs.writeFileSync('src/lib/tmdb.ts', code);
