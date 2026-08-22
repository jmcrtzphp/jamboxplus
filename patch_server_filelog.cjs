const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`app.get("/api/movies", async (req, res) => {
  console.log("/api/movies called with query:", req.query);`,
`app.get("/api/movies", async (req, res) => {
  require('fs').appendFileSync('server_api_movies.log', JSON.stringify(req.query) + '\\n');`
);

fs.writeFileSync('server.ts', code);
