import http from 'http';

http.get('http://localhost:3000/api/movies?catalogs=337', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
});
