const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('app.get("/api/watch/providers/movie"')) {
  code = code.replace(
`// Search Multi endpoint`,
`// Watch Providers
app.get("/api/watch/providers/movie", async (req, res) => {
  try {
    const data = await fetchTmdb("/watch/providers/movie", req.query);
    res.json(data);
  } catch (error: any) {
    console.error("Watch providers fetch fallback:", error.message);
    res.json({ results: [] });
  }
});

// Search Multi endpoint`
  );
  fs.writeFileSync('server.ts', code);
}
