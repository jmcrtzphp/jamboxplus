const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`app.get("/api/movies", async (req, res) => {
  try {`,
`app.get("/api/movies", async (req, res) => {
  console.log("/api/movies called with query:", req.query);
  try {`
);

fs.writeFileSync('server.ts', code);
