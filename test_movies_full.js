import http from 'http';
http.get('http://localhost:3000/api/movies?catalogs=337&country=us&with_watch_monetization_types=flatrate&order_by=popularity.desc', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 500)));
});
