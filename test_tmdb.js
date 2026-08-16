const apiKey = process.env.TMDB_API_KEY;
console.log("API Key length:", apiKey ? apiKey.length : 0);

fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
  .then(r => r.json())
  .then(data => console.log("V3 Query format response:", data.status_message || "Success!"))
  .catch(e => console.error(e));

fetch(`https://api.themoviedb.org/3/movie/popular`, {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
})
  .then(r => r.json())
  .then(data => console.log("V4 Bearer format response:", data.status_message || "Success!"))
  .catch(e => console.error(e));
