const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf8');

code = code.replace(
  /export async function searchTitle\(params: FilterParams\): Promise<PaginatedResult<Show>> \{[\s\S]*?const data = await tmdbRequest<any>\('\/search', params\);/,
  `export async function searchTitle(params: FilterParams): Promise<PaginatedResult<Show>> {
  const data = await tmdbRequest<any>('/search', params);`
);

fs.writeFileSync('src/lib/tmdb.ts', code);
