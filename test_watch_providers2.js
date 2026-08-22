import http from 'http';
http.get('http://localhost:3000/api/watch/providers/movie?watch_region=US&language=en-US', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 100)));
});
