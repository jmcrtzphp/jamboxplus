// Test if the application actually runs
import http from 'http';
http.get('http://localhost:3000/api/movies?catalogs=netflix', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
