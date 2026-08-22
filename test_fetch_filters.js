// Read the code and verify
import { readFileSync } from 'fs';
let code = readFileSync('src/lib/tmdb.ts', 'utf8');
console.log(code.substring(code.indexOf('export async function fetchFilters'), code.indexOf('export async function fetchFilters') + 500));
