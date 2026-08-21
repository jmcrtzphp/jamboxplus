fetch('https://api.cinesrc.com/api/shows/movie-550')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data.cast || [], null, 2)))
  .catch(console.error);
