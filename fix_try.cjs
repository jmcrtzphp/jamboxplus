const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`app.get("/api/movies", async (req, res) => {
  try {
  try {`,
`app.get("/api/movies", async (req, res) => {
  try {`
);

fs.writeFileSync('server.ts', code);
